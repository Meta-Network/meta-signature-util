import {
  createKeyValueByMetadataPayload,
  createNonce,
  createSignature,
} from 'src/utils';
import {
  KeyPair,
  BaseSignatureMetadata,
  MetadataInPayloadWithSignature,
} from 'src/type';

/**
 * Generate the server's verification signature metadata for
 * the author's signature metadata of their post digest.
 * @param {KeyPair} serverKeys the server's private and public key pair
 * @param serverDomain The server domain to use in the claim.
 * @param {BaseSignatureMetadata} authorDigestSignatureMetadata the author's signature metadata of their post
 * digest or media
 * @param {string} authorDigestSignatureMetadataRefer URI reference to the author's signature metadata of their post
 * digest or media
 * @returns {BaseSignatureMetadata} server's signed verification metadata
 */
const generateAuthorDigestSignServerVerificationMetadata = (
  serverKeys: KeyPair,
  serverDomain: string,
  authorDigestSignatureMetadata: BaseSignatureMetadata,
  authorDigestSignatureMetadataRefer: string,
): BaseSignatureMetadata => {
  const publicKey = serverKeys.public;
  const authorSignature = authorDigestSignatureMetadata.signature;

  const serverVerificationSignatureMetadataHeader: Partial<BaseSignatureMetadata> =
    {
      '@context': 'https://metanetwork.online/ns/cms',
      '@type': 'server-verification-sign',
      '@version': '2.0.0',
      signatureAlgorithm: 'curve25519',
      publicKey,
    };

  const serverVerificationSignatureMetadataPayload: Partial<MetadataInPayloadWithSignature> =
    {
      signature: authorSignature,
      nonce: createNonce(),
      claim: `I, ${serverDomain}, signed with my key ${publicKey}: I verified the request signed with ${authorSignature} using the author's key ${authorDigestSignatureMetadata.publicKey}, will publish the post and upload its metadata for notarization.`,
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
