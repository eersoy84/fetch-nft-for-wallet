import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        // brokers: [process.env.KAFKA_BROKER_URL],
        brokers: [process.env.KAFKA_BROKER_URL, process.env.KAFKA_BROKER_URL2],
      },
      consumer: {
        groupId: "nft_wallet_request_consumer",
        retry: {
          retries: 2,
          initialRetryTime: 3000,
          maxRetryTime: 30000,
        },
        allowAutoTopicCreation: false,
      },
    },
  });
  app.listen();
}
bootstrap();
