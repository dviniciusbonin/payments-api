import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ICustomerRepository } from '../../repositories/customer.repository';
import { Customer } from '../../../domain/entities/customer.entity';
import { Email } from '../../../domain/value-objects/email.vo';
import { Document } from '../../../domain/value-objects/document.vo';
import { CreateCustomerInputDto } from '../../dtos/customer/create-customer-input.dto';
import { CustomerOutputDto } from '../../dtos/customer/customer-output.dto';
import { ConflictException } from '../../../common/exceptions/business-exception';

@Injectable()
export class CreateCustomerUseCase {
  constructor(
    @Inject('ICustomerRepository')
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(input: CreateCustomerInputDto): Promise<CustomerOutputDto> {
    const emailExists = await this.customerRepository.existsByEmail(
      input.email,
    );
    if (emailExists) {
      throw new ConflictException('Email already exists');
    }

    const documentExists = await this.customerRepository.existsByDocument(
      input.document,
    );
    if (documentExists) {
      throw new ConflictException('Document already exists');
    }

    const customer = new Customer(
      randomUUID(),
      input.name,
      new Email(input.email),
      new Document(input.document),
      input.phone,
    );

    const created = await this.customerRepository.create(customer);

    return {
      id: created.getId(),
      name: created.getName(),
      email: created.getEmail().getValue(),
      document: created.getDocument().getValue(),
      phone: created.getPhone(),
      createdAt: created.getCreatedAt(),
      updatedAt: created.getUpdatedAt(),
    };
  }
}
