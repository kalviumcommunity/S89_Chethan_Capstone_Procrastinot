// src/pages/Profile.jsx
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Calendar,
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  Settings,
  BarChart3,
  CheckCircle,
  Clock,
  Target,
  Trophy,
  Brain,
  Activity
} from 'lucide-react';
import Navbar from '../components/Navbar1';
import Footer from '../components/Footer';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import clsx from 'clsx';

export default function Profile() {
  const { user, stats, loading, updateProfile, uploadProfilePicture, changePassword } = useUser();
  const { isDark } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Initialize form data when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || '',
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    try {
      setFormLoading(true);
      await changePassword(passwordData);
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password');
    } finally {
      setFormLoading(false);
    }
  };

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setFormLoading(true);
      await uploadProfilePicture(file);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    } finally {
      setFormLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-mesh text-white' : 'bg-gradient-to-br from-slate-50 to-blue-50 text-gray-900'} relative overflow-hidden flex items-center justify-center`}>
        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-dark-900/50 via-primary-900/30 to-secondary-900/50' : 'bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50'}`} />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Tasks', value: stats?.totalTasks || 0, icon: CheckCircle, color: 'text-blue-400' },
    { label: 'Completed Tasks', value: stats?.completedTasks || 0, icon: Target, color: 'text-green-400' },
    { label: 'Skills Learning', value: stats?.totalSkills || 0, icon: Brain, color: 'text-purple-400' },
    { label: 'Pomodoro Sessions', value: stats?.pomodoroSessions || 0, icon: Clock, color: 'text-orange-400' },
    { label: 'Challenges Completed', value: stats?.completedChallenges || 0, icon: Trophy, color: 'text-yellow-400' },
    { label: 'Mood Logs', value: stats?.moodLogs || 0, icon: Activity, color: 'text-pink-400' },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-mesh text-white' : 'bg-gradient-to-br from-slate-50 to-blue-50 text-gray-900'} relative overflow-hidden`}>
      {/* Animated Background */}
      <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-dark-900/50 via-primary-900/30 to-secondary-900/50' : 'bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50'}`} />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />

        <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Your <span className="text-gradient">Profile</span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Manage your account settings and view your progress
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="card-glass p-6">
                <div className="text-center mb-6">
                  {/* Profile Picture */}
                  <div className="relative inline-block mb-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-bold text-2xl">
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        user.username?.charAt(0).toUpperCase() || 'U'
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-600 transition-colors"
                    >
                      <Camera size={16} />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      className="hidden"
                    />
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-2">{user.username}</h2>
                  <p className="text-white/60 mb-4">{user.email}</p>
                  
                  {user.bio && (
                    <p className="text-white/80 text-sm mb-4">{user.bio}</p>
                  )}

                  <div className="flex items-center justify-center gap-4 text-sm text-white/60">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    <Edit3 size={16} />
                    Edit Profile
                  </button>
                  
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="w-full btn-glass flex items-center justify-center gap-2"
                  >
                    <Shield size={16} />
                    Change Password
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Stats and Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Statistics */}
              <div className="card-glass p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <BarChart3 size={20} />
                  Your Statistics
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {statCards.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="bg-white/5 rounded-xl p-4 text-center"
                    >
                      <stat.icon size={24} className={`mx-auto mb-2 ${stat.color}`} />
                      <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-sm text-white/60">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="card-glass p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Activity size={20} />
                  Recent Activity
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <CheckCircle size={16} className="text-green-400" />
                    <span className="text-white/80">Last active: {new Date(user.updatedAt).toLocaleDateString()}</span>
                  </div>
                  
                  {stats?.joinedDate && (
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                      <Calendar size={16} className="text-blue-400" />
                      <span className="text-white/80">Member since: {new Date(stats.joinedDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <Footer />
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-800 rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Edit Profile</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-white/60 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Username</label>
                <input
                  type="text"
                  value={formData.username || ''}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Bio</label>
                <textarea
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  {formLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-glass px-6"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangingPassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-dark-800 rounded-2xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Change Password</h3>
              <button
                onClick={() => setIsChangingPassword(false)}
                className="text-white/60 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  <Shield size={16} />
                  {formLoading ? 'Changing...' : 'Change Password'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="btn-glass px-6"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
