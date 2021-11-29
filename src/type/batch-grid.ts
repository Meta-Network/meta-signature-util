type HexGrid = {
  id: number;
  siteName: string;
  x: number;
  y: number;
  z: number;
  userId: number;
  username: string;
  userNickname: string;
  userBio: string;
  userAvatar: string;
  subdomain: string;
  metaSpaceSiteId: number;
  metaSpaceSiteUrl: string;
  metaSpaceSiteProofUrl: string;
  inviterUserId: number;
};

type GridProperties = Omit<HexGrid, 'createdAt' | 'updatedAt'>;

export type GridMaintenanceRequestMetadata = Partial<GridProperties> & {
  previousTx?: string;
};

export interface BatchGridActionsMetadata {
  '@context': 'https://metanetwork.online/ns/grid';
  '@type': 'meta-network-grids-server-sign';
  '@version': string;
  signatureAlgorithm: 'curve25519';
  items: Array<GridMaintenanceRequestMetadata>;
  digest: string;
  publicKey: string;
  signature: string;
  nonce: string;
  claim: string;
  ts: number;
}
