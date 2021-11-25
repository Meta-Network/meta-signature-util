import { SignatureMetadata } from 'src/type/types';
import { verifySignature } from 'src/utils';

const verifyServerMetadataSignature = (
  metadata: SignatureMetadata,
): boolean => {
  return verifySignature(metadata, {
    signature: (metadata.reference.pop().body as SignatureMetadata).signature,
  });
};

export default verifyServerMetadataSignature;
