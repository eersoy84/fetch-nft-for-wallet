import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { FILTER_NFT_DATA_SERVICE } from "./app.constants";
import { MoralisModule } from "./moralis/moralis.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
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
    MoralisModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
