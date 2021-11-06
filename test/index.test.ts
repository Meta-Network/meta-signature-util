import crypto from 'crypto';
import * as utils from '../lib';
import {
  AuthorDigestRequestMetadata,
  KeyPair,
  AuthorSignatureMetadata,
} from '../type/types';

let digestMetadata: AuthorDigestRequestMetadata;
let authorSignatureMetadata: AuthorSignatureMetadata;

Date.now = jest.fn(() => 1636198657477);
// @ts-ignore
crypto.randomBytes = jest.fn(() =>
  // @ts-ignore
  Buffer.from([
    '27',
    '33',
    'c3',
    '65',
    '74',
    '9a',
    '9e',
    '1a',
    '62',
    '73',
    '57',
    'f6',
  ]),
);

const seed: string[] = utils.generateSeed();
const fixedSeed: string[] = [
  'genetic',
  'exegete',
  'entrenching',
  'tasteful',
  'wearied',
  'palooka',
  'grumpier',
  'unconstricted',
  'bluffed',
  'czarevna',
  'fermata',
  'biology',
  'disproportionately',
  'flyby',
  'crude',
  'akvavit',
];

const keys: KeyPair = utils.generateKeys(fixedSeed);

describe('test generateSeed', () => {
  test('a seed should be 16 length Array of string', () => {
    expect(seed).toBeInstanceOf(Array);
    expect(seed.length).toBe(16);
  });
  test('two seeds should not be equal', () => {
    expect(seed).not.toEqual(fixedSeed);
  });
});

describe('test generateKeys', () => {
  test("keys should be defined and they're Uint8Array", () => {
    expect(keys.public).toBeInstanceOf(Uint8Array);
    expect(keys.private).toBeInstanceOf(Uint8Array);
  });
});

describe('test generateDigest', () => {
  const payload = {
    title: 'One testing post',
    categories: 'Meta Network,Testing',
    content: 'Some post content here...May be very long...',
    cover: 'https://cover.url.com/',
    licence: 'CC BY 4.0',
    summary: 'Some post content here...',
    tags: 'Testing Tag, UnitTest',
  };
  const exceptedDigest =
    '0x46ad03c511f5572059f92e114aa9d3e45821490a58bef57c6bd45ab799453346';
  digestMetadata = utils.generatePostDigestRequestMetadata(payload);

  test('digest in result should be sha256 hash', () => {
    expect(digestMetadata.digest).toMatch(/0x\w{64}/);
  });
  test('digest in result should be same as the excepted', () => {
    expect(digestMetadata.digest).toBe(exceptedDigest);
  });
});

describe('test generateSignature', () => {
  authorSignatureMetadata = utils.generateAuthorDigestSignMetadata(
    keys,
    'metaspace.life',
    digestMetadata.digest,
  );
  const exceptedSignature =
    '0xa376e5290d1f4e5562cb08b81ae79f777ca5dc6ebb35c23cc64892e4f88121fc3d1d2aedef30780eea604974d34a65f8d8cc1d243e26b9687e3aa050dd11248b';

  test('signature in result should be same as the excepted', () => {
    expect(authorSignatureMetadata.signature).toBe(exceptedSignature);
  });
});

describe('test verifyDigest', () => {
  const verifiedResult = utils.verifyDigest(digestMetadata);
  test('verify digest result should be true if metadata is unchanged', () => {
    expect(verifiedResult).toBe(true);
  });

  const digestMetadataCopy = { ...digestMetadata };
  digestMetadataCopy.title = 'WE CHANGED THIS TITLE';
  const notVerifiedResult = utils.verifyDigest(digestMetadataCopy);
  test('verify digest result should be false if metadata is changed', () => {
    expect(notVerifiedResult).toBe(false);
  });
});

describe('test verifySignature', () => {
  const verifiedResult = utils.verifyMetadataSignature(
    authorSignatureMetadata,
    authorSignatureMetadata.digest,
  );
  test('verify digest result should be true if metadata is unchanged', () => {
    expect(verifiedResult).toBe(true);
  });

  const digestMetadataCopy = { ...digestMetadata };
  digestMetadataCopy.title = 'WE CHANGED THIS TITLE';
  const notVerifiedResult = utils.verifyDigest(digestMetadataCopy);
  test('verify digest result should be false if metadata is changed', () => {
    expect(notVerifiedResult).toBe(false);
  });
});
