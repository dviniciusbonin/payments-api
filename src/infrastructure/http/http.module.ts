import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { PrismaModule } from '../prisma/prisma.module';
import { CustomerController } from './controllers/customer.controller';
import { ChargeController } from './controllers/charge.controller';
import { HealthController } from './controllers/health.controller';
import { PrismaCustomerRepository } from '../persistence/repositories/prisma-customer.repository';
import { PrismaChargeRepository } from '../persistence/repositories/prisma-charge.repository';
import { CreateCustomerUseCase } from '../../application/use-cases/customer/create-customer.use-case';
import { FindAllCustomersUseCase } from '../../application/use-cases/customer/find-all-customers.use-case';
import { CreateChargeUseCase } from '../../application/use-cases/charge/create-charge.use-case';
import { FindAllChargesUseCase } from '../../application/use-cases/charge/find-all-charges.use-case';

@Module({
  imports: [TerminusModule, PrismaModule],
  controllers: [CustomerController, ChargeController, HealthController],
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
