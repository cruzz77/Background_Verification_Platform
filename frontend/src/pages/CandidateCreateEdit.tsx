import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCandidateStore } from '../store/candidateStore';
import { useToastStore } from '../components/Toast';
import { ArrowLeft, Shield } from 'lucide-react';

const candidateFormSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters long'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number (E.164 format, e.g. +919876543210)'),
  aadhaarNumber: z.string().regex(/^\d{12}$/, 'Aadhaar number must be exactly 12 numeric digits'),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'PAN must follow standard corporate tax format: ABCDE1234F'),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be in YYYY-MM-DD format'),
  address: z.string().min(5, 'Address must be at least 5 characters long'),
});

type CandidateFormInput = z.infer<typeof candidateFormSchema>;

export const CandidateCreateEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addToast = useToastStore((state) => state.addToast);
  const { currentCandidate, loading, fetchCandidate, createCandidate, updateCandidate, clearCurrentCandidate } = useCandidateStore();

  const isEditMode = !!id;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CandidateFormInput>({
    resolver: zodResolver(candidateFormSchema),
  });

  useEffect(() => {
    if (isEditMode && id) {
      fetchCandidate(id);
    } else {
      clearCurrentCandidate();
      reset({
        fullName: '',
        email: '',
        phone: '',
        aadhaarNumber: '',
        panNumber: '',
        dob: '',
        address: '',
      });
    }
  }, [id, isEditMode, fetchCandidate, clearCurrentCandidate, reset]);

  // Sync form state when editing candidate profile
  useEffect(() => {
    if (isEditMode && currentCandidate) {
      reset({
        fullName: currentCandidate.fullName,
        email: currentCandidate.email,
        phone: currentCandidate.phone,
        aadhaarNumber: currentCandidate.aadhaarNumber,
        panNumber: currentCandidate.panNumber,
        dob: currentCandidate.dob,
        address: currentCandidate.address,
      });
    }
  }, [currentCandidate, isEditMode, reset]);

  const onSubmit = async (data: CandidateFormInput) => {
    try {
      if (isEditMode && id) {
        await updateCandidate(id, data);
        addToast('Candidate profile updated successfully.', 'success');
        navigate(`/candidates/${id}`);
      } else {
        const newCandidate = await createCandidate(data);
        addToast('Candidate profile registered successfully.', 'success');
        navigate(`/candidates/${newCandidate.id}`);
      }
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Failed to save candidate credentials.', 'error');
    }
  };

  if (loading && isEditMode && !currentCandidate) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-24"></div>
        <div className="h-96 bg-white border border-slate-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header and Go back */}
      <div className="space-y-2">
        <button 
          onClick={() => navigate(isEditMode ? `/candidates/${id}` : '/candidates')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          {isEditMode ? 'Edit Candidate Profile' : 'Register Candidate'}
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          {isEditMode 
            ? 'Updating candidate details will reset verification status back to Pending if Aadhaar or PAN is modified.' 
            : 'Register a new candidate profile to start government identity checks.'}
        </p>
      </div>

      {/* Form Details */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-slate-200 rounded p-6 shadow-premium space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="E.g. Jane Doe"
              {...register('fullName')}
              className={`w-full px-3 py-2 text-sm border rounded bg-white text-slate-800 transition-all ${
                errors.fullName ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'
              }`}
            />
            {errors.fullName && (
              <span className="text-xs text-red-600 mt-1 block">{errors.fullName.message}</span>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="jane.doe@example.com"
              {...register('email')}
              className={`w-full px-3 py-2 text-sm border rounded bg-white text-slate-800 transition-all ${
                errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'
              }`}
            />
            {errors.email && (
              <span className="text-xs text-red-600 mt-1 block">{errors.email.message}</span>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Phone Number
            </label>
            <input
              type="text"
              placeholder="E.g. +919876543210"
              {...register('phone')}
              className={`w-full px-3 py-2 text-sm border rounded bg-white text-slate-800 transition-all ${
                errors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'
              }`}
            />
            {errors.phone && (
              <span className="text-xs text-red-600 mt-1 block">{errors.phone.message}</span>
            )}
          </div>

          {/* Aadhaar Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Aadhaar Number
            </label>
            <input
              type="text"
              placeholder="12-digit numeric code"
              maxLength={12}
              {...register('aadhaarNumber')}
              className={`w-full px-3 py-2 text-sm border rounded bg-white text-slate-800 transition-all ${
                errors.aadhaarNumber ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'
              }`}
            />
            {errors.aadhaarNumber && (
              <span className="text-xs text-red-600 mt-1 block">{errors.aadhaarNumber.message}</span>
            )}
          </div>

          {/* PAN Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              PAN Number
            </label>
            <input
              type="text"
              placeholder="Format: ABCDE1234F"
              maxLength={10}
              {...register('panNumber')}
              className={`w-full px-3 py-2 text-sm border rounded bg-white text-slate-800 transition-all ${
                errors.panNumber ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'
              }`}
            />
            {errors.panNumber && (
              <span className="text-xs text-red-600 mt-1 block">{errors.panNumber.message}</span>
            )}
          </div>

          {/* DOB */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Date of Birth
            </label>
            <input
              type="text"
              placeholder="YYYY-MM-DD"
              {...register('dob')}
              className={`w-full px-3 py-2 text-sm border rounded bg-white text-slate-800 transition-all ${
                errors.dob ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'
              }`}
            />
            {errors.dob && (
              <span className="text-xs text-red-600 mt-1 block">{errors.dob.message}</span>
            )}
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Current Address
            </label>
            <textarea
              rows={3}
              placeholder="Complete residential address"
              {...register('address')}
              className={`w-full px-3 py-2 text-sm border rounded bg-white text-slate-800 transition-all ${
                errors.address ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'
              }`}
            />
            {errors.address && (
              <span className="text-xs text-red-600 mt-1 block">{errors.address.message}</span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
          <Link
            to={isEditMode ? `/candidates/${id}` : '/candidates'}
            className="inline-flex items-center justify-center bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold px-4 py-2 rounded shadow-premium transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2 rounded shadow-premium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};
export default CandidateCreateEdit;
