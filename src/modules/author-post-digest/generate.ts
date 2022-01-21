import { createDigest, createKeyValueByMetadataPayload } from 'src/utils';
import { AuthorPostDigestMetadata, PostMetadata } from 'src/type';

/**
 * Generate digest metadata for author's post.
 * @param {PostMetadata} postMetadata an object containing metadata and content of the post
 * @returns {AuthorPostDigestMetadata} metadata and generated digest of the post
 */
const generatePostDigestMetadata = (
  postMetadata: PostMetadata,
): AuthorPostDigestMetadata => {
  const authorPostDigestMetadataHeader: Partial<AuthorPostDigestMetadata> = {
    '@context': 'https://metanetwork.online/ns/cms',
    '@type': 'author-post-digest',
    '@version': '1.1.0',
    algorithm: 'sha256',
    ...postMetadata,
  };

  const { payload, timestamp } = createKeyValueByMetadataPayload(postMetadata);
  const digest = createDigest(payload);

  const authorPostDigestMetadata = {
    ...authorPostDigestMetadataHeader,
    digest,
    ts: timestamp,
  };
  return authorPostDigestMetadata as AuthorPostDigestMetadata;
};

export default generatePostDigestMetadata;
