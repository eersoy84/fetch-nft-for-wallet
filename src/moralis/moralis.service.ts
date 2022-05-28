import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { models } from "@worldwidewebb/tsoa-shared";
import { CollectionTokens } from "src/models/collectionTokens";
import retry from "async-await-retry";
import Moralis from "moralis/node";

@Injectable()
export class MoralisService implements OnModuleInit {
  private readonly logger = new Logger(MoralisService.name);
  async onModuleInit() {
    await this.initializeMoralis();
  }

  async initializeMoralis() {
    let moralisSecret = process.env.MORALIS_SECRET;
    let serverUrl = process.env.MORALIS_SERVER_URL;
    if (process.env.MORALIS_SECRET_NAME) {
      this.logger.log("Fetching Moralis Credentials...");
      const secretsClient = new SecretManagerServiceClient();
      const [serverSecretResponse] = await secretsClient.accessSecretVersion({
        name: process.env.MORALIS_SECRET_NAME,
      });
      moralisSecret = serverSecretResponse?.payload?.data?.toString();

      const [serverUrlResponse] = await secretsClient.accessSecretVersion({
        name: process.env.MORALIS_SERVER_URL_SECRET_NAME,
      });
      serverUrl = serverUrlResponse?.payload?.data?.toString();
    }

    await Moralis.start({ serverUrl, moralisSecret });
    this.logger.verbose("Initializing Moralis...");
  }

  async fetchAvatarsForAddress(chain: string, address: string): Promise<CollectionTokens[]> {
    if (chain != "eth") return [];

    // Paginate Web3API
    const nfts = [];
    let total = 0;
    do {
      let data;
      try {
        data = await retry(
          async () => {
            return await Moralis.Web3API.account.getNFTs({
              chain,
              address,
              // offset: nfts.length,
            });
          },
          undefined,
          { interval: 2000, retriesMax: 5 }
        );
      } catch (err) {
        console.error(err);
        throw new models.InternalError();
      }

      if (!data || !data.result) {
        break;
      }

      if (data.total) {
        total = data.total;
      }

      nfts.push(...data.result);
    } while (nfts.length < total);

    // decode
    const ownedCollections: { [collectionAddress: string]: CollectionTokens } = {};
    nfts.forEach((nft) => {
      if (!(nft.token_address in ownedCollections)) {
        ownedCollections[nft.token_address] = {
          collection: {
            address: {
              value: nft.token_address,
              chain,
            },
            collectionName: nft.name,
            openseaSlug: "",
            symbol: nft.symbol,
          },
          tokens: [],
        };
      }
      ownedCollections[nft.token_address].tokens.push({
        id: nft.token_id,
        url: nft.token_uri || "",
        amount: parseFloat(nft.amount || "0"),
        metadata: nft.metadata || "",
      });
    });

    return Object.values(ownedCollections);
  }
}
