export interface SubmitClaimRequestDto {
  policyId: string;
  companyId: string;
  employeeId: string;
  employeeName: string;
  incidentDate: string;
  injuryType: string;
  description: string;
  estimatedClaimAmount: number;
}

export interface ClaimDocumentDto {
  id: string;
  documentName: string;
  documentUrl: string;
  uploadedAt: string;
}

export interface ClaimResponseDto {
  id: string;
  claimNumber: string;
  policyId: string;
  companyId: string;
  employeeId: string;
  employeeName: string;
  incidentDate: string;
  injuryType: string;
  description: string;
  estimatedClaimAmount: number;
  approvedAmount: number;
  status: string;
  surveyorId?: string | null;
  surveyorNotes?: string | null;
  createdAt: string;
  processedAt?: string | null;
  documents: ClaimDocumentDto[];
}

export interface ReviewClaimRequestDto {
  surveyorId: string;
  status: string;
  approvedAmount: number;
  surveyorNotes: string;
}
