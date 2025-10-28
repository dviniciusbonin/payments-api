import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateChargeUseCase } from '../../../application/use-cases/charge/create-charge.use-case';
import { FindAllChargesUseCase } from '../../../application/use-cases/charge/find-all-charges.use-case';
import { CreateChargeRequestDto } from '../dtos/charge/create-charge-request.dto';
import { ChargeResponseDto } from '../dtos/charge/charge-response.dto';
import { CreateChargeInputDto } from '../../../application/dtos/charge/create-charge-input.dto';
import { PaymentMethod } from '../../../domain/entities/charge.entity';

@ApiTags('charges')
@Controller('charges')
export class ChargeController {
  constructor(
    private readonly createChargeUseCase: CreateChargeUseCase,
    private readonly findAllChargesUseCase: FindAllChargesUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new charge' })
  @ApiResponse({
    status: 201,
    description: 'Charge created successfully',
    type: ChargeResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  @ApiResponse({ status: 422, description: 'Business validation error' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(
    @Body() request: CreateChargeRequestDto,
  ): Promise<ChargeResponseDto> {
    const input: CreateChargeInputDto = {
      customerId: request.customerId,
      amount: request.amount,
      paymentMethod: request.paymentMethod as PaymentMethod,
      pixKey: request.pixKey,
      boletoDueDate: request.boletoDueDate,
      cardInstallments: request.cardInstallments,
      cardLastDigits: request.cardLastDigits,
    };

    const output = await this.createChargeUseCase.execute(input);

    return {
      id: output.id,
      customerId: output.customerId,
      amount: output.amount,
      currency: output.currency,
      paymentMethod: output.paymentMethod,
      status: output.status,
      pixKey: output.pixKey,
      boletoDueDate: output.boletoDueDate,
      cardInstallments: output.cardInstallments,
      cardLastDigits: output.cardLastDigits,
      createdAt: output.createdAt,
      updatedAt: output.updatedAt,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all charges or charges by customer ID' })
  @ApiResponse({
    status: 200,
    description: 'List of charges',
    type: [ChargeResponseDto],
  })
  async findAll(
    @Query('customerId') customerId?: string,
  ): Promise<ChargeResponseDto[]> {
    const output = await this.findAllChargesUseCase.execute();

    if (customerId) {
      const filteredCharges = output.filter(
        (charge) => charge.customerId === customerId,
      );
      return filteredCharges.map((charge) => ({
        id: charge.id,
        customerId: charge.customerId,
        amount: charge.amount,
        currency: charge.currency,
        paymentMethod: charge.paymentMethod,
        status: charge.status,
        pixKey: charge.pixKey,
        boletoDueDate: charge.boletoDueDate,
        cardInstallments: charge.cardInstallments,
        cardLastDigits: charge.cardLastDigits,
        createdAt: charge.createdAt,
        updatedAt: charge.updatedAt,
      }));
    }

    return output.map((charge) => ({
      id: charge.id,
      customerId: charge.customerId,
      amount: charge.amount,
      currency: charge.currency,
      paymentMethod: charge.paymentMethod,
      status: charge.status,
      pixKey: charge.pixKey,
      boletoDueDate: charge.boletoDueDate,
      cardInstallments: charge.cardInstallments,
      cardLastDigits: charge.cardLastDigits,
      createdAt: charge.createdAt,
      updatedAt: charge.updatedAt,
    }));
  }
}
