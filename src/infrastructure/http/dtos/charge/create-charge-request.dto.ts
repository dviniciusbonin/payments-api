import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export enum PaymentMethodEnum {
  PIX = 'PIX',
  CREDIT_CARD = 'CREDIT_CARD',
  BOLETO = 'BOLETO',
}

export class CreateChargeRequestDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Customer ID',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({
    example: 100.5,
    description: 'Charge amount',
    required: true,
  })
  @IsNumber()
  @Min(0.01)
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    enum: PaymentMethodEnum,
    example: PaymentMethodEnum.PIX,
    description: 'Payment method',
    required: true,
  })
  @IsEnum(PaymentMethodEnum)
  @IsNotEmpty()
  paymentMethod: string;

  @ApiProperty({
    example: 'email@example.com',
    description: 'Pix key (for PIX payment)',
    required: false,
  })
  @IsString()
  @IsOptional()
  pixKey?: string;

  @ApiProperty({
    example: '2025-12-31',
    description: 'Boleto due date (for BOLETO payment)',
    required: false,
  })
  @IsString()
  @IsOptional()
  boletoDueDate?: string;

  @ApiProperty({
    example: 3,
    description: 'Number of installments (for CREDIT_CARD payment)',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  cardInstallments?: number;

  @ApiProperty({
    example: '1234',
    description: 'Last 4 digits of card (for CREDIT_CARD payment)',
    required: false,
  })
  @IsString()
  @IsOptional()
  cardLastDigits?: string;
}
