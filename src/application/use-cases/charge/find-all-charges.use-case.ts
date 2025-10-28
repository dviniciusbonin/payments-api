import { Injectable, Inject } from '@nestjs/common';
import { IChargeRepository } from '../../repositories/charge.repository';
import { ChargeOutputDto } from '../../dtos/charge/charge-output.dto';

@Injectable()
export class FindAllChargesUseCase {
  constructor(
    @Inject('IChargeRepository')
    private readonly chargeRepository: IChargeRepository,
  ) {}

  async execute(): Promise<ChargeOutputDto[]> {
    const charges = await this.chargeRepository.findAll();

    return charges.map((charge) => ({
      id: charge.getId(),
      customerId: charge.getCustomerId(),
      amount: charge.getAmount(),
      currency: charge.getCurrency(),
      paymentMethod: charge.getPaymentMethod(),
      status: charge.getStatus(),
      pixKey: charge.getPixKey(),
      boletoDueDate: charge.getBoletoDueDate(),
      cardInstallments: charge.getCardInstallments(),
      cardLastDigits: charge.getCardLastDigits(),
      createdAt: charge.getCreatedAt(),
      updatedAt: charge.getUpdatedAt(),
    }));
  }
}
