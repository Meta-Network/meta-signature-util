import { AuthorDigestMetadata, BaseSignatureMetadata } from '@/src/type';

/**
 * Bind the author's digest metadata (with post metadata and content)
 * to the server's verification's reference.
 * @param authorDigestMetadata metadata and generated digest of the author's post
 * @param authorDigestMetadataRefer URI reference to the author's post digest metadata
 * @param serverVerificationSignatureMetadata server's signed verification metadata
 * @returns {BaseSignatureMetadata} server's signed verification metadata with the reference
 */
const generateAuthorDigestSignWithContentServerVerificationMetadata = (
  authorDigestMetadata: AuthorDigestMetadata,
  authorDigestMetadataRefer: string,
  serverVerificationSignatureMetadata: BaseSignatureMetadata,
): BaseSignatureMetadata => {
  serverVerificationSignatureMetadata.reference.unshift({
    refer: authorDigestMetadataRefer,
    rel: 'content',
    body: authorDigestMetadata,
  });
  return serverVerificationSignatureMetadata;
};

export default generateAuthorDigestSignWithContentServerVerificationMetadata;
