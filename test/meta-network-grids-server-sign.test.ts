import crypto from 'crypto';
import * as utils from '../lib';
import {
  KeyPair,
  BatchGridActionsMetadata,
  GridMaintenanceRequestMetadata,
} from '../src';

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

const items: Array<GridMaintenanceRequestMetadata> = [
  {
    id: 1,
    siteName: '',
    x: 0,
    y: 11,
    z: -11,
    userId: 14,
    username: 'andoroyur',
    userNickname: 'BenBen43 🌟',
    userBio: '中文介绍123',
    userAvatar: 'https://metaspace.federarks.xyz/images/logo2.png',
    subdomain: 'andoroyur19.metaspaces.life',
    metaSpaceSiteId: 114,
    metaSpaceSiteUrl: 'https://andoroyur19.metaspaces.life',
    metaSpaceSiteProofUrl: '',
    inviterUserId: 0,
  },
  {
    id: 5,
    siteName: '',
    x: 0,
    y: 12,
    z: -12,
    userId: 33,
    username: '',
    userNickname: '',
    userBio: '',
    userAvatar: 'https://i.loli.net/2021/05/13/CiEFPgWJzuk5prZ.png',
    subdomain: '',
    metaSpaceSiteId: 0,
    metaSpaceSiteUrl: '',
    metaSpaceSiteProofUrl: '',
    inviterUserId: 0,
  },
];

const exceptedMetadata: BatchGridActionsMetadata = {
  '@context': 'https://metanetwork.online/ns/grid',
  '@type': 'meta-network-grids-server-sign',
  '@version': '1.0.0',
  signatureAlgorithm: 'curve25519',
  publicKey:
    '0x615a22628d2e236a0a41b50cb2d0eb5bf3312ca70025c9d901d6ad5d149aa006',
  items,
  nonce: '0x1b2100414a0000003e493900',
  claim:
    'I, metanetwork.online maintain grids for users, using the key: 0x615a22628d2e236a0a41b50cb2d0eb5bf3312ca70025c9d901d6ad5d149aa006',
  digest: '0x60f892a3df7c3a5c8b6ae8555d33d48e02fde184373136a2aa5f679705206a64',
  signature:
    '0xa3dcd15a70427b2ae4435d47bb179d3efe29935b7864c4b43573d5e33bbc248e9bd07c2df6eb46f45131e9173290b99ebc95bd5317a3bd6fe4a1fbb34e0d0702',
  ts: 163619800000,
};

describe('test metaNetworkGridsServerSign.generate', () => {
  test('the generated metadata should matches the excepted', () => {
    const metadata = utils.metaNetworkGridsServerSign.generate(
      items,
      keys,
      'metanetwork.online',
    );
    expect(metadata).toEqual(exceptedMetadata);
  });
});

describe('test metaNetworkGridsServerSign.verify', () => {
  test('the generated metadata should be verified', () => {
    expect(
      utils.metaNetworkGridsServerSign.verify(exceptedMetadata),
    ).toBeTruthy();
  });
  test('the generated metadata should not be verified after being modified', () => {
    expect(
      utils.metaNetworkGridsServerSign.verify({
        ...exceptedMetadata,
        claim: 'changed claim',
      }),
    ).toBeFalsy();
  });
});
