import { Charge } from '../entities/charge.entity';

export interface IChargeRepository {
  create(charge: Charge): Promise<Charge>;
  findById(id: string): Promise<Charge | null>;
  findByCustomerId(customerId: string): Promise<Charge[]>;
}
