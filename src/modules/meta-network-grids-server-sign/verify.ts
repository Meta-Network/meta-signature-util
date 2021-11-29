import {
  createDigest,
  createKeyValueByMetadataPayload,
  verifySignature,
} from 'src/utils';
import { BatchGridActionsMetadata } from '@/src/type';

/**
 * Verify the digest and the signature of the batch grid actions metadata.
 * @param {BatchGridActionsMetadata} metadata output of the generate method to get verified
 * @returns {boolean} result
 */
const verifyBatchGridActionsMetadata = (
  metadata: BatchGridActionsMetadata,
): boolean => {
  const { items, digest } = metadata;
  items.sort((a, b) => a.id - b.id);

  // create the digest because the payload is different
  const itemsQueryString = items
    .map((item) => createKeyValueByMetadataPayload(item, false))
    .join(',');
  if (digest !== createDigest(itemsQueryString)) {
    return false;
  }

  return verifySignature(metadata, {
    digest: metadata.digest,
  });
};

export default verifyBatchGridActionsMetadata;
