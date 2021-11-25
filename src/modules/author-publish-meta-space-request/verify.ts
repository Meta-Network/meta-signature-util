import { SignatureMetadata } from 'src/type/types';
import { verifySignature } from 'src/utils';

const verifyAuthorPublishMetaSpaceRequestMetadataSignature = (
  metadata: SignatureMetadata,
): boolean => {
  return verifySignature(metadata);
};

export default verifyAuthorPublishMetaSpaceRequestMetadataSignature;
