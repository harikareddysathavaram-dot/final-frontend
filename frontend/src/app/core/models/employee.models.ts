export interface CreateEmployeeRequest {
  companyId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationalId: string;
  designation: string;
  department: string;
  monthlySalary: number;
  dateOfBirth: string;
  dateOfJoining: string;
}

export interface EmployeeResponseDto {
  id: string;
  companyId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationalId: string;
  designation: string;
  department: string;
  monthlySalary: number;
  dateOfBirth: string;
  dateOfJoining: string;
  isActive: boolean;
  createdAt: string;
}

export interface UpdateEmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  monthlySalary: number;
  isActive: boolean;
}
