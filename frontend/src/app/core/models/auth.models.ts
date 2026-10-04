export interface LoginRequest {
  email: string;
  password?: string; // Optional if only passing from form
}

export interface LoginResponse {
  token: string;
  role: string;
  fullName: string;
}

export interface RegisterEmployerRequest {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

export interface RegisterSurveyorRequest {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

export interface UserResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
}

export interface JwtClaims {
  sub: string;
  email: string;
  unique_name: string;
  role: string;
  exp: number;
}
