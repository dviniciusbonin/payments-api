export class ChargeOutputDto {
  id: string;
  customerId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: string;
  pixKey?: string;
  boletoDueDate?: Date;
  cardInstallments?: number;
  cardLastDigits?: string;
  createdAt: Date;
  updatedAt: Date;
}
