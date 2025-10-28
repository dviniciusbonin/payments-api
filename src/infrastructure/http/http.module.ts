import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CustomerController } from './controllers/customer.controller';
import { ChargeController } from './controllers/charge.controller';
import { PrismaCustomerRepository } from '../persistence/repositories/prisma-customer.repository';
import { PrismaChargeRepository } from '../persistence/repositories/prisma-charge.repository';
import { CreateCustomerUseCase } from '../../application/use-cases/customer/create-customer.use-case';
import { FindAllCustomersUseCase } from '../../application/use-cases/customer/find-all-customers.use-case';
import { CreateChargeUseCase } from '../../application/use-cases/charge/create-charge.use-case';
import { FindAllChargesUseCase } from '../../application/use-cases/charge/find-all-charges.use-case';

@Module({
  imports: [PrismaModule],
  controllers: [CustomerController, ChargeController],
  providers: [
    {
      provide: 'ICustomerRepository',
      useClass: PrismaCustomerRepository,
    },
    {
      provide: 'IChargeRepository',
      useClass: PrismaChargeRepository,
    },
    CreateCustomerUseCase,
    FindAllCustomersUseCase,
    CreateChargeUseCase,
    FindAllChargesUseCase,
  ],
})
export class HttpModule {}
