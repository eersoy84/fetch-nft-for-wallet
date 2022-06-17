import { Controller, Get, Logger, ValidationPipe } from "@nestjs/common";
import { Ctx, EventPattern, KafkaContext, Payload } from "@nestjs/microservices";
import { WALLET_REQUEST_TOPIC } from "./app.constants";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern(WALLET_REQUEST_TOPIC)
  async handleNftForWalletRequest(@Payload(new ValidationPipe()) data: any) {
    const { value, partition } = data;

    await this.appService.handleNftForWalletRequest(value, partition);
  }
}
