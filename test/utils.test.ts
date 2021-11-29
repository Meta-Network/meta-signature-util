import crypto from 'crypto';
import { authorDigest, authorDigestSign } from '../lib';
import * as utils from '../lib/utils';
import {
  KeyPair,
  AuthorDigestMetadata,
  AuthorSignatureMetadata,
} from '../src/type';

let digestMetadata: AuthorDigestMetadata;
let authorSignatureMetadata: AuthorSignatureMetadata;

Date.now = jest.fn(() => 1636198657477);

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
  test('keys should be defined as 64 length hex string', () => {
    expect(keys.public).toMatch(/0x\w{64}/);
    expect(keys.private).toMatch(/0x\w{64}/);
  });
  test('public key should not equals to private key', () => {
    expect(keys.public).not.toBe(keys.private);
  });
});

describe('test generateDigest', () => {
  const payload = {
    title: 'One testing post',
    categories: 'Meta Network,Testing',
    content: 'Some post content here...May be very long...',
    cover: 'https://cover.url.com/',
    license: 'CC BY 4.0',
    summary: 'Some post content here...',
    tags: 'Testing Tag, UnitTest',
  };
  const exceptedDigest =
    '0xed77fb2d572de7526cafe6d42adccf9e347c74f0ba342de41fd1c1aa458f6a1f';
  digestMetadata = authorDigest.generate(payload);

  test('digest in result should be sha256 hash', () => {
    expect(digestMetadata.digest).toMatch(/0x\w{64}/);
  });
  test('digest in result should be same as the excepted', () => {
    expect(digestMetadata.digest).toBe(exceptedDigest);
  });
});

describe('test generateSignature', () => {
  authorSignatureMetadata = authorDigestSign.generate(
    keys,
    'metaspace.life',
    digestMetadata.digest,
  );
  const exceptedSignature =
    '0x9ab3c80768805e7842a4c1733d47e007a35bdbcdb9a5899ed5c9df6fa353cc9ddf65e9675700e921c2aa70f895c77f3b13aa119811fccbe0cbf684c40b37d880';

  test('signature in result should be same as the excepted', () => {
    expect(authorSignatureMetadata.signature).toBe(exceptedSignature);
  });
});

describe('test verifyDigest', () => {
  const verifiedResult = authorDigest.verify(digestMetadata);
  test('verify digest result should be true if metadata is unchanged', () => {
    expect(verifiedResult).toBe(true);
  });

  const digestMetadataCopy = { ...digestMetadata };
  digestMetadataCopy.title = 'WE CHANGED THIS TITLE';
  const notVerifiedResult = authorDigest.verify(digestMetadataCopy);
  test('verify digest result should be false if metadata is changed', () => {
    expect(notVerifiedResult).toBe(false);
  });
});

describe('test verifySignature', () => {
  const verifiedResult = authorDigestSign.verify(authorSignatureMetadata);
  test('verify signature result should be true if public key is correct', () => {
    expect(verifiedResult).toBe(true);
  });

  const authorSignatureMetadataCopy = { ...authorSignatureMetadata };
  authorSignatureMetadataCopy.claim = 'another claim';
  const verifiedResultSecond = authorDigestSign.verify(
    authorSignatureMetadataCopy,
  );
  test('verify signature result should be false if metadata is changed', () => {
    expect(verifiedResultSecond).toBe(false);
  });
});
