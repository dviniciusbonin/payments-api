import { Injectable, Inject } from '@nestjs/common';
import { ICustomerRepository } from '../../repositories/customer.repository';
import { CustomerOutputDto } from '../../dtos/customer/customer-output.dto';

@Injectable()
export class FindAllCustomersUseCase {
  constructor(
    @Inject('ICustomerRepository')
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(): Promise<CustomerOutputDto[]> {
    const customers = await this.customerRepository.findAll();

    return customers.map((customer) => ({
      id: customer.getId(),
      name: customer.getName(),
      email: customer.getEmail().getValue(),
      document: customer.getDocument().getValue(),
      phone: customer.getPhone(),
      createdAt: customer.getCreatedAt(),
      updatedAt: customer.getUpdatedAt(),
    }));
  }
}
