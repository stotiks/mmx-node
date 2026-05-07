import { hmac } from "@noble/hashes/hmac.js";
import { sha256 } from "@noble/hashes/sha2.js";

import * as secp256k1 from "@noble/secp256k1";
secp256k1.hashes.hmacSha256 = (key, msg) => hmac(sha256, key, msg);

export default secp256k1;
