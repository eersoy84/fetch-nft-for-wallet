import { Controller, Get, Logger, ValidationPipe } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { WALLET_REQUEST_TOPIC } from "./app.constants";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern(WALLET_REQUEST_TOPIC)
  deneme(@Payload(new ValidationPipe()) data: any) {
    this.appService.handleNftForWalletRequest(data.value);
  }
}
