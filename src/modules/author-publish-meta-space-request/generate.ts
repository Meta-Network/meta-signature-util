import {
  createKeyValueByMetadataPayload,
  createNonce,
  createSignature,
} from 'src/utils';
import { KeyPair, MetadataInPayload, BaseSignatureMetadata } from 'src/type';

/**
 * Generate signature metadata of the author request
 * to publish their Meta Space to a server.
 * @param {KeyPair} authorKeys The author's keys to use for signing.
 * @param {string} serverDomain The author claims to publish their Meta Space to this domain
 * @returns {BaseSignatureMetadata}
 */
const generateAuthorPublishMetaSpaceRequestMetadata = (
  authorKeys: KeyPair,
  serverDomain: string,
): BaseSignatureMetadata => {
  const publicKey = authorKeys.public;

  const authorPublishRequestMetadataHeader: Partial<BaseSignatureMetadata> = {
    '@context': 'https://metanetwork.online/ns/cms',
    '@type': 'author-publish-meta-space-request',
    '@version': '2.0.0',
    signatureAlgorithm: 'curve25519',
    publicKey,
  };

  const authorPublishRequestPayload: Partial<MetadataInPayload> = {
    nonce: createNonce(),
    claim: `I signed with my key ${publicKey} from this device: I authorize ${serverDomain} to publish this post and upload its metadata for notarization.`,
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
  return authorPublishRequestMetadata as BaseSignatureMetadata;
};

export default generateAuthorPublishMetaSpaceRequestMetadata;
