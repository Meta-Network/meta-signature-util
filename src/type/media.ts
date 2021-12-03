export type MediaMetadata = {
  title: string;
  categories: string;
  platform: string;
  platformHash: string;
  contentType: string;
  cover: string;
  license: string;
  tags: string;
};

export type MediaMetadataInPayload = {
  platform: string;
  platformHash: string;
  contentType: string;
  nonce: string;
  claim: string;
};

export type AuthorMediaSignatureMetadata = {
  '@context': 'https://metanetwork.online/ns/cms';
  '@type': 'author-media-sign';
  '@version': string;
  signatureAlgorithm: 'curve25519';
  publicKey: string;
  title: string;
  categories: string;
  cover: string;
  platform: string;
  platformHash: string;
  contentType: string;
  license: string;
  signature: string;
  tags: string;
  nonce: string;
  claim: string;
  ts: number;
};
