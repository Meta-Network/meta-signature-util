import {
  createNonce,
  createSignature,
  createKeyValueByMetadataPayload,
} from 'src/utils';
import {
  KeyPair,
  AuthorSignatureMetadata,
  MetadataInPayloadWithDigest,
} from 'src/type/types';

const generateAuthorDigestSignMetadata = (
  authorKeys: KeyPair,
  serverDomain: string,
  digest: string,
): AuthorSignatureMetadata => {
  const publicKey = authorKeys.public;

  const authorDigestSignatureMetadataHeader: Partial<AuthorSignatureMetadata> =
    {
      '@context': 'https://metanetwork.online/ns/cms',
      '@type': 'author-digest-sign',
      '@version': '2021-11-01-01',
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
  return authorDigestSignatureMetadata as AuthorSignatureMetadata;
};

export default generateAuthorDigestSignMetadata;
