export interface RequestQuotationDto {
  companyId: string;
  industryType: string;
  totalEmployees: number;
  estimatedAnnualPayroll: number;
}

export interface QuotationResponseDto {
  id: string;
  quotationNumber: string;
  companyId: string;
  industryType: string;
  totalEmployees: number;
  estimatedAnnualPayroll: number;
  calculatedPremium: number;
  status: string;
  createdAt: string;
  validUntil: string;
}

export interface AcceptQuotationDto {
  quotationId: string;
}

export interface EmployeeCoverageDto {
  id: string;
  employeeId: string;
  employeeName: string;
  coverageStatus: string;
  effectiveDate: string;
}

export interface PolicyResponseDto {
  id: string;
  policyNumber: string;
  quotationId: string;
  companyId: string;
  coverageAmount: number;
  annualPremium: number;
  status: string;
  effectiveDate: string;
  expirationDate: string;
  createdAt: string;
  coveredEmployees: EmployeeCoverageDto[];
}

export interface AddEmployeeCoverageDto {
  employeeId: string;
  employeeName: string;
}
