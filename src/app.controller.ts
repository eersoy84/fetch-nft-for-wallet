import { Controller, Get, Logger, ValidationPipe } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { AppService } from "./app.service";

const logger = new Logger();
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern("fetch_nft_data_for_wallet")
  handleNftForWalletRequest(@Payload(new ValidationPipe()) data: any) {
    this.appService.handleNftForWalletRequest(data.value);
  }
}
