import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { z, ZodIssue } from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { BackgroundDecorations } from '../../components/BackgroundDecorations';
import { useAuthStore } from '../../../store/authStore';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SignInFormData = z.infer<typeof signInSchema>;

export function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const signIn = useAuthStore((state) => state.signIn);
  const redirectTo = new URLSearchParams(location.search).get('redirect') ?? '/';
  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof SignInFormData, string>>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = signInSchema.parse(formData);

      // TODO: Replace with actual API call to authenticate user
      // Example: const response = await fetch('/api/auth/signin', { method: 'POST', body: JSON.stringify(validatedData) });
      console.log('Sign in data:', validatedData);

      const user = {
        id: Math.random().toString(36).slice(2, 10),
        name: validatedData.email
          .split('@')[0]
          .split(/[._-]/)
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' '),
        email: validatedData.email,
      };

      signIn(user);
      navigate(redirectTo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof SignInFormData, string>> = {};
        error.issues.forEach((err: ZodIssue) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as keyof SignInFormData] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  const handleChange = (field: keyof SignInFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Google OAuth sign-in flow
    // Example: window.location.href = '/api/auth/google';
    console.log('Google sign-in clicked');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 relative bg-white dark:bg-neutral-900">
      <BackgroundDecorations />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
        <h1 className="text-3xl mb-2 text-neutral-900 dark:text-neutral-100 font-display">Welcome Back</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl p-8 space-y-6 backdrop-blur-sm">
          <div>
            <label htmlFor="email" className="block text-sm mb-2 font-medium text-neutral-700 dark:text-neutral-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 ${
                errors.email ? 'border-red-500 dark:border-red-400' : 'border-neutral-300 dark:border-neutral-600'
              }`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-2 font-medium text-neutral-700 dark:text-neutral-300">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 ${
                  errors.password ? 'border-red-500 dark:border-red-400' : 'border-neutral-300 dark:border-neutral-600'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Link to="/auth/forgot-password" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg transition-colors font-semibold shadow-lg hover:shadow-indigo-500/50"
          >
            Sign In
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-300 dark:border-neutral-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/auth/signup" className="text-black hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
