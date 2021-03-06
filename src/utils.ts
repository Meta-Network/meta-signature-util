import crypto from 'crypto';
import niceware from 'niceware';
import * as curve from 'curve25519-js';

import { KeyValuePair, MetadataInPayload } from './type';

/**
 * Convert Uint8 TypedArray to hex string, also append '0x' to the start.
 * @param {Uint8Array} uint8 TypeArray to convert
 * @returns {string} result string
 */
export const uint8ToHexString = (uint8: Uint8Array): string =>
  `0x${Buffer.from(uint8).toString('hex')}`;

/**
 * Convert hex string back to Uint8 TypedArray.
 * Code is from: https://stackoverflow.com/a/50868276/5299236
 * @param {string} hexString
 * @returns {Uint8Array}
 */
export const hexStringToUint8 = (hexString: string) => {
  const hex = hexString.slice(2).match(/.{1,2}/g);
  if (!hex) {
    throw new TypeError('The param is not a valid hex string');
  }
  return new Uint8Array(hex.map((byte) => parseInt(byte, 16)));
};

/**
 * Create a nonce for signing messages.
 * @returns {string} nonce string
 */
export const createNonce = () => uint8ToHexString(crypto.randomBytes(12));

/**
 * Generate a random 16 words (32bits length) passphrase as seed by niceware.
 * You can pass the seed to generateKey function.
 * @returns {string[]} passphrase array
 */
export const generateSeed = (): string[] => niceware.generatePassphrase(32);

/**
 * Generates a new key pair from the given seed and returns it as object.
 * Each word of the passphrase array should be in the 'niceware' wordlist.
 * see: https://www.npmjs.com/package/niceware
 * @param {string[]} passphrase
 * @returns {{public: Uint8Array, private: Uint8Array}} key pair
 */
export const generateKeys = (
  passphrase: string[],
): { public: string; private: string } => {
  const seed = niceware.passphraseToBytes(passphrase);
  const keys = curve.generateKeyPair(seed);
  return {
    private: uint8ToHexString(keys.private),
    public: uint8ToHexString(keys.public),
  };
};

/**
 * Create a key-value based string for sign.
 * Input can be any object with string values,
 * but recommend using the type MetadataInPayload.
 * @param {Record<string, any>} metadata
 * @param {number | false} timestamp specific the timestamp.
 * If not given, the current timestamp will be used.
 * If it's false, then no timestamp is passed into the payload
 * @returns {{payload: string, timestamp: number}}
 */
export const createKeyValueByMetadataPayload = (
  metadata: Record<string, any>,
  timestamp?: number | false,
): {
  payload: string;
  timestamp?: number;
} => {
  const sortMetadataByTitle = (a: KeyValuePair, b: KeyValuePair) => {
    // eslint-disable-next-line no-nested-ternary
    return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0;
  };

  const payloadBase = Object.entries(metadata)
    .sort(sortMetadataByTitle)
    .map((e) => e.map((i) => encodeURIComponent(i.toString())).join('='))
    .join('&');

  if (timestamp === false) {
    return {
      payload: payloadBase,
    };
  }

  const ts = timestamp ?? Date.now();
  const payload = `${payloadBase}&ts=${ts}`;

  return {
    payload,
    timestamp: ts,
  };
};

/**
 * Create a sha256 digest based on input string.
 * In this project, it could be a key-value string,
 * that created by function createKeyValueByMetadataPayload.
 * @param {string} payload
 * @returns {string}
 */
export const createDigest = (payload: string): string =>
  `0x${crypto.createHash('sha256').update(payload).digest('hex')}`;

export const createSignature = (
  privateKey: string,
  payload: string,
): string => {
  let privateKeyUint8: Uint8Array;

  try {
    privateKeyUint8 = hexStringToUint8(privateKey);
  } catch {
    throw new TypeError('The private key is not a valid hex string');
  }

  const sign = curve.sign(
    privateKeyUint8,
    new TextEncoder().encode(payload),
    null,
  );
  return uint8ToHexString(sign);
};

/**
 * Verify digest.
 * @param digest digest to verify
 * @param payloadObject payload to generate the digest
 * @param timestamp timestamp used in the payload
 * @returns {boolean} verify result
 */
export const verifyDigest = (
  digest: string,
  payloadObject: Record<string, any>,
  timestamp: number | false,
): boolean => {
  const { payload } = createKeyValueByMetadataPayload(payloadObject, timestamp);
  return digest === createDigest(payload);
};

/**
 * Verify curve25519 signature generated by other functions.
 * Signature and publicKey must in the metadata.
 * If a payload contains other params, pass them as an object to the second param.
 * @param {AuthorPostSignatureMetadata} metadata to verify
 * @param {Record<string, any>} params to be automatically inserted to the payload
 * @returns {boolean} verify result
 */
export const verifySignature = (
  metadata: {
    signature: string;
    publicKey: string;
    claim: string;
    nonce: string;
    ts: number;
  },
  params?: Record<string, any>,
): boolean => {
  let metadataPayload: Partial<MetadataInPayload> = {
    nonce: metadata.nonce,
    claim: metadata.claim,
  };

  if (params) {
    metadataPayload = {
      ...metadataPayload,
      ...params,
    };
  }

  const { payload } = createKeyValueByMetadataPayload(
    metadataPayload,
    metadata.ts,
  );

  // convert hex strings to Uint8Array
  let keyUint8: Uint8Array;
  let signatureUint8: Uint8Array;

  try {
    keyUint8 = hexStringToUint8(metadata.publicKey);
  } catch {
    throw new TypeError('The public key is not a valid hex string');
  }

  try {
    signatureUint8 = hexStringToUint8(metadata.signature);
  } catch {
    throw new TypeError('The signature is not a valid hex string');
  }

  return curve.verify(
    keyUint8,
    new TextEncoder().encode(payload),
    signatureUint8,
  );
};
