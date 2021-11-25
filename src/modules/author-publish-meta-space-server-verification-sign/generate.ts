import {
  KeyPair,
  MetadataInPayloadWithSignature,
  SignatureMetadata,
} from 'src/type/types';
import {
  createKeyValueByMetadataPayload,
  createNonce,
  createSignature,
} from 'src/utils';

const generatePublishMetaSpaceServerVerificationMetadata = (
  serverKeys: KeyPair,
  serverDomain: string,
  authorPublishMetaSpaceRequestMetadata: SignatureMetadata,
  authorPublishMetaSpaceRequestMetadataRefer: string,
): SignatureMetadata => {
  const publicKey = serverKeys.public;
  const authorSignature = authorPublishMetaSpaceRequestMetadata.signature;

  const serverVerificationSignatureMetadataHeader: Partial<SignatureMetadata> =
    {
      '@context': 'https://metanetwork.online/ns/cms',
      '@type': 'author-publish-meta-space-server-verification-sign',
      '@version': '1.0.0',
      signatureAlgorithm: 'curve25519',
      publicKey,
    };

  const serverVerificationSignatureMetadataPayload: Partial<MetadataInPayloadWithSignature> =
    {
      signature: authorSignature,
      nonce: createNonce(),
      claim: `I, ${serverDomain} authorize request (sign: ${authorSignature}) using key: ${publicKey}`,
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
  return serverVerificationSignatureMetadata as SignatureMetadata;
};

export default generatePublishMetaSpaceServerVerificationMetadata;
