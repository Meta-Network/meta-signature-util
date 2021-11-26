import {
  createKeyValueByMetadataPayload,
  createNonce,
  createSignature,
} from 'src/utils';
import { KeyPair, MetadataInPayload, SignatureMetadata } from '@/type';

/**
 * Generate signature metadata of the author request
 * to publish their Meta Space to a server.
 * @param {KeyPair} authorKeys The author's keys to use for signing.
 * @param {string} serverDomain The author claims to publish their Meta Space to this domain
 * @returns {SignatureMetadata}
 */
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
