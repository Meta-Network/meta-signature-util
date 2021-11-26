import { createDigest, createKeyValueByMetadataPayload } from 'src/utils';
import { AuthorDigestMetadata, PostMetadata } from '@/type';

/**
 * Generate digest metadata for author's post.
 * @param {PostMetadata} postMetadata an object containing metadata and content of the post
 * @returns {AuthorDigestMetadata} metadata and generated digest of the post
 */
const generatePostDigestMetadata = (
  postMetadata: PostMetadata,
): AuthorDigestMetadata => {
  const authorDigestMetadataHeader: Partial<AuthorDigestMetadata> = {
    '@context': 'https://metanetwork.online/ns/cms',
    '@type': 'author-digest',
    '@version': '2021-11-01-01',
    algorithm: 'sha256',
    ...postMetadata,
  };

  const { payload, timestamp } = createKeyValueByMetadataPayload(postMetadata);
  const digest = createDigest(payload);

  const authorDigestMetadata = {
    ...authorDigestMetadataHeader,
    digest,
    ts: timestamp,
  };
  return authorDigestMetadata as AuthorDigestMetadata;
};

export default generatePostDigestMetadata;
