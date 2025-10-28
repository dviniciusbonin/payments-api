import { PaymentMethod } from '../../../domain/entities/charge.entity';

export class CreateChargeInputDto {
  customerId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  pixKey?: string;
  boletoDueDate?: string;
  cardInstallments?: number;
  cardLastDigits?: string;
}
