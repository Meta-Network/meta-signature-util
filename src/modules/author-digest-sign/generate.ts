import {
  createNonce,
  createSignature,
  createKeyValueByMetadataPayload,
} from 'src/utils';
import {
  KeyPair,
  AuthorPostSignatureMetadata,
  MetadataInPayloadWithDigest,
} from '@/src/type';

/**
 * Generate signature metadata for the author's post digest.
 * @param {KeyPair} authorKeys The author's keys to use for signing.
 * @param {string} serverDomain The author claims to publish their post to this domain.
 * @param {string} digest Should be generated by author-digest module.
 * @returns {AuthorPostSignatureMetadata} The author's signature metadata of the post digest.
 */
const generateAuthorDigestSignMetadata = (
  authorKeys: KeyPair,
  serverDomain: string,
  digest: string,
): AuthorPostSignatureMetadata => {
  const publicKey = authorKeys.public;

  const authorDigestSignatureMetadataHeader: Partial<AuthorPostSignatureMetadata> =
    {
      '@context': 'https://metanetwork.online/ns/cms',
      '@type': 'author-digest-sign',
      '@version': '1.0.0',
      signatureAlgorithm: 'curve25519',
      publicKey,
    };

  const authorDigestSignaturePayload: Partial<MetadataInPayloadWithDigest> = {
    digest,
    nonce: createNonce(),
    claim: `I authorize publishing by ${serverDomain} from this device using key: ${publicKey}`,
  };

  const { payload, timestamp } = createKeyValueByMetadataPayload(
    authorDigestSignaturePayload,
  );
  const signature = createSignature(authorKeys.private, payload);

  const authorDigestSignatureMetadata = {
    ...authorDigestSignatureMetadataHeader,
    ...authorDigestSignaturePayload,
    signature,
    ts: timestamp,
  };
  return authorDigestSignatureMetadata as AuthorPostSignatureMetadata;
};

export default generateAuthorDigestSignMetadata;
