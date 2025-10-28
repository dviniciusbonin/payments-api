import { Charge } from '../../domain/entities/charge.entity';

export interface IChargeRepository {
  create(charge: Charge): Promise<Charge>;
  findById(id: string): Promise<Charge | null>;
  findAll(): Promise<Charge[]>;
  findByCustomerId(customerId: string): Promise<Charge[]>;
}
