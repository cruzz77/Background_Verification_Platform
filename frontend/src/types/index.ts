export type CandidateStatus = 'PENDING' | 'VERIFIED' | 'FAILED' | 'PARTIAL';
export type VerificationStatus = 'SUCCESS' | 'FAILED';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface VerificationLog {
  id: string;
  candidateId: string;
  verificationType: 'AADHAAR' | 'PAN';
  requestPayload: any;
  responsePayload: any;
  verificationStatus: VerificationStatus;
  verifiedAt: string;
}

export interface Report {
  id: string;
  candidateId: string;
  reportUrl: string;
  generatedAt: string;
}

export interface Candidate {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  aadhaarNumber: string;
  panNumber: string;
  dob: string;
  address: string;
  status: CandidateStatus;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  logs?: VerificationLog[];
  reports?: Report[];
}

export interface DashboardStats {
  total: number;
  verified: number;
  failed: number;
  partial: number;
  pending: number;
}
