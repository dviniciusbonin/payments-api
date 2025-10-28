import {
  Charge,
  PaymentMethod,
  ChargeStatus,
} from '../../../domain/entities/charge.entity';
import {
  Charge as PrismaCharge,
  PaymentDetails as PrismaPaymentDetails,
} from '@prisma/client';

export class ChargeMapper {
  static toDomain(
    prismaCharge: PrismaCharge & {
      paymentDetails: PrismaPaymentDetails | null;
    },
  ): Charge {
    const paymentMethodMap: Record<string, PaymentMethod> = {
      PIX: PaymentMethod.PIX,
      CREDIT_CARD: PaymentMethod.CREDIT_CARD,
      BOLETO: PaymentMethod.BOLETO,
    };

    const statusMap: Record<string, ChargeStatus> = {
      PENDING: ChargeStatus.PENDING,
      PAID: ChargeStatus.PAID,
      FAILED: ChargeStatus.FAILED,
      EXPIRED: ChargeStatus.EXPIRED,
    };

    return new Charge(
      prismaCharge.id,
      prismaCharge.customerId,
      Number(prismaCharge.amount),
      paymentMethodMap[prismaCharge.paymentMethod],
      prismaCharge.currency,
      statusMap[prismaCharge.status],
      prismaCharge.createdAt,
      prismaCharge.updatedAt,
      prismaCharge.paymentDetails?.pixKey || undefined,
      prismaCharge.paymentDetails?.boletoDueDate || undefined,
      prismaCharge.paymentDetails?.cardInstallments || undefined,
      prismaCharge.paymentDetails?.cardLastDigits || undefined,
    );
  }

  static toPersistence(charge: Charge): {
    charge: {
      id: string;
      customerId: string;
      amount: number;
      currency: string;
      paymentMethod: string;
      status: string;
      createdAt: Date;
      updatedAt: Date;
    };
    paymentDetails?: {
      pixKey: string | null;
      boletoDueDate: Date | null;
      cardInstallments: number | null;
      cardLastDigits: string | null;
    };
  } {
    return {
      charge: {
        id: charge.getId(),
        customerId: charge.getCustomerId(),
        amount: charge.getAmount(),
        currency: charge.getCurrency(),
        paymentMethod: charge.getPaymentMethod(),
        status: charge.getStatus(),
        createdAt: charge.getCreatedAt(),
        updatedAt: charge.getUpdatedAt(),
      },
      paymentDetails:
        charge.getPixKey() ||
        charge.getBoletoDueDate() ||
        charge.getCardInstallments() ||
        charge.getCardLastDigits()
          ? {
              pixKey: charge.getPixKey() || null,
              boletoDueDate: charge.getBoletoDueDate() || null,
              cardInstallments: charge.getCardInstallments() || null,
              cardLastDigits: charge.getCardLastDigits() || null,
            }
          : undefined,
    };
  }
}
