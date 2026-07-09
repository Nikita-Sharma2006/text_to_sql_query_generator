import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Layers } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const Register = () => {
  const { register } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const tempErrors = {};
    if (!name.trim()) {
      tempErrors.name = 'Warrior name is required.';
    }
    
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

    if (password !== confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match.';
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const success = await register(name, email, password);
      
      if (success) {
        toast.success('Your name is registered in the Citadel scroll!');
        navigate('/dashboard');
      } else {
        toast.error('Registration rejected by Gatekeeper.');
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-default flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden grid-bg font-sans">
      <div className="absolute top-10 left-10 w-24 h-24 border-t border-l border-border-light pointer-events-none hidden sm:block"></div>
      <div className="absolute bottom-10 right-10 w-24 h-24 border-b border-r border-border-light pointer-events-none hidden sm:block"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white border border-border-light rounded-[20px] px-8 py-8 shadow-sm relative">
          {/* Logo / Header */}
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary text-accent shadow-sm">
                <Layers size={18} />
              </div>
              <span className="font-display font-extrabold text-sm tracking-tight text-primary uppercase">SHOGUN SQL</span>
            </Link>
            <h2 className="text-2xl font-display font-bold tracking-tight text-primary">Join Clan</h2>
            <p className="text-xs text-secondary mt-1">Enroll your details onto the workspace register</p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Warrior Display Name"
              placeholder="Minamoto Yoshitsune"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              required
            />

            <Input
              label="Contact Email"
              type="email"
              placeholder="samurai@shogunsql.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              required
            />

            <Input
              label="Choose Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
              required
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full text-center py-2.5 rounded-lg font-semibold"
                loading={loading}
              >
                Sign Up
              </Button>
            </div>
          </form>

          {/* Bottom links */}
          <div className="mt-6 pt-5 border-t border-border-light text-center text-xs text-secondary">
            Already enrolled?{' '}
            <Link
              to="/login"
              className="font-semibold text-primary hover:text-secondary transition-colors ml-1"
            >
              Enter Citadel (Login)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
