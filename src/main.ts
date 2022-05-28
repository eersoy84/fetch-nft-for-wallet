import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER_URL],
      },
      consumer: {
        groupId: "fetch_nft_data_for_wallet_consumer", //must be same to
        retry: {
          retries: 2,
          initialRetryTime: 3000,
          maxRetryTime: 30000,
        },
      },
    },
  });
  app.listen();
}
bootstrap();
