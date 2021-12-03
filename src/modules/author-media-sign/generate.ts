import {
  createNonce,
  createSignature,
  createKeyValueByMetadataPayload,
} from 'src/utils';
import {
  KeyPair,
  MediaMetadata,
  AuthorMediaSignatureMetadata,
  MediaMetadataInPayload,
} from 'src/type';

/**
 * Generate digest metadata for author's media (video, image and other type of medias).
 * @param {PostMetadata} mediaMetadata an object containing metadata and hash (or IPFS CID) of the media
 * @param {string} serverDomain The author claims to publish their post to this domain.
 * @param {KeyPair} authorKeys The author's keys to use for signing.
 * @returns {AuthorMediaSignatureMetadata} metadata and generated digest of the post
 */
const generateMediaSignatureMetadata = (
  authorKeys: KeyPair,
  serverDomain: string,
  mediaMetadata: MediaMetadata,
): AuthorMediaSignatureMetadata => {
  if (!mediaMetadata.contentType.match(/\w+\/[-+.\w]+/)) {
    throw new TypeError('Invalid contentType, should be a valid MIME type');
  }

  const publicKey = authorKeys.public;
  const authorMediaSignatureMetadataHeader: Partial<AuthorMediaSignatureMetadata> =
    {
      '@context': 'https://metanetwork.online/ns/cms',
      '@type': 'author-media-sign',
      '@version': '1.0.0',
      signatureAlgorithm: 'curve25519',
      publicKey,
      ...mediaMetadata,
    };

  const authorMediaSignaturePayload: MediaMetadataInPayload = {
    platform: mediaMetadata.platform,
    contentType: mediaMetadata.contentType,
    platformHash: mediaMetadata.platformHash,
    nonce: createNonce(),
    claim: `I authorize publishing by ${serverDomain} from this device using key: ${publicKey}`,
  };

  const { payload, timestamp } = createKeyValueByMetadataPayload(
    authorMediaSignaturePayload,
  );
  const signature = createSignature(authorKeys.private, payload);

  const authorMediaSignatureMetadata = {
    ...authorMediaSignatureMetadataHeader,
    ...authorMediaSignaturePayload,
    signature,
    ts: timestamp,
  };
  return authorMediaSignatureMetadata as AuthorMediaSignatureMetadata;
};

export default generateMediaSignatureMetadata;
