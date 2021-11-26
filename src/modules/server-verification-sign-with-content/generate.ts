import { AuthorDigestMetadata, SignatureMetadata } from '@/type';

/**
 * Bind the author's digest metadata (with post metadata and content)
 * to the server's verification's reference.
 * @param authorDigestMetadata metadata and generated digest of the author's post
 * @param authorDigestMetadataRefer URI reference to the author's post digest metadata
 * @param serverVerificationSignatureMetadata server's signed verification metadata
 * @returns {SignatureMetadata} server's signed verification metadata with the reference
 */
const generateAuthorDigestSignWithContentServerVerificationMetadata = (
  authorDigestMetadata: AuthorDigestMetadata,
  authorDigestMetadataRefer: string,
  serverVerificationSignatureMetadata: SignatureMetadata,
): SignatureMetadata => {
  serverVerificationSignatureMetadata.reference.unshift({
    refer: authorDigestMetadataRefer,
    rel: 'content',
    body: authorDigestMetadata,
  });
  return serverVerificationSignatureMetadata;
};

export default generateAuthorDigestSignWithContentServerVerificationMetadata;
