import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Charge } from '../../../domain/entities/charge.entity';
import { IChargeRepository } from '../../../application/repositories/charge.repository';
import { ChargeMapper } from '../mappers/charge.mapper';
import {
  PaymentMethod as PrismaPaymentMethod,
  ChargeStatus as PrismaChargeStatus,
  Prisma,
} from '@prisma/client';

@Injectable()
export class PrismaChargeRepository implements IChargeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(charge: Charge): Promise<Charge> {
    const { charge: prismaChargeData, paymentDetails } =
      ChargeMapper.toPersistence(charge);

    const prismaCharge = await this.prisma.charge.create({
      data: {
        id: prismaChargeData.id,
        customerId: prismaChargeData.customerId,
        amount: prismaChargeData.amount,
        currency: prismaChargeData.currency,
        paymentMethod: prismaChargeData.paymentMethod as PrismaPaymentMethod,
        status: prismaChargeData.status as PrismaChargeStatus,
        createdAt: prismaChargeData.createdAt,
        updatedAt: prismaChargeData.updatedAt,
        paymentDetails: paymentDetails
          ? {
              create: {
                pixKey: paymentDetails.pixKey,
                boletoDueDate: paymentDetails.boletoDueDate,
                cardInstallments: paymentDetails.cardInstallments,
                cardLastDigits: paymentDetails.cardLastDigits,
              } as Prisma.PaymentDetailsCreateWithoutChargeInput,
            }
          : undefined,
      },
      include: {
        paymentDetails: true,
      },
    });

    return ChargeMapper.toDomain(prismaCharge);
  }

  async findById(id: string): Promise<Charge | null> {
    const prismaCharge = await this.prisma.charge.findUnique({
      where: { id },
      include: {
        paymentDetails: true,
      },
    });

    if (!prismaCharge) {
      return null;
    }

    return ChargeMapper.toDomain(prismaCharge);
  }

  async findAll(): Promise<Charge[]> {
    const prismaCharges = await this.prisma.charge.findMany({
      include: {
        paymentDetails: true,
      },
    });

    return prismaCharges.map((charge) => ChargeMapper.toDomain(charge));
  }

  async findByCustomerId(customerId: string): Promise<Charge[]> {
    const prismaCharges = await this.prisma.charge.findMany({
      where: { customerId },
      include: {
        paymentDetails: true,
      },
    });

    return prismaCharges.map((charge) => ChargeMapper.toDomain(charge));
  }
}
