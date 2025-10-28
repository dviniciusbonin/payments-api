import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Customer } from '../../../domain/entities/customer.entity';
import { ICustomerRepository } from '../../../application/repositories/customer.repository';
import { CustomerMapper } from '../mappers/customer.mapper';

@Injectable()
export class PrismaCustomerRepository implements ICustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(customer: Customer): Promise<Customer> {
    const prismaCustomer = await this.prisma.customer.create({
      data: CustomerMapper.toPersistence(customer),
    });

    return CustomerMapper.toDomain(prismaCustomer);
  }

  async findById(id: string): Promise<Customer | null> {
    const prismaCustomer = await this.prisma.customer.findUnique({
      where: { id },
    });

    if (!prismaCustomer) {
      return null;
    }

    return CustomerMapper.toDomain(prismaCustomer);
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const prismaCustomer = await this.prisma.customer.findUnique({
      where: { email },
    });

    if (!prismaCustomer) {
      return null;
    }

    return CustomerMapper.toDomain(prismaCustomer);
  }

  async findByDocument(document: string): Promise<Customer | null> {
    const prismaCustomer = await this.prisma.customer.findUnique({
      where: { document },
    });

    if (!prismaCustomer) {
      return null;
    }

    return CustomerMapper.toDomain(prismaCustomer);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const customer = await this.prisma.customer.findUnique({
      where: { email },
      select: { id: true },
    });

    return !!customer;
  }

  async existsByDocument(document: string): Promise<boolean> {
    const customer = await this.prisma.customer.findUnique({
      where: { document },
      select: { id: true },
    });

    return !!customer;
  }

  async findAll(): Promise<Customer[]> {
    const prismaCustomers = await this.prisma.customer.findMany();
    return prismaCustomers.map((customer) => CustomerMapper.toDomain(customer));
  }
}
