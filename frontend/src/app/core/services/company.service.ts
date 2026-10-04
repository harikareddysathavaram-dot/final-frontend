import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CompanyResponseDto, CreateCompanyRequest, UpdateCompanyStatusRequest } from '../models/company.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/companies`;

  registerCompany(request: CreateCompanyRequest): Observable<CompanyResponseDto> {
    return this.http.post<CompanyResponseDto>(`${this.baseUrl}/register`, request);
  }

  getAllCompanies(): Observable<CompanyResponseDto[]> {
    return this.http.get<CompanyResponseDto[]>(this.baseUrl);
  }

  getCompanyById(id: string): Observable<CompanyResponseDto> {
    return this.http.get<CompanyResponseDto>(`${this.baseUrl}/${id}`);
  }

  getCompanyByUserId(userId: string): Observable<CompanyResponseDto> {
    return this.http.get<CompanyResponseDto>(`${this.baseUrl}/user/${userId}`);
  }

  updateCompanyStatus(id: string, request: UpdateCompanyStatusRequest): Observable<CompanyResponseDto> {
    return this.http.put<CompanyResponseDto>(`${this.baseUrl}/${id}/status`, request);
  }
}
