import { AuthorDigestRequestMetadata, PostMetadata } from 'src/type/types';
import { verifyDigest } from 'src/utils';

/**
 * Verify digest generated by generatePostDigestRequestMetadata,
 * need it's output as the input.
 * @param {AuthorDigestRequestMetadata} metadata to verify
 * @returns {boolean} verify result
 */
const verify = (metadata: AuthorDigestRequestMetadata): boolean => {
  const { digest } = metadata;
  const postMetadata: PostMetadata = {
    title: metadata.title,
    categories: metadata.categories,
    content: metadata.content,
    cover: metadata.cover,
    license: metadata.license,
    summary: metadata.summary,
    tags: metadata.tags,
  };

  const timestamp = metadata.ts;
  return verifyDigest(digest, postMetadata, timestamp);
};

export default verify;
