import { CollectionTokens } from "./models/collectionTokens";

export type MoralisAvatarAddress = {
  userId: string;
  ownedCollection: CollectionTokens;
  chain: string;
  address: string;
};
export const FILTER_NFT_DATA_SERVICE = "FILTER_NFT_DATA_SERVICE";
