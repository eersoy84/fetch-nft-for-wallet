import { Inject, Injectable, Logger } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { CollectionTokens } from "src/models/collectionTokens";
import { MoralisAvatarAddress, FILTER_NFT_DATA_SERVICE } from "./app.constants";
import { WalletRequestDto } from "./dto";
import { MoralisService } from "./moralis/moralis.service";

@Injectable()
export class AppService {
  protected readonly logger = new Logger(MoralisService.name);
  constructor(
    private moralisService: MoralisService,
    @Inject(FILTER_NFT_DATA_SERVICE) private readonly filterNftDataClient: ClientKafka
  ) {}

  async handleNftForWalletRequest(value: WalletRequestDto) {
    const { userId, chain, address } = value;
    const moralisAvatarAddresses: CollectionTokens[] = await this.moralisService.fetchAvatarsForAddress(chain, address);
    this.logger.verbose("Emitting moralis avatatar addresses...");

    moralisAvatarAddresses.map((ownedCollection) => {
      let moralisAvatarAddressObj: MoralisAvatarAddress = {
        userId,
        ownedCollection,
        chain,
        address,
      };
      this.filterNftDataClient.emit("filter.nft.data", moralisAvatarAddressObj);
    });
  }
}
