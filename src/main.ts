import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import KafkaCustomerTransporter from "./kafka-custom-transporter";

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    strategy: new KafkaCustomerTransporter({
      subscribe: {
        fromBeginning: true,
      },
      client: {
        clientId: "fetchNftForWallet",
        brokers: [process.env.KAFKA_BROKER_URL],
      },
      consumer: {
        groupId: "fetchNftForWallet-consumer",
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
