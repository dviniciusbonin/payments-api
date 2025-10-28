export class CustomerOutputDto {
  id: string;
  name: string;
  email: string;
  document: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}
