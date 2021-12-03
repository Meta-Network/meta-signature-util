import {
  createDigest,
  createKeyValueByMetadataPayload,
  createNonce,
  createSignature,
} from 'src/utils';
import type {
  GridMaintenanceRequestMetadata,
  KeyPair,
  MetadataInPayloadWithDigest,
} from '@/src/type';
import { BatchGridActionsMetadata } from '@/src/type';

/**
 * Generate a batch grid actions metadata.
 * @param items The maintain grid requests to generate the metadata.
 * @param serverKeys The server keys to use for signing.
 * @param serverDomain The server domain to use in the claim.
 * @returns {BatchGridActionsMetadata} Generated metadata.
 */
const generateBatchGridActionsMetadata = (
  serverKeys: KeyPair,
  serverDomain: string,
  items: Array<GridMaintenanceRequestMetadata>,
): BatchGridActionsMetadata => {
  const publicKey = serverKeys.public;
  // sort the items by id
  items.sort((a, b) => a.id - b.id);
  const itemsQueryString = items
    .map((item) => createKeyValueByMetadataPayload(item, false))
    .join(',');

  const digest = createDigest(itemsQueryString);

  const batchGridActionsMetadataHeader: Partial<BatchGridActionsMetadata> = {
    '@context': 'https://metanetwork.online/ns/grid',
    '@type': 'meta-network-grids-server-sign',
    '@version': '1.0.0',
    signatureAlgorithm: 'curve25519',
    publicKey,
  };

  const batchGridActionsMetadataPayload: MetadataInPayloadWithDigest = {
    digest,
    nonce: createNonce(),
    claim: `I, ${serverDomain} maintain grids for users, using the key: ${publicKey}`,
  };

  const { payload, timestamp } = createKeyValueByMetadataPayload(
    batchGridActionsMetadataPayload,
  );

  const signature = createSignature(serverKeys.private, payload);

  const batchGridActionsMetadata = {
    ...batchGridActionsMetadataHeader,
    items,
    nonce: batchGridActionsMetadataPayload.nonce,
    claim: batchGridActionsMetadataPayload.claim,
    digest,
    signature,
    ts: timestamp,
  };
  return batchGridActionsMetadata as BatchGridActionsMetadata;
};

export default generateBatchGridActionsMetadata;
