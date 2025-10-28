import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IChargeRepository } from '../../repositories/charge.repository';
import { ICustomerRepository } from '../../repositories/customer.repository';
import {
  Charge,
  PaymentMethod,
  ChargeStatus,
} from '../../../domain/entities/charge.entity';
import { CreateChargeInputDto } from '../../dtos/charge/create-charge-input.dto';
import { ChargeOutputDto } from '../../dtos/charge/charge-output.dto';
import {
  NotFoundException,
  BusinessException,
} from '../../../common/exceptions/business-exception';

@Injectable()
export class CreateChargeUseCase {
  constructor(
    @Inject('IChargeRepository')
    private readonly chargeRepository: IChargeRepository,
    @Inject('ICustomerRepository')
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(input: CreateChargeInputDto): Promise<ChargeOutputDto> {
    const customerExists = await this.customerRepository.findById(
      input.customerId,
    );
    if (!customerExists) {
      throw new NotFoundException('Customer not found');
    }

    if (
      input.paymentMethod === PaymentMethod.CREDIT_CARD &&
      !input.cardInstallments
    ) {
      throw new BusinessException(
        'Installments are required for credit card payments',
      );
    }

    if (
      input.paymentMethod === PaymentMethod.CREDIT_CARD &&
      input.cardInstallments &&
      (input.cardInstallments < 1 || input.cardInstallments > 12)
    ) {
      throw new BusinessException('Installments must be between 1 and 12');
    }

    const boletoDueDate = input.boletoDueDate
      ? new Date(input.boletoDueDate)
      : undefined;

    const charge = new Charge(
      randomUUID(),
      input.customerId,
      input.amount,
      input.paymentMethod,
      'BRL',
      ChargeStatus.PENDING,
      undefined,
      undefined,
      input.pixKey,
      boletoDueDate,
      input.cardInstallments,
      input.cardLastDigits,
    );

    const created = await this.chargeRepository.create(charge);

    return {
      id: created.getId(),
      customerId: created.getCustomerId(),
      amount: created.getAmount(),
      currency: created.getCurrency(),
      paymentMethod: created.getPaymentMethod(),
      status: created.getStatus(),
      pixKey: created.getPixKey(),
      boletoDueDate: created.getBoletoDueDate(),
      cardInstallments: created.getCardInstallments(),
      cardLastDigits: created.getCardLastDigits(),
      createdAt: created.getCreatedAt(),
      updatedAt: created.getUpdatedAt(),
    };
  }
}
