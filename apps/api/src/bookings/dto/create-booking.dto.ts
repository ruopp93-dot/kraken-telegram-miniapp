import { IsString, IsDateString, IsOptional, IsNumber, Min } from 'class-validator'

export class CreateBookingDto {
  @IsString()
  pcId: string

  @IsDateString()
  startTime: string

  @IsDateString()
  endTime: string

  @IsString()
  telegramUserId: string

  @IsString()
  userName: string

  @IsOptional()
  @IsString()
  userPhone?: string

  @IsOptional()
  @IsString()
  notes?: string

  @IsOptional()
  @IsNumber()
  @Min(0)
  additionalJoysticks?: number
}
