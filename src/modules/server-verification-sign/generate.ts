import {
  createKeyValueByMetadataPayload,
  createNonce,
  createSignature,
} from 'src/utils';
import {
  KeyPair,
  BaseSignatureMetadata,
  AuthorPostSignatureMetadata,
  MetadataInPayloadWithSignature,
} from 'src/type';

/**
 * Generate the server's verification signature metadata for
 * the author's signature metadata of their post digest.
 * @param {KeyPair} serverKeys the server's private and public key pair
 * @param serverDomain The server domain to use in the claim.
 * @param {AuthorPostSignatureMetadata} authorDigestSignatureMetadata the author's signature metadata of their post digest
 * @param {string} authorDigestSignatureMetadataRefer URI reference to the author's signature metadata of their post digest
 * @returns {BaseSignatureMetadata} server's signed verification metadata
 */
const generateAuthorDigestSignServerVerificationMetadata = (
  serverKeys: KeyPair,
  serverDomain: string,
  authorDigestSignatureMetadata: AuthorPostSignatureMetadata,
  authorDigestSignatureMetadataRefer: string,
): BaseSignatureMetadata => {
  const publicKey = serverKeys.public;
  const authorSignature = authorDigestSignatureMetadata.signature;

  const serverVerificationSignatureMetadataHeader: Partial<BaseSignatureMetadata> =
    {
      '@context': 'https://metanetwork.online/ns/cms',
      '@type': 'server-verification-sign',
      '@version': '1.0.1',
      signatureAlgorithm: 'curve25519',
      publicKey,
    };

  const serverVerificationSignatureMetadataPayload: Partial<MetadataInPayloadWithSignature> =
    {
      signature: authorSignature,
      nonce: createNonce(),
      claim: `I, ${serverDomain}, verified the request signed with ${authorSignature} using the author's key: ${authorDigestSignatureMetadata.publicKey}, and signed it with my key: ${publicKey}`,
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
  return serverVerificationSignatureMetadata as BaseSignatureMetadata;
};

export default generateAuthorDigestSignServerVerificationMetadata;
