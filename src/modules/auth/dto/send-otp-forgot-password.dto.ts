import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SendOtpForgotPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;
}
