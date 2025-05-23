
const mongoose = require('mongoose');
const express = require('express');
const http = require('http');
const axios = require("axios");
const dbs = require('./schema.js');
const utils = require('./utils.js');
const config = require('./config.js');
const { createHash } = require('crypto');

var db = null;
var app = express();

var vdf_height = false;
var sync_time = null;

app.use(express.json());

function no_cache(req, res, next) {
    res.set('Cache-Control', 'no-cache');
    next();
}

function max_age_cache(max_age = 60) {
    return (req, res, next) => {
        res.set('Cache-Control', 'public, max-age=' + max_age);
        next();
    }
}


app.get('/pool/info', max_age_cache(60), async (req, res) =>
{
    res.json({
        name: config.pool_name,
        description: config.pool_description,
        fee: config.pool_fee,
        logo_path: config.logo_path,
        protocol_version: 1,
        pool_target: config.pool_target,
        min_difficulty: config.min_difficulty,
    });
});

app.get('/pool/stats', max_age_cache(60), async (req, res, next) =>
{
    try {
        const pool = await dbs.Pool.findOne({id: "this"});
        if(!pool) {
            throw new Error('Not initialized yet');
        }
        res.json({
            estimated_space: utils.calc_eff_space(pool.points_rate),
            partial_rate: pool.partial_rate,
            partial_errors: pool.partial_errors,
            farmers: pool.farmers,
            last_update: pool.last_update,
            last_payout: pool.last_payout,
        });
    } catch(e) {
        next(e);
    }
});

app.get('/account/info', max_age_cache(60), async (req, res, next) =>
{
    const id = req.query.id;
    try {
        const account = await dbs.Account.findOne({address: id});
        if(!account) {
            throw new Error('Account not found');
        }
        const blocks_found = await dbs.Block.countDocuments({account: id, valid: true});
        res.json({
            balance: account.balance,
            total_paid: account.total_paid,
            difficulty: account.difficulty,
            pool_share: account.pool_share,
            partial_rate: account.partial_rate,
            blocks_found: blocks_found,
            estimated_space: utils.calc_eff_space(account.points_rate),
        });
    } catch(e) {
        next(e);
    }
});

app.get('/difficulty', max_age_cache(30), async (req, res) =>
{
    const account = await dbs.Account.findOne({address: req.query.id});

    res.json({difficulty: account ? account.difficulty : config.default_difficulty});
});

app.post('/partial', no_cache, async (req, res, next) =>
{
    try {
        const now = Date.now();
        const partial = req.body;

        const out = {
            valid: false
        };
        let is_valid = true;
        let response_time = null;

        if(vdf_height) {
            const delta = vdf_height - partial.vdf_height;
            response_time = delta * config.block_interval + (now - sync_time);

            if(delta >= 0) {
                is_valid = false;
                out.error_code = 'PARTIAL_TOO_LATE';
                out.error_message = 'Partial received ' + response_time / 1e3 + ' sec too late';
            }
        } else {
            is_valid = false;
            out.error_code = 'POOL_LOST_SYNC';
            out.error_message = 'Pool lost sync with blockchain';
        }
        out.response_time = response_time;

        if(partial.vdf_height < 0 || partial.vdf_height > 4294967295
            || partial.lookup_time_ms < 0 || partial.lookup_time_ms > 4294967295)
        {
            out.error_code = 'INVALID_PARTIAL';
            out.error_message = 'Invalid numeric value for height or lookup_time_ms';
            res.json(out);
            return;
        }
        if(!partial.proof) {
            out.error_code = 'INVALID_PROOF';
            out.error_message = 'Missing proof';
            res.json(out);
            return;
        }
        const proof = partial.proof;
        const partial_diff = proof.difficulty;
        
        console.log('/partial', 'height', partial.vdf_height, 'diff', partial_diff,
            'response', response_time / 1e3, 'time', now, 'account', partial.account);

        if(proof.__type == 'mmx.ProofOfSpaceNFT') {
            const ksize = proof.ksize;
            const proof_xs = proof.proof_xs;
            if(ksize < 0 || ksize > 255) {
                out.error_code = 'INVALID_PROOF';
                out.error_message = 'Invalid proof ksize';
                res.json(out);
                return;
            }
            if(!Array.isArray(proof_xs) || proof_xs.length > 1024) {
                out.error_code = 'INVALID_PROOF';
                out.error_message = 'Invalid proof proof_xs';
                res.json(out);
                return;
            }
            for(const x of proof_xs) {
                if(x < 0 || x > 4294967295) {
                    out.error_code = 'INVALID_PROOF';
                    out.error_message = 'Proof value out of range';
                    res.json(out);
                    return;
                }
            }
        }

        if(partial_diff < 1 || partial_diff > 4503599627370495) {
            out.error_code = 'INVALID_DIFFICULTY';
            out.error_message = 'Invalid numeric value for difficulty';
            res.json(out);
            return;
        }
        var msg = proof.plot_id + ':' + proof.challenge;

        switch(proof.__type) {
            case 'mmx.ProofOfSpaceNFT':
                msg += ':' + proof.proof_xs.join(',');
                break;
            default:
                out.error_code = 'INVALID_PROOF';
                out.error_message = 'Invalid proof type: ' + proof.__type;
                res.json(out);
                return;
        }
        const hash = createHash('sha256').update(msg).digest('hex');

        if(await dbs.Partial.exists({hash: hash})) {
            out.error_code = 'DUPLICATE_PARTIAL';
            out.error_message = 'Duplicate partial';
            res.json(out);
            return;
        }
        let difficulty = config.default_difficulty;

        const account = await dbs.Account.findOne({address: partial.account});
        if(account) {
            difficulty = account.difficulty;
        }
        if(partial_diff < difficulty) {
            is_valid = false;
            out.error_code = 'PARTIAL_NOT_GOOD_ENOUGH';
            out.error_message = 'Partial difficulty too low: ' + partial_diff + ' < ' + difficulty;
        }

        const entry = new dbs.Partial({
            hash: hash,
            height: partial.vdf_height,
            account: partial.account,
            contract: partial.contract,
            harvester: partial.harvester,
            difficulty: partial_diff,
            lookup_time: partial.lookup_time_ms,
            response_time: response_time,
            time: now,
        });

        if(is_valid) {
            entry.data = partial;
            entry.points = Math.floor(difficulty);      // need to use current difficulty to avoid cheating
        } else {
            entry.valid = false;
            entry.pending = false;
            entry.points = 0;
            entry.error_code = out.error_code;
            entry.error_message = out.error_message;
        }
        await entry.save();

        out.valid = is_valid;
        out.points = entry.points;
        res.json(out);
    } catch(e) {
        next(e);
    }
});

app.use((err, req, res, next) => {
    console.log('URL', req.url);
    console.error(err);
    res.status(500).send(err.message);
});


async function query_height()
{
    try {
        const now = Date.now();
        const value = await utils.get_synced_vdf_height();
        if(value) {
            if(vdf_height == null) {
                console.log("Node synced at VDF height " + value);
            }
            if(vdf_height == null || value > vdf_height) {
                console.log("New VDF peak at", value, "time", now, "delta", now - sync_time);
                sync_time = now;
                vdf_height = value;
            }
        } else {
            if(vdf_height) {
                console.error("Node lost sync");
            }
            vdf_height = null;
        }
    } catch(e) {
        if(vdf_height) {
            console.error("Failed to get current height:", e.message);
        }
        vdf_height = null;
    }
}

async function main()
{
    db = await mongoose.connect(config.mongodb_uri);

    http.createServer(app).listen(config.server_port);

    setInterval(query_height, 500);

    console.log("Listening on port " + config.server_port);
}

main();
