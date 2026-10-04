export interface CreateCompanyRequest {
  userId: string;
  companyName: string;
  registrationNumber: string;
  taxId: string;
  industry: string;
  address: string;
  phone: string;
  email: string;
}

export interface CompanyResponseDto {
  id: string;
  userId: string;
  companyName: string;
  registrationNumber: string;
  taxId: string;
  industry: string;
  address: string;
  phone: string;
  email: string;
  status: string;
  createdAt: string;
  isActive: boolean;
}

export interface UpdateCompanyStatusRequest {
  status: string;
}
