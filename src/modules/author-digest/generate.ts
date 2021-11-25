import { AuthorDigestRequestMetadata, PostMetadata } from 'src/type/types';
import { createDigest, createKeyValueByMetadataPayload } from 'src/utils';

const generatePostDigestRequestMetadata = (
  postMetadata: PostMetadata,
): AuthorDigestRequestMetadata => {
  const authorDigestRequestMetadataHeader: Partial<AuthorDigestRequestMetadata> =
    {
      '@context': 'https://metanetwork.online/ns/cms',
      '@type': 'author-digest',
      '@version': '2021-11-01-01',
      algorithm: 'sha256',
      ...postMetadata,
    };

  const { payload, timestamp } = createKeyValueByMetadataPayload(postMetadata);
  const digest = createDigest(payload);

  const authorDigestRequestMetadata = {
    ...authorDigestRequestMetadataHeader,
    digest,
    ts: timestamp,
  };
  return authorDigestRequestMetadata as AuthorDigestRequestMetadata;
};

export default generatePostDigestRequestMetadata;
