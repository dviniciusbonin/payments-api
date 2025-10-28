import { Email } from '../value-objects/email.vo';
import { Document } from '../value-objects/document.vo';

export class Customer {
  private id: string;
  private name: string;
  private email: Email;
  private document: Document;
  private phone?: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    id: string,
    name: string,
    email: Email,
    document: Document,
    phone?: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.document = document;
    this.phone = phone;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): Email {
    return this.email;
  }

  getDocument(): Document {
    return this.document;
  }

  getPhone(): string | undefined {
    return this.phone;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  updateName(name: string): void {
    this.name = name;
    this.updatedAt = new Date();
  }

  updatePhone(phone: string): void {
    this.phone = phone;
    this.updatedAt = new Date();
  }
}
