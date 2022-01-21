import { verifyDigest } from 'src/utils';
import { AuthorPostDigestMetadata, PostMetadata } from 'src/type';

/**
 * Verify the digest generated by the generate method.
 * @param {AuthorPostDigestMetadata} metadata output of the generate method to get verified
 * @returns {boolean} result
 */
const verify = (metadata: AuthorPostDigestMetadata): boolean => {
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