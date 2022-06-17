import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MoralisModule } from "./moralis/moralis.module";
import { KafkaModule } from "./kafka/kafka.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MoralisModule,
    KafkaModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
