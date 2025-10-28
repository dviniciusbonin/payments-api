import { Customer } from '../../../domain/entities/customer.entity';
import { Email } from '../../../domain/value-objects/email.vo';
import { Document } from '../../../domain/value-objects/document.vo';
import { Customer as PrismaCustomer } from '@prisma/client';

export class CustomerMapper {
  static toDomain(prismaCustomer: PrismaCustomer): Customer {
    return new Customer(
      prismaCustomer.id,
      prismaCustomer.name,
      new Email(prismaCustomer.email),
      new Document(prismaCustomer.document),
      prismaCustomer.phone || undefined,
      prismaCustomer.createdAt,
      prismaCustomer.updatedAt,
    );
  }

  static toPersistence(customer: Customer): PrismaCustomer {
    return {
      id: customer.getId(),
      name: customer.getName(),
      email: customer.getEmail().getValue(),
      document: customer.getDocument().getValue(),
      phone: customer.getPhone() || null,
      createdAt: customer.getCreatedAt(),
      updatedAt: customer.getUpdatedAt(),
    };
  }
}
