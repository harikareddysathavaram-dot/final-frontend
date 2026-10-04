import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ClaimService } from '../../../core/services/claim.service';
import { ClaimResponseDto } from '../../../core/models/claim.models';

@Component({
  selector: 'app-surveyor-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class SurveyorDashboardComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private claimService = inject(ClaimService);

  claims: ClaimResponseDto[] = [];
  activeTab = 'pending';
  isLoading = true;
  actionMessage = '';
  actionError = '';

  // Review modal
  showReviewModal = false;
  selectedClaim: ClaimResponseDto | null = null;
  reviewForm!: FormGroup;

  get userName(): string {
    return this.authService.currentUserValue?.fullName || 'Surveyor';
  }

  get surveyorId(): string {
    return this.authService.userId || '';
  }

  get pendingClaims() {
    return this.claims.filter(c => c.status === 'Submitted' || c.status === 'UnderReview');
  }

  get reviewedClaims() {
    return this.claims.filter(c => c.status !== 'Submitted' && c.status !== 'UnderReview');
  }

  ngOnInit() {
    this.reviewForm = this.fb.group({
      status: ['Approved', Validators.required],
      approvedAmount: [0, [Validators.required, Validators.min(0)]],
      surveyorNotes: ['', Validators.required]
    });

    this.loadClaims();
  }

  loadClaims() {
    this.isLoading = true;
    this.claimService.getAllClaims().subscribe({
      next: (claims) => {
        this.claims = claims;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  setTab(tab: string) {
    this.activeTab = tab;
    this.actionMessage = '';
    this.actionError = '';
  }

  openReview(claim: ClaimResponseDto) {
    this.selectedClaim = claim;
    this.showReviewModal = true;
    this.reviewForm.patchValue({
      status: 'Approved',
      approvedAmount: claim.estimatedClaimAmount,
      surveyorNotes: ''
    });
  }

  closeReview() {
    this.showReviewModal = false;
    this.selectedClaim = null;
  }

  submitReview() {
    if (this.reviewForm.invalid || !this.selectedClaim) return;

    const request = {
      ...this.reviewForm.value,
      surveyorId: this.surveyorId
    };

    this.claimService.reviewClaim(this.selectedClaim.id, request).subscribe({
      next: (updated) => {
        const idx = this.claims.findIndex(c => c.id === this.selectedClaim!.id);
        if (idx >= 0) this.claims[idx] = updated;
        this.actionMessage = `Claim ${updated.claimNumber} has been ${updated.status.toLowerCase()}.`;
        this.closeReview();
      },
      error: (err) => {
        this.actionError = err.message || 'Failed to submit review.';
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'active': case 'approved': case 'completed': case 'paid':
        return 'badge-success';
      case 'pending': case 'submitted': case 'underreview': case 'processing':
        return 'badge-warning';
      case 'rejected': case 'denied':
        return 'badge-danger';
      default:
        return 'badge-info';
    }
  }
}
