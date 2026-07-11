import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { Sparkles, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

export const Login = () => {
  const { loginUser, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
    
    // Check if redirected because of token expiry
    if (searchParams.get('expired')) {
      toast.error('Session expired. Please log in again.');
    }
  }, [user, navigate, searchParams]);

  const onSubmit = async (data) => {
    setLoading(true);
    const toastId = toast.loading('Authenticating...');
    try {
      await loginUser(data.email, data.password);
      toast.success('Logged in successfully!', { id: toastId });
      navigate('/dashboard');
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Login failed. Please check credentials.';
      toast.error(errMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-3xl glass p-8 shadow-xl">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
            <Sparkles className="h-6 w-6" />
          </Link>
          <h2 className="mt-6 font-outfit text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Log in to scan resumes and view your history.
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  className={`w-full rounded-xl border bg-white/50 py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-dark-800 dark:bg-dark-900/50 dark:text-slate-200 dark:focus:border-emerald-500 ${
                    errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-200'
                  }`}
                  placeholder="name@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                      message: 'Please fill a valid email address',
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Password
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  className={`w-full rounded-xl border bg-white/50 py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none dark:border-dark-800 dark:bg-dark-900/50 dark:text-slate-200 dark:focus:border-emerald-500 ${
                    errors.password ? 'border-red-500 focus:border-red-500' : 'border-slate-200'
                  }`}
                  placeholder="••••••••"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters long',
                    },
                  })}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 font-semibold text-white shadow-lg shadow-emerald-600/10 hover:bg-emerald-500 hover:shadow-emerald-500/20 disabled:bg-slate-300 dark:bg-emerald-500 dark:hover:bg-emerald-400 transition-all duration-200"
            >
              <LogIn className="h-4 w-4" />
              <span>Log In</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
