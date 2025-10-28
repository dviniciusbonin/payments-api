import { Customer } from '../entities/customer.entity';

export interface ICustomerRepository {
  create(customer: Customer): Promise<Customer>;
  findById(id: string): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
  findByDocument(document: string): Promise<Customer | null>;
  existsByEmail(email: string): Promise<boolean>;
  existsByDocument(document: string): Promise<boolean>;
}
