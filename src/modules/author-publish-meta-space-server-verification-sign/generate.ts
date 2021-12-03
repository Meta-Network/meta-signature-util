import {
  createKeyValueByMetadataPayload,
  createNonce,
  createSignature,
} from 'src/utils';
import {
  KeyPair,
  MetadataInPayloadWithSignature,
  BaseSignatureMetadata,
} from '@/src/type';

/**
 * Generate the server's verification signature metadata for
 * the author's request to publish their Meta Space to this server.
 * @param {KeyPair} serverKeys The server keys to use for signing.
 * @param serverDomain The server domain to use in the claim.
 * @param {BaseSignatureMetadata} authorPublishMetaSpaceRequestMetadata The author's publish request metadata object.
 * @param {string} authorPublishMetaSpaceRequestMetadataRefer URI reference to the author's publish request metadata.
 * @returns {BaseSignatureMetadata} The server's signed verification metadata.
 */
const generatePublishMetaSpaceServerVerificationMetadata = (
  serverKeys: KeyPair,
  serverDomain: string,
  authorPublishMetaSpaceRequestMetadata: BaseSignatureMetadata,
  authorPublishMetaSpaceRequestMetadataRefer: string,
): BaseSignatureMetadata => {
  const publicKey = serverKeys.public;
  const authorSignature = authorPublishMetaSpaceRequestMetadata.signature;

  const serverVerificationSignatureMetadataHeader: Partial<BaseSignatureMetadata> =
    {
      '@context': 'https://metanetwork.online/ns/cms',
      '@type': 'author-publish-meta-space-server-verification-sign',
      '@version': '1.0.1',
      signatureAlgorithm: 'curve25519',
      publicKey,
    };

  const serverVerificationSignatureMetadataPayload: Partial<MetadataInPayloadWithSignature> =
    {
      signature: authorSignature,
      nonce: createNonce(),
      claim: `I, ${serverDomain}, verified the request signed with ${authorSignature} using the author's key: ${authorPublishMetaSpaceRequestMetadata.publicKey}, and signed it with my key: ${publicKey}`,
    };

  const { payload, timestamp } = createKeyValueByMetadataPayload(
    serverVerificationSignatureMetadataPayload,
  );
  const signature = createSignature(serverKeys.private, payload);

  const serverVerificationSignatureMetadata = {
    ...serverVerificationSignatureMetadataHeader,
    nonce: serverVerificationSignatureMetadataPayload.nonce,
    claim: serverVerificationSignatureMetadataPayload.claim,
    signature,
    ts: timestamp,
    reference: [
      {
        rel: 'request',
        refer: authorPublishMetaSpaceRequestMetadataRefer,
        body: authorPublishMetaSpaceRequestMetadata,
      },
    ],
  };
  return serverVerificationSignatureMetadata as BaseSignatureMetadata;
};

export default generatePublishMetaSpaceServerVerificationMetadata;
