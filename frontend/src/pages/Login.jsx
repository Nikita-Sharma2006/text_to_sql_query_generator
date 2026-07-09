import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, Mail, Lock, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Input from '../components/Input';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const tempErrors = {};
    if (!email) {
      tempErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Please provide a valid email address.';
    }
    
    if (!password) {
      tempErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters.';
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 800));
      const success = await login(email, password);
      
      if (success) {
        toast.success('Successfully entered the citadel gates!');
        navigate('/dashboard');
      } else {
        toast.error('Invalid credentials. Check your details.');
      }
    } catch (err) {
      toast.error(err.message || 'Citadel connection failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    toast('Secret reset link sent to your email (Mock action).', {
      icon: '✉️',
      style: {
        background: '#111111',
        color: '#FFFFFF',
        border: '1px solid #E5E7EB',
        fontFamily: 'Inter, sans-serif'
      }
    });
  };

  return (
    <div className="min-h-screen bg-bg-default flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden grid-bg font-sans">
      {/* Decorative details */}
      <div className="absolute top-10 left-10 w-24 h-24 border-t border-l border-border-light pointer-events-none hidden sm:block"></div>
      <div className="absolute bottom-10 right-10 w-24 h-24 border-b border-r border-border-light pointer-events-none hidden sm:block"></div>

      {/* Main card box */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white border border-border-light rounded-[20px] px-8 py-10 shadow-sm relative">
          {/* Logo / Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary text-accent shadow-sm">
                <Layers size={18} />
              </div>
              <span className="font-display font-extrabold text-sm tracking-tight text-primary uppercase">SHOGUN SQL</span>
            </Link>
            <h2 className="text-2xl font-display font-bold tracking-tight text-primary">Enter Citadel</h2>
            <p className="text-xs text-secondary mt-1">Unlock the AI-Integrated MySQL Query engine</p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                label="Registered Email"
                type="email"
                placeholder="samurai@shogunsql.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                required
              />

              <Input
                label="Citadel Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-accent border-border-light bg-white rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-secondary font-medium select-none cursor-pointer">
                  Remember credentials
                </label>
              </div>

              <div className="text-xs">
                <a
                  href="#"
                  onClick={handleForgotPassword}
                  className="font-sans font-semibold text-secondary hover:text-primary transition-colors"
                >
                  Forgot Password?
                </a>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full text-center py-2.5 rounded-lg font-semibold"
                loading={loading}
              >
                Log In
              </Button>
            </div>
          </form>

          {/* Bottom links */}
          <div className="mt-8 pt-6 border-t border-border-light text-center text-xs text-secondary">
            New practitioner?{' '}
            <Link
              to="/register"
              className="font-semibold text-primary hover:text-secondary transition-colors ml-1"
            >
              Request Access (Register)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
