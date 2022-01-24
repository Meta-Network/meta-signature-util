import { BaseSignatureMetadata } from 'src/type';

/**
 * Bind the author's digest metadata (with post metadata and content)
 * to the server's verification's reference.
 * @param authorPostDigestMetadata metadata and generated digest of the author's post
 * @param authorPostDigestMetadataRefer URI reference to the author's post digest metadata
 * @param serverVerificationSignatureMetadata server's signed verification metadata
 * @returns {BaseSignatureMetadata} server's signed verification metadata with the reference
 */
const generateAuthorDigestSignWithContentServerVerificationMetadata = (
  authorPostDigestMetadata: BaseSignatureMetadata,
  authorPostDigestMetadataRefer: string,
  serverVerificationSignatureMetadata: BaseSignatureMetadata,
): BaseSignatureMetadata => {
  serverVerificationSignatureMetadata.reference.unshift({
    refer: authorPostDigestMetadataRefer,
    rel: 'content',
    body: authorPostDigestMetadata,
  });
  return serverVerificationSignatureMetadata;
};

export default generateAuthorDigestSignWithContentServerVerificationMetadata;
