import { useState } from 'react';
import { Mail, Lock, User, Building2, Globe, Eye, EyeOff, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    companyName: '',
    country: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [animationKey, setAnimationKey] = useState(0);

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 
    'France', 'India', 'Japan', 'Brazil', 'Mexico', 'Spain', 'Italy'
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.name) newErrors.name = 'Full name is required';
      if (!formData.companyName) newErrors.companyName = 'Company name is required';
      if (!formData.country) newErrors.country = 'Please select a country';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (isLogin) {
        console.log('Login attempt:', { email: formData.email });
      } else {
        console.log('Signup attempt:', formData);
      }
      
      // Show success message or redirect
      alert(isLogin ? 'Login successful!' : `Welcome to ${formData.companyName}! Your account has been created.`);
      
    } catch (error) {
      console.error('Authentication error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    alert('Google Sign-In integration (Demo)');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#FFB6B9] to-[#FAE3D9]">
      <motion.div 
        key={animationKey}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden relative z-10"
      >
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#BBDED6] rounded-full mix-blend-multiply blur-xl opacity-70" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#FFB6B9] rounded-full mix-blend-multiply blur-xl opacity-70" />
        
        <div className="relative z-10 p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg bg-[#FAE3D9]">
              <Building2 className="w-10 h-10" style={{ color: '#61C0BF' }} />
            </div>
          </div>

          {/* Title */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-800">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-500 mt-2">
              {isLogin ? 'Sign in to continue to your dashboard' : 'Start your journey with us today'}
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-5 overflow-hidden"
              >
                <div>
                  <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none transition-all duration-200 text-black ${
                    errors.name ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-[#BBDED6]'
                    }`}
                  />
                  </div>
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="companyName"
                    placeholder="Company Name"
                    value={formData.companyName}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none transition-all duration-200 text-black ${
                    errors.companyName ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-[#BBDED6]'
                    }`}
                  />
                  </div>
                  {errors.companyName && <p className="mt-1 text-xs text-red-500">{errors.companyName}</p>}
                </div>
              </motion.div>
            )}

            {/* Email */}
            <div>
              <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none transition-all duration-200 text-black ${
                errors.email ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-[#BBDED6]'
                }`}
              />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none transition-all duration-200 text-black ${
                errors.password ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-[#BBDED6]'
                }`}
              />
              <button 
                type="button" 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            {!isLogin && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div>
                  <div className="relative">
                  <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-10 py-3 border rounded-xl focus:outline-none transition-all duration-200 appearance-none bg-white text-black ${
                    errors.country ? 'border-red-300 focus:border-red-400' : 'border-gray-200 focus:border-[#BBDED6]'
                    }`}
                  >
                    <option value="">Select Country</option>
                    {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                  <svg 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  </div>
                  {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country}</p>}
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className={`w-full py-3.5 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transform transition-all duration-200 ${
                isLoading 
                  ? 'bg-[#61C0BF]/60 cursor-not-allowed' 
                  : 'bg-[#61C0BF] hover:brightness-110 hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2 h-5 w-5 text-white" />
                  {isLogin ? 'Logging in...' : 'Creating Account...'}
                </div>
              ) : isLogin ? (
                'Login to Your Account'
              ) : (
                'Create Company Account'
              )}
            </motion.button>
          </form>

          {/* Divider */}
          {isLogin && (
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
          )}

          {/* Social Login Buttons */}
          {isLogin && (
            <div className="grid grid-cols-1 gap-3">
              <motion.button
                type="button"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-[#FAE3D9] transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </motion.button>
            </div>
          )}

          {/* Toggle Login/Signup */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-center text-sm text-gray-600"
          >
            {isLogin ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAnimationKey(prev => prev + 1);
                    setIsLogin(false);
                  }}
                  className="font-semibold" style={{ color: '#61C0BF' }}
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAnimationKey(prev => prev + 1);
                    setIsLogin(true);
                  }}
                  className="font-semibold" style={{ color: '#61C0BF' }}
                >
                  Sign in
                </button>
              </p>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
