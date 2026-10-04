import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SubmitClaimRequestDto, ClaimResponseDto, ReviewClaimRequestDto } from '../models/claim.models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClaimService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/claims`;

  submitClaim(request: SubmitClaimRequestDto): Observable<ClaimResponseDto> {
    return this.http.post<ClaimResponseDto>(`${this.baseUrl}/submit`, request);
  }

  getClaimById(id: string): Observable<ClaimResponseDto> {
    return this.http.get<ClaimResponseDto>(`${this.baseUrl}/${id}`);
  }

  getClaimsByCompany(companyId: string): Observable<ClaimResponseDto[]> {
    return this.http.get<ClaimResponseDto[]>(`${this.baseUrl}/company/${companyId}`);
  }

  getAllClaims(): Observable<ClaimResponseDto[]> {
    return this.http.get<ClaimResponseDto[]>(this.baseUrl);
  }

  reviewClaim(id: string, request: ReviewClaimRequestDto): Observable<ClaimResponseDto> {
    return this.http.put<ClaimResponseDto>(`${this.baseUrl}/${id}/review`, request);
  }

  updateClaimStatus(id: string, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/status?status=${status}`, {});
  }
}
