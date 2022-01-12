import crypto from 'crypto';
import * as utils from '../lib';
import { KeyPair, MediaMetadata, AuthorMediaSignatureMetadata } from '../src';

Date.now = jest.fn(() => 163619800000);

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

const fixedSeed: string[] = [
  'boulevard',
  'pastoralist',
  'bunkerage',
  'stereotypical',
  'pensive',
  'boomlet',
  'hod',
  'preconceive',
  'sovereignty',
  'skeletal',
  'consist',
  'fed',
  'wireman',
  'lithely',
  'capelet',
  'threescore',
];

const keys: KeyPair = utils.generateKeys(fixedSeed);

const mediaMetadata: MediaMetadata = {
  title: "Remi's avatar",
  categories: 'avatar',
  cover:
    'https://storageapi.fleek.co/andoroyur-team-bucket/metanetwork/users/metaio-storage/68253563.jpeg',
  license: 'CC BY 4.0',
  tags: 'remi,avatar',
  platform: 'ipfs',
  contentType: 'image/jpeg',
  platformHash: 'bafybeie7wzzgenk6vvjiwdvooirum4g2lrwmsvjbez3a65zy4jub4vskve',
};

const exceptedMetadata: AuthorMediaSignatureMetadata = {
  '@context': 'https://metanetwork.online/ns/cms',
  '@type': 'author-media-sign',
  '@version': '2.0.0',
  signatureAlgorithm: 'curve25519',
  ...mediaMetadata,
  publicKey:
    '0x615a22628d2e236a0a41b50cb2d0eb5bf3312ca70025c9d901d6ad5d149aa006',
  nonce: '0x1b2100414a0000003e493900',
  signature:
    '0xcf442c2de06e15d9c661cd6fff7f037ddac0bbabf7dd3a8ca98fafda1bc8943ac77b633cc05fa2b6d1e775c47d0cbcb9e976fee1fb600a4bd3028fb5c711a60a',
  claim:
    'I signed with my key 0x615a22628d2e236a0a41b50cb2d0eb5bf3312ca70025c9d901d6ad5d149aa006 from this device: I authorize metanetwork.online to publish this post and upload its metadata for notarization.',
  ts: 163619800000,
};

describe('test metaNetworkGridsServerSign.generate', () => {
  test('the generated metadata should matches the excepted', () => {
    const metadata = utils.authorMediaSign.generate(
      keys,
      'metanetwork.online',
      mediaMetadata,
    );
    expect(metadata).toEqual(exceptedMetadata);
  });

  test('the generate function should throw an error if the contentType is not valid', () => {
    const copy = mediaMetadata;
    copy.contentType = 'something else';
    const generate = () =>
      utils.authorMediaSign.generate(keys, 'metanetwork.online', copy);
    expect(generate).toThrow(TypeError);
  });
});

describe('test metaNetworkGridsServerSign.verify', () => {
  test('the generated metadata should be verified', () => {
    expect(utils.authorMediaSign.verify(exceptedMetadata)).toBeTruthy();
  });
  test('the generated metadata should not be verified after being modified', () => {
    expect(
      utils.authorMediaSign.verify({
        ...exceptedMetadata,
        claim: 'changed claim',
      }),
    ).toBeFalsy();
  });
});
