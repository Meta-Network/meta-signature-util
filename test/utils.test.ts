import crypto from 'crypto';
import { authorPostDigest, authorPostDigestSign } from '../lib';
import * as utils from '../lib/utils';
import {
  KeyPair,
  AuthorPostDigestMetadata,
  AuthorPostSignatureMetadata,
} from '../src';

let digestMetadata: AuthorPostDigestMetadata;
let authorSignatureMetadata: AuthorPostSignatureMetadata;

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
  test('a seed should be a 16 length Array of string', () => {
    expect(seed).toBeInstanceOf(Array);
    expect(seed.length).toBe(16);
  });
  test('two seeds should not be equal', () => {
    expect(seed).not.toEqual(fixedSeed);
  });
});

describe('test generateKeys', () => {
  test('keys should be defined as a 64 length hex string', () => {
    expect(keys.public).toMatch(/0x\w{64}/);
    expect(keys.private).toMatch(/0x\w{64}/);
  });
  test('the public key should not equal to the private key', () => {
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
  digestMetadata = authorPostDigest.generate(payload);

  test('the digest in result should be sha256 hash', () => {
    expect(digestMetadata.digest).toMatch(/0x\w{64}/);
  });

  test('the digest in result should be the same as the excepted', () => {
    expect(digestMetadata.digest).toBe(exceptedDigest);
  });

  test('test generateDigest with empty payload values', () => {
    // except this calling to be successful
    expect(
      authorPostDigest.generate({
        title: '',
        categories: '',
        content: '',
        cover: '',
        license: '',
        summary: '',
        tags: '',
      }),
    ).toEqual({
      '@context': 'https://metanetwork.online/ns/cms',
      '@type': 'author-post-digest',
      '@version': '1.1.0',
      algorithm: 'sha256',
      categories: '',
      content: '',
      cover: '',
      digest:
        '0x4c81c93371b8f17b79dcecbd9ebd5105a239e9da7906778c3e0debe81d38388c',
      license: '',
      summary: '',
      tags: '',
      title: '',
      ts: 1636198657477,
    });
  });
});

describe('test generateSignature', () => {
  test('the signature in result should be the same as the excepted', () => {
    authorSignatureMetadata = authorPostDigestSign.generate(
      keys,
      'metaspace.life',
      digestMetadata.digest,
    );
    const exceptedSignature =
      '0x67af805b96ca400e3fb97483fc8d0b67268a33a95cdb896af37dda129e5df85868bbc6bddef7e32584537b8e022fb589ba04bb84ebbb15ad27d4598f6febea84';

    expect(authorSignatureMetadata.signature).toBe(exceptedSignature);
  });
});

describe('test verifyDigest', () => {
  test('verify digest result should be true if the metadata is unchanged', () => {
    const verifiedResult = authorPostDigest.verify(digestMetadata);
    expect(verifiedResult).toBe(true);
  });

  const digestMetadataCopy = { ...digestMetadata };
  digestMetadataCopy.title = 'The title has been changed';
  const notVerifiedResult = authorPostDigest.verify(digestMetadataCopy);

  test('verify digest result should be false if the metadata is changed', () => {
    expect(notVerifiedResult).toBe(false);
  });

  test('verify digest result should be false if the digest is not match or empty', () => {
    const emptyDigestMetadata = {
      ...digestMetadata,
      digest: '',
    };
    expect(authorPostDigest.verify(emptyDigestMetadata)).toBe(false);
  });
});

describe('test verifySignature', () => {
  authorSignatureMetadata = authorPostDigestSign.generate(
    keys,
    'metaspace.life',
    digestMetadata.digest,
  );

  const verifiedResult = authorPostDigestSign.verify(authorSignatureMetadata);
  test('verify signature result should be true if the public key is correct', () => {
    expect(verifiedResult).toBe(true);
  });

  const authorSignatureMetadataCopy = { ...authorSignatureMetadata };
  authorSignatureMetadataCopy.claim = 'another claim';
  const verifiedResultSecond = authorPostDigestSign.verify(
    authorSignatureMetadataCopy,
  );
  test('verify signature result should be false if the metadata was changed', () => {
    expect(verifiedResultSecond).toBe(false);
  });
  test('should throw "The signature is not a valid hex string" when the signature is invalid', () => {
    const emptySignatureMetadata = {
      ...authorSignatureMetadata,
      signature: '',
    };
    expect(() => authorPostDigestSign.verify(emptySignatureMetadata)).toThrow(
      new TypeError('The signature is not a valid hex string'),
    );
  });
});
