import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCustomerRequestDto {
  @ApiProperty({
    example: 'João Silva',
    description: 'Customer full name',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'joao@example.com',
    description: 'Customer email address',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '12345678900',
    description: 'CPF or CNPJ document',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  document: string;

  @ApiProperty({
    example: '11999999999',
    description: 'Customer phone number',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;
}
