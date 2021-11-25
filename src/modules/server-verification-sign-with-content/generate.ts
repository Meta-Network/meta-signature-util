import { AuthorDigestRequestMetadata, SignatureMetadata } from 'src/type/types';

const generateAuthorDigestSignWithContentServerVerificationMetadata = (
  authorDigestRequestMetadata: AuthorDigestRequestMetadata,
  authorDigestRequestMetadataRefer: string,
  serverVerificationSignatureMetadata: SignatureMetadata,
): SignatureMetadata => {
  serverVerificationSignatureMetadata.reference.unshift({
    refer: authorDigestRequestMetadataRefer,
    rel: 'content',
    body: authorDigestRequestMetadata,
  });
  return serverVerificationSignatureMetadata;
};

export default generateAuthorDigestSignWithContentServerVerificationMetadata;
