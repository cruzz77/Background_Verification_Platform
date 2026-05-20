import { useForm } from 'react-hook-form';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../components/Toast';
import { Shield } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type RegisterFormInput = z.infer<typeof registerSchema>;

export const Register = () => {
  const { register: registerUser, loading, token } = useAuthStore();
  const addToast = useToastStore((state) => state.addToast);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInput>({
    resolver: zodResolver(registerSchema),
  });

  // If already logged in, redirect to dashboard
  if (token) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data: RegisterFormInput) => {
    try {
      await registerUser(data as any);
      addToast('Welcome! Account registered and logged in successfully.', 'success');
      navigate('/');
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Registration failed. Please try again.', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded p-8 shadow-premium">
        {/* Header Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 rounded bg-slate-900 flex items-center justify-center mb-3">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Create your Account</h2>
          <p className="text-xs text-slate-500 font-medium mt-1">Get started with vShield SaaS platform</p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              {...register('name')}
              className={`w-full px-3 py-2 text-sm border rounded bg-white text-slate-800 transition-all ${
                errors.name ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'
              }`}
            />
            {errors.name && (
              <span className="text-xs text-red-600 mt-1 block">{errors.name.message}</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              {...register('email')}
              className={`w-full px-3 py-2 text-sm border rounded bg-white text-slate-800 transition-all ${
                errors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'
              }`}
            />
            {errors.email && (
              <span className="text-xs text-red-600 mt-1 block">{errors.email.message}</span>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className={`w-full px-3 py-2 text-sm border rounded bg-white text-slate-800 transition-all ${
                errors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-200'
              }`}
            />
            {errors.password && (
              <span className="text-xs text-red-600 mt-1 block">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold py-2.5 rounded shadow-premium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        {/* Login Redirect */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-slate-950 font-semibold underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Register;
