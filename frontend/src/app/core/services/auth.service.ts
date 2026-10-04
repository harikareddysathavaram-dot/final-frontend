import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, RegisterEmployerRequest, RegisterSurveyorRequest, UserResponseDto } from '../models/auth.models';
import { Observable, BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/auth`;
  
  private currentUserSubject = new BehaviorSubject<LoginResponse | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, request).pipe(
      tap(response => {
        if (response && response.token) {
          localStorage.setItem('currentUser', JSON.stringify(response));
          this.currentUserSubject.next(response);
        }
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
      })
    );
  }

  registerEmployer(request: RegisterEmployerRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register-employer`, request);
  }

  registerSurveyor(request: RegisterSurveyorRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register-surveyor`, request);
  }

  getPendingUsers(): Observable<UserResponseDto[]> {
    return this.http.get<UserResponseDto[]>(`${this.baseUrl}/pending-users`);
  }

  approveUser(userId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/approve/${userId}`, {});
  }

  public get currentUserValue(): LoginResponse | null {
    return this.currentUserSubject.value;
  }

  public get token(): string | null {
    return this.currentUserValue?.token || null;
  }
  
  public get role(): string | null {
    return this.currentUserValue?.role || null;
  }

  public get userId(): string | null {
    const token = this.token;
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || payload.nameid || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] || null;
    } catch {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    return !!this.token;
  }

  private getStoredUser(): LoginResponse | null {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
}
