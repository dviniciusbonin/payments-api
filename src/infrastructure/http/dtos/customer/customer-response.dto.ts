import { ApiProperty } from '@nestjs/swagger';

export class CustomerResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Customer unique identifier',
  })
  id: string;

  @ApiProperty({
    example: 'João Silva',
    description: 'Customer full name',
  })
  name: string;

  @ApiProperty({
    example: 'joao@example.com',
    description: 'Customer email address',
  })
  email: string;

  @ApiProperty({
    example: '12345678900',
    description: 'CPF or CNPJ document',
  })
  document: string;

  @ApiProperty({
    example: '11999999999',
    description: 'Customer phone number',
    required: false,
  })
  phone?: string;

  @ApiProperty({
    example: '2025-01-01T00:00:00.000Z',
    description: 'Customer creation date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-01-01T00:00:00.000Z',
    description: 'Customer last update date',
  })
  updatedAt: Date;
}
