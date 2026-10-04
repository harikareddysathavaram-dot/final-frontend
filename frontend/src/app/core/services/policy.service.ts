import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { RequestQuotationDto, QuotationResponseDto, AcceptQuotationDto, PolicyResponseDto, AddEmployeeCoverageDto } from '../models/policy.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  private http = inject(HttpClient);
  
  private quotationUrl = `${environment.apiUrl}/quotations`;
  private policyUrl = `${environment.apiUrl}/policies`;

  // Quotation APIs
  requestQuotation(request: RequestQuotationDto): Observable<QuotationResponseDto> {
    return this.http.post<QuotationResponseDto>(`${this.quotationUrl}/request`, request);
  }

  getQuotationById(id: string): Observable<QuotationResponseDto> {
    return this.http.get<QuotationResponseDto>(`${this.quotationUrl}/${id}`);
  }

  getQuotationsByCompany(companyId: string): Observable<QuotationResponseDto[]> {
    return this.http.get<QuotationResponseDto[]>(`${this.quotationUrl}/company/${companyId}`);
  }

  acceptQuotation(request: AcceptQuotationDto): Observable<PolicyResponseDto> {
    return this.http.post<PolicyResponseDto>(`${this.quotationUrl}/accept`, request);
  }

  // Policy APIs
  getAllPolicies(): Observable<PolicyResponseDto[]> {
    return this.http.get<PolicyResponseDto[]>(this.policyUrl);
  }

  getPolicyById(id: string): Observable<PolicyResponseDto> {
    return this.http.get<PolicyResponseDto>(`${this.policyUrl}/${id}`);
  }

  getPoliciesByCompany(companyId: string): Observable<PolicyResponseDto[]> {
    return this.http.get<PolicyResponseDto[]>(`${this.policyUrl}/company/${companyId}`);
  }

  addEmployeeCoverage(id: string, request: AddEmployeeCoverageDto): Observable<PolicyResponseDto> {
    return this.http.post<PolicyResponseDto>(`${this.policyUrl}/${id}/coverage`, request);
  }

  activatePolicy(id: string): Observable<any> {
    return this.http.put(`${this.policyUrl}/${id}/activate`, {});
  }
}
