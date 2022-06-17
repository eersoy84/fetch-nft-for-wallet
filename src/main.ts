import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import KafkaCustomTransporter from "./kafka-custom-transporter";

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    strategy: new KafkaCustomTransporter({
      subscribe: {
        fromBeginning: true,
      },
      client: {
        clientId: "nftForWallet",
        brokers: [process.env.KAFKA_BROKER_URL],
      },
      consumer: {
        groupId: "nftForWallet-consumer",
        allowAutoTopicCreation: false,
      },
      run: {
        autoCommit: false,
      },
    }),
  });

  app.listen();
}
bootstrap();
