import { KeyPair, MetadataInPayload, SignatureMetadata } from 'src/type/types';
import {
  createKeyValueByMetadataPayload,
  createNonce,
  createSignature,
} from 'src/utils';

const generateAuthorPublishMetaSpaceRequestMetadata = (
  authorKeys: KeyPair,
  serverDomain: string,
): SignatureMetadata => {
  const publicKey = authorKeys.public;

  const authorPublishRequestMetadataHeader: Partial<SignatureMetadata> = {
    '@context': 'https://metanetwork.online/ns/cms',
    '@type': 'author-publish-meta-space-request',
    '@version': '1.0.0',
    signatureAlgorithm: 'curve25519',
    publicKey,
  };

  const authorPublishRequestPayload: Partial<MetadataInPayload> = {
    nonce: createNonce(),
    claim: `I authorize publishing Meta Space by ${serverDomain} from this device using key: ${publicKey}`,
  };

  const { payload, timestamp } = createKeyValueByMetadataPayload(
    authorPublishRequestPayload,
  );
  const signature = createSignature(authorKeys.private, payload);

  const authorPublishRequestMetadata = {
    ...authorPublishRequestMetadataHeader,
    ...authorPublishRequestPayload,
    signature,
    ts: timestamp,
  };
  return authorPublishRequestMetadata as SignatureMetadata;
};

export default generateAuthorPublishMetaSpaceRequestMetadata;
