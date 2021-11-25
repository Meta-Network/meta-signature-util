import { verifySignature } from 'src/utils';
import { AuthorSignatureMetadata } from 'src/type/types';

const verifyAuthorDigestMetadataSignature = (
  metadata: AuthorSignatureMetadata,
): boolean => {
  return verifySignature(metadata, { digest: metadata.digest });
};

export default verifyAuthorDigestMetadataSignature;
