import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCustomerUseCase } from '../../../application/use-cases/customer/create-customer.use-case';
import { FindAllCustomersUseCase } from '../../../application/use-cases/customer/find-all-customers.use-case';
import { CreateCustomerRequestDto } from '../dtos/customer/create-customer-request.dto';
import { CustomerResponseDto } from '../dtos/customer/customer-response.dto';
import { CreateCustomerInputDto } from '../../../application/dtos/customer/create-customer-input.dto';

@ApiTags('customers')
@Controller('customers')
export class CustomerController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly findAllCustomersUseCase: FindAllCustomersUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({
    status: 201,
    description: 'Customer created successfully',
    type: CustomerResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Email or document already exists' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(
    @Body() request: CreateCustomerRequestDto,
  ): Promise<CustomerResponseDto> {
    const input: CreateCustomerInputDto = {
      name: request.name,
      email: request.email,
      document: request.document,
      phone: request.phone,
    };

    const output = await this.createCustomerUseCase.execute(input);

    return {
      id: output.id,
      name: output.name,
      email: output.email,
      document: output.document,
      phone: output.phone,
      createdAt: output.createdAt,
      updatedAt: output.updatedAt,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({
    status: 200,
    description: 'List of all customers',
    type: [CustomerResponseDto],
  })
  async findAll(): Promise<CustomerResponseDto[]> {
    const output = await this.findAllCustomersUseCase.execute();

    return output.map((customer) => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      document: customer.document,
      phone: customer.phone,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    }));
  }
}
