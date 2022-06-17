import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { FILTER_NFT_DATA_SERVICE } from "src/app.constants";
import { KafkaService } from "./kafka.service";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: FILTER_NFT_DATA_SERVICE,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: "fetch-nft-for-wallet",
            brokers: [process.env.KAFKA_BROKER_URL],
          },
          consumer: {
            groupId: "filter.nft.data.consumer",
            allowAutoTopicCreation: false,
          },
        },
      },
    ]),
  ],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
