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
export const WALLET_REQUEST_TOPIC = process.env.WALLET_REQUEST_TOPIC;
