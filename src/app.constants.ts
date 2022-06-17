import { CollectionTokens } from "./models/collectionTokens";
import { ConfigModule } from "@nestjs/config";

ConfigModule.forRoot();
export type MoralisAvatarAddress = {
  userId: string;
  ownedCollection: CollectionTokens;
  chain: string;
  address: string;
};
export const FILTER_NFT_DATA_SERVICE = "FILTER_NFT_DATA_SERVICE";
export const WALLET_REQUEST_TOPIC = process.env.WALLET_REQUEST_TOPIC || "wallet.request";
export const FILTER_NFT_DATA_TOPIC = process.env.FILTER_NFT_DATA_TOPIC || "filter.nft.data";

export const NUM_PARTITIONS = parseInt(process.env.NUM_PARTITIONS) || 1;
export const REPLICATION_FACTOR = parseInt(process.env.REPLICATION_FACTOR) || 1;
