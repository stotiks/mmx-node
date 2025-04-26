import JSONbig from "json-bigint";
export const JSONbigNative = JSONbig({ alwaysParseAsBig: false, useNativeBigInt: true });
export const JSONbigNativeString = JSONbig({ alwaysParseAsBig: false, useNativeBigInt: true, storeAsString: true });
