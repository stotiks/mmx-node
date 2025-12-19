import { hmac } from "@noble/hashes/hmac.js";
import { sha256 } from "@noble/hashes/sha2.js";

import { getPublicKey, hashes, sign, signAsync } from "@noble/secp256k1";
hashes.hmacSha256 = (key, msg) => hmac(sha256, key, msg);

export { getPublicKey, sign, signAsync };
