import { prisma } from '../lib/prisma';
import { NotFoundError } from '../utils/errors';
import { CandidateStatus } from '@prisma/client';

export interface GetCandidatesQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: CandidateStatus;
}

export class CandidateService {
  /**
   * List candidates with paginating, searching, and filtering
   */
  static async getCandidates(userId: string, query: GetCandidatesQuery) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: any = {
      createdById: userId,
    };

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.OR = [
        { fullName: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [candidates, total] = await Promise.all([
      prisma.candidate.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          reports: {
            orderBy: { generatedAt: 'desc' },
            take: 1,
          },
        },
      }),
      prisma.candidate.count({ where }),
    ]);

    return {
      candidates,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Create candidate record
   */
  static async createCandidate(userId: string, data: {
    fullName: string;
    email: string;
    phone: string;
    aadhaarNumber: string;
    panNumber: string;
    dob: string;
    address: string;
  }) {
    return prisma.candidate.create({
      data: {
        ...data,
        createdById: userId,
      },
    });
  }

  /**
   * Get candidate details including logs and reports
   */
  static async getCandidateById(userId: string, id: string) {
    const candidate = await prisma.candidate.findFirst({
      where: { id, createdById: userId },
      include: {
        logs: { orderBy: { verifiedAt: 'desc' } },
        reports: { orderBy: { generatedAt: 'desc' } },
      },
    });

    if (!candidate) {
      throw new NotFoundError('Candidate not found');
    }

    return candidate;
  }

  /**
   * Update candidate
   */
  static async updateCandidate(userId: string, id: string, data: {
    fullName?: string;
    email?: string;
    phone?: string;
    aadhaarNumber?: string;
    panNumber?: string;
    dob?: string;
    address?: string;
  }) {
    const candidate = await prisma.candidate.findFirst({
      where: { id, createdById: userId },
    });

    if (!candidate) {
      throw new NotFoundError('Candidate not found');
    }

    // Reset status to PENDING if critical identity fields are updated
    const statusUpdate = (data.aadhaarNumber && data.aadhaarNumber !== candidate.aadhaarNumber) || 
                         (data.panNumber && data.panNumber !== candidate.panNumber)
                         ? { status: CandidateStatus.PENDING }
                         : {};

    return prisma.candidate.update({
      where: { id },
      data: {
        ...data,
        ...statusUpdate,
      },
    });
  }

  /**
   * Delete candidate
   */
  static async deleteCandidate(userId: string, id: string) {
    const candidate = await prisma.candidate.findFirst({
      where: { id, createdById: userId },
    });

    if (!candidate) {
      throw new NotFoundError('Candidate not found');
    }

    await prisma.candidate.delete({
      where: { id },
    });

    return { success: true, message: 'Candidate deleted successfully' };
  }
}
