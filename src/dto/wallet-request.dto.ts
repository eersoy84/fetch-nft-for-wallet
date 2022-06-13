import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
export class WalletRequestDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  userId: string;

  @IsEmail()
  @IsNotEmpty()
  @MinLength(2)
  chain: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  address: string;
}
