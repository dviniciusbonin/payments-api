import { ApiProperty } from '@nestjs/swagger';

export class ChargeResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Charge unique identifier',
  })
  id: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'Customer ID',
  })
  customerId: string;

  @ApiProperty({
    example: 100.5,
    description: 'Charge amount',
  })
  amount: number;

  @ApiProperty({
    example: 'BRL',
    description: 'Currency',
  })
  currency: string;

  @ApiProperty({
    example: 'PIX',
    description: 'Payment method',
  })
  paymentMethod: string;

  @ApiProperty({
    example: 'PENDING',
    description: 'Charge status',
  })
  status: string;

  @ApiProperty({
    example: 'email@example.com',
    description: 'Pix key (for PIX payment)',
    required: false,
  })
  pixKey?: string;

  @ApiProperty({
    example: '2025-12-31',
    description: 'Boleto due date (for BOLETO payment)',
    required: false,
  })
  boletoDueDate?: Date;

  @ApiProperty({
    example: 3,
    description: 'Number of installments (for CREDIT_CARD payment)',
    required: false,
  })
  cardInstallments?: number;

  @ApiProperty({
    example: '1234',
    description: 'Last 4 digits of card (for CREDIT_CARD payment)',
    required: false,
  })
  cardLastDigits?: string;

  @ApiProperty({
    example: '2025-01-01T00:00:00.000Z',
    description: 'Charge creation date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-01-01T00:00:00.000Z',
    description: 'Charge last update date',
  })
  updatedAt: Date;
}
