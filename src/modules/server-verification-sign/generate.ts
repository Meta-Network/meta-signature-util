import {
  AuthorSignatureMetadata,
  KeyPair,
  MetadataInPayloadWithSignature,
  SignatureMetadata,
} from 'src/type/types';
import {
  createKeyValueByMetadataPayload,
  createNonce,
  createSignature,
} from 'src/utils';

const generateAuthorDigestSignServerVerificationMetadata = (
  serverKeys: KeyPair,
  serverDomain: string,
  authorDigestSignatureMetadata: AuthorSignatureMetadata,
  authorDigestSignatureMetadataRefer: string,
): SignatureMetadata => {
  const publicKey = serverKeys.public;
  const authorSignature = authorDigestSignatureMetadata.signature;

  const serverVerificationSignatureMetadataHeader: Partial<SignatureMetadata> =
    {
      '@context': 'https://metanetwork.online/ns/cms',
      '@type': 'server-verification-sign',
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
        refer: authorDigestSignatureMetadataRefer,
        rel: 'request',
        body: authorDigestSignatureMetadata,
      },
    ],
  };
  return serverVerificationSignatureMetadata as SignatureMetadata;
};

export default generateAuthorDigestSignServerVerificationMetadata;
