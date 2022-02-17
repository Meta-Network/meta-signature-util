import { BaseSignatureMetadata } from '@/src';

export type PostMetadata = {
  title: string;
  categories: string;
  content: string;
  cover: string;
  license: string;
  summary: string;
  tags: string;
};

export type AuthorPostDigestMetadata = {
  '@context': 'https://metanetwork.online/ns/cms';
  '@type': 'author-post-digest';
  '@version': string;
  algorithm: 'sha256' | 'sha512';
  title: string;
  categories: string;
  content: string;
  cover: string;
  license: string;
  summary: string;
  tags: string;
  digest: string;
  ts: number;
};

export type AuthorPostSignatureMetadata = BaseSignatureMetadata & {
  digest: string;
  nonce: string;
  claim: string;
};
