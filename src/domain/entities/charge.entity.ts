export enum PaymentMethod {
  PIX = 'PIX',
  CREDIT_CARD = 'CREDIT_CARD',
  BOLETO = 'BOLETO',
}

export enum ChargeStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
}

export class Charge {
  private id: string;
  private customerId: string;
  private amount: number;
  private currency: string;
  private paymentMethod: PaymentMethod;
  private status: ChargeStatus;
  private createdAt: Date;
  private updatedAt: Date;
  private pixKey?: string;
  private boletoDueDate?: Date;
  private cardInstallments?: number;
  private cardLastDigits?: string;

  constructor(
    id: string,
    customerId: string,
    amount: number,
    paymentMethod: PaymentMethod,
    currency: string = 'BRL',
    status: ChargeStatus = ChargeStatus.PENDING,
    createdAt?: Date,
    updatedAt?: Date,
    pixKey?: string,
    boletoDueDate?: Date,
    cardInstallments?: number,
    cardLastDigits?: string,
  ) {
    this.id = id;
    this.customerId = customerId;
    this.amount = amount;
    this.currency = currency;
    this.paymentMethod = paymentMethod;
    this.status = status;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    this.pixKey = pixKey;
    this.boletoDueDate = boletoDueDate;
    this.cardInstallments = cardInstallments;
    this.cardLastDigits = cardLastDigits;
  }

  getId(): string {
    return this.id;
  }

  getCustomerId(): string {
    return this.customerId;
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  getPaymentMethod(): PaymentMethod {
    return this.paymentMethod;
  }

  getStatus(): ChargeStatus {
    return this.status;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getPixKey(): string | undefined {
    return this.pixKey;
  }

  getBoletoDueDate(): Date | undefined {
    return this.boletoDueDate;
  }

  getCardInstallments(): number | undefined {
    return this.cardInstallments;
  }

  getCardLastDigits(): string | undefined {
    return this.cardLastDigits;
  }

  markAsPaid(): void {
    this.status = ChargeStatus.PAID;
    this.updatedAt = new Date();
  }

  markAsFailed(): void {
    this.status = ChargeStatus.FAILED;
    this.updatedAt = new Date();
  }

  markAsExpired(): void {
    this.status = ChargeStatus.EXPIRED;
    this.updatedAt = new Date();
  }

  canBeUpdated(): boolean {
    return this.status === ChargeStatus.PENDING;
  }
}
