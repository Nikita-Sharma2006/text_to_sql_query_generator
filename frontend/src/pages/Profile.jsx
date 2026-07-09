import React, { useState } from 'react';
import { Shield, Sparkles, Star, Database, Award, Key } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile, updatePassword, queries, schemas } = useApp();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [editing, setEditing] = useState(false);

  // Password fields
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const favCount = queries.filter(q => q.isFavorite).length;

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('Details cannot be blank.');
      return;
    }
    updateProfile(name, email);
    setEditing(false);
    toast.success('Credentials updated!');
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('All password fields are required.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    updatePassword(oldPassword, newPassword);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswordChange(false);
    toast.success('Your passcode has been updated!');
  };

  return (
    <div className="space-y-8 text-left animate-fade-in font-sans">
      {/* Title Header */}
      <div>
        <h2 className="text-2xl font-display font-bold tracking-tight text-primary uppercase">User Profile</h2>
        <p className="text-xs text-secondary mt-1">Manage your identity credentials, credentials records, and passcodes</p>
      </div>

      {/* Divider */}
      <div className="h-px bg-border-light w-full"></div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar & stats info */}
        <div className="space-y-6">
          <Card variant="parchment" className="text-center hover:border-border-light">
            <div className="flex flex-col items-center py-6 space-y-4">
              {/* Avatar Frame */}
              <div className="w-24 h-24 rounded-full border border-border-light overflow-hidden bg-white shadow-md flex items-center justify-center">
                <img 
                  src={user?.avatar} 
                  alt={user?.name} 
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="text-lg font-display font-bold text-primary uppercase tracking-tight">{user?.name}</h3>
                <span className="text-xs text-secondary block mt-0.5">
                  Daimyo Administrator
                </span>
              </div>

              {/* Clan Crest badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/20 border border-accent/40 text-[10px] font-sans font-bold text-primary uppercase rounded-full">
                <Award size={12} />
                Citadel Admin
              </div>
            </div>
          </Card>

          {/* Stats Achievements Card */}
          <Card variant="parchment" title="Platform Records" className="hover:border-border-light">
            <div className="space-y-3.5 text-xs text-secondary">
              <div className="flex justify-between items-center border-b border-border-light/50 pb-2">
                <span className="flex items-center gap-2 font-medium">
                  <Sparkles size={13} className="text-primary" /> Queries Forged
                </span>
                <span className="font-bold text-primary">{queries.length}</span>
              </div>
              <div className="flex justify-between items-center border-b border-border-light/50 pb-2">
                <span className="flex items-center gap-2 font-medium">
                  <Star size={13} className="text-[#EAB308]" /> Starred Items
                </span>
                <span className="font-bold text-primary">{favCount}</span>
              </div>
              <div className="flex justify-between items-center pb-0.5">
                <span className="flex items-center gap-2 font-medium">
                  <Database size={13} className="text-primary" /> Loaded Schemas
                </span>
                <span className="font-bold text-primary">{schemas.length}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right 2 Columns: Edit Profile & Password change */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Credentials details Card */}
          <Card 
            variant="parchment" 
            title="Account Credentials" 
            className="hover:border-border-light"
            headerAction={
              !editing && (
                <Button variant="secondary" size="sm" onClick={() => setEditing(true)} className="rounded-lg text-xs">
                  Edit Profile
                </Button>
              )
            }
          >
            {editing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4 text-left">
                <Input
                  label="Display Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="ghost" size="sm" onClick={() => setEditing(false)} className="rounded-lg text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" className="rounded-lg text-xs">
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-3.5 text-xs text-secondary text-left">
                <div className="grid grid-cols-3 gap-2 py-2 border-b border-border-light/50">
                  <span className="font-semibold text-primary">Display Name</span>
                  <span className="col-span-2 text-primary font-bold">{user?.name}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-2 border-b border-border-light/50">
                  <span className="font-semibold text-primary">Email Address</span>
                  <span className="col-span-2 text-primary font-bold">{user?.email}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-2">
                  <span className="font-semibold text-primary">Citadel Rank</span>
                  <span className="col-span-2 text-primary font-bold flex items-center gap-1">
                    <Shield size={12} className="text-primary" /> Root Administrator
                  </span>
                </div>
              </div>
            )}
          </Card>

          {/* Password Re-forge Card */}
          <Card variant="parchment" title="Authentication Codes" className="hover:border-border-light">
            {showPasswordChange ? (
              <form onSubmit={handlePasswordUpdate} className="space-y-4 text-left">
                <Input
                  label="Current Password"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
                <Input
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="ghost" size="sm" onClick={() => setShowPasswordChange(false)} className="rounded-lg text-xs">
                    Close
                  </Button>
                  <Button type="submit" variant="primary" size="sm" className="rounded-lg text-xs">
                    Update Password
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-left text-xs text-secondary">
                <p className="leading-relaxed text-secondary/80">
                  Adjust the password credentials used to access the gatehouse. Keep your codes protected from adversary spy operations.
                </p>
                <div className="pt-2">
                  <Button 
                    onClick={() => setShowPasswordChange(true)}
                    variant="secondary" 
                    size="sm"
                    className="flex items-center gap-1.5 rounded-lg text-xs"
                  >
                    <Key size={13} />
                    CHANGE PASSWORD
                  </Button>
                </div>
              </div>
            )}
          </Card>

        </div>

      </div>
    </div>
  );
};

export default Profile;
