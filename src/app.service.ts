import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { CollectionTokens } from "src/models/collectionTokens";
import { MoralisAvatarAddress, FILTER_NFT_DATA_TOPIC, FILTER_NFT_DATA_SERVICE } from "./app.constants";
import { WalletRequestDto } from "./dto";
import { KafkaService } from "./kafka/kafka.service";
import { MoralisService } from "./moralis/moralis.service";

@Injectable()
export class AppService {
  protected readonly logger = new Logger(MoralisService.name);
  constructor(private moralisService: MoralisService, private readonly kafka: KafkaService) {}

  async handleNftForWalletRequest(value: WalletRequestDto, partition: number) {
    const { userId, chain, address } = value;
    const moralisAvatarAddresses: CollectionTokens[] = await this.moralisService.fetchAvatarsForAddress(chain, address);
    this.logger.verbose("Emitting moralis avatatar addresses...");
    console.log(userId);
    Promise.all(
      moralisAvatarAddresses.map(async (ownedCollection) => {
        let moralisAvatarAddressObj: MoralisAvatarAddress = {
          userId,
          ownedCollection,
          chain,
          address,
        };
        await this.kafka.send(FILTER_NFT_DATA_TOPIC, moralisAvatarAddressObj, partition);
      })
    );
  }
}
