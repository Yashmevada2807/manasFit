import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  User, 
  Settings, 
  Shield, 
  Save,
  Eye,
  EyeOff,
  Smartphone,
  Menu,
  Camera,
  Upload,
  Check,
  X,
  Bell,
  Lock,
  Target,
  Activity,
  Zap,
  Edit3
} from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import Sidebar from '../components/Sidebar';
import ThemeToggle from '../components/ThemeToggle';
import toast from 'react-hot-toast';

interface ProfileFormData {
  name: string;
  university?: string;
  major?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PreferencesFormData {
  notifications: {
    email: boolean;
    push: boolean;
    reminders: boolean;
  };
  privacy: {
    shareData: boolean;
    anonymousMode: boolean;
  };
  goals: {
    dailySteps: number;
    sleepHours: number;
    studyHours: number;
    waterIntake: number;
  };
}

const Profile = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'preferences' | 'connections'>('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors }
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.firstName || '',
      university: '',
      major: '',
      dateOfBirth: '',
      gender: 'other'
    }
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    watch
  } = useForm<PasswordFormData>();

  const {
    register: registerPreferences,
    handleSubmit: handlePreferencesSubmit
  } = useForm<PreferencesFormData>({
    defaultValues: {
      notifications: {
        email: true,
        push: true,
        reminders: true
      },
      privacy: {
        shareData: false,
        anonymousMode: false
      },
      goals: {
        dailySteps: 10000,
        sleepHours: 8,
        studyHours: 6,
        waterIntake: 2.5
      }
    }
  });

  const onProfileSubmit = async () => {
    try {
      // Update profile logic here
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const onPasswordSubmit = async () => {
    try {
      // Change password logic here
      toast.success('Password changed successfully!');
      resetPassword();
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  const onPreferencesSubmit = async () => {
    try {
      // Update preferences logic here
      toast.success('Preferences updated successfully!');
    } catch (error) {
      toast.error('Failed to update preferences');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User, description: 'Personal information' },
    { id: 'password', label: 'Security', icon: Shield, description: 'Password & security' },
    { id: 'preferences', label: 'Preferences', icon: Settings, description: 'Notifications & goals' },
    { id: 'connections', label: 'Devices', icon: Smartphone, description: 'Connected devices' },
  ];

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-brutal-grey dark:bg-dark-bg flex transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Bar */}
        <div className="bg-brutal-white dark:bg-dark-surface border-b-4 border-brutal-black dark:border-dark-border px-4 py-6 lg:px-8 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-3 rounded-lg border-2 border-brutal-black dark:border-dark-border hover:bg-mongo-50 dark:hover:bg-dark-card transition-all duration-200"
              >
                <Menu className="w-5 h-5 text-brutal-black dark:text-dark-text" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-brutal-black dark:text-dark-text uppercase tracking-wide">
                  Profile Settings
                </h1>
                <p className="text-gray-600 dark:text-dark-textSecondary font-medium">
                  Manage your account settings and preferences
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardContent className="p-6">
                    <nav className="space-y-2">
                      {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`w-full flex flex-col items-start space-y-1 px-4 py-4 text-left font-bold rounded-lg border-2 transition-all duration-200 ${
                              activeTab === tab.id
                                ? 'bg-mongo-500 text-brutal-black border-brutal-black shadow-brutalist dark:bg-mongo-500 dark:text-dark-text dark:border-dark-border'
                                : 'text-gray-700 hover:text-brutal-black hover:bg-mongo-50 border-transparent hover:border-brutal-black dark:text-dark-textSecondary dark:hover:text-dark-text dark:hover:bg-dark-card dark:hover:border-dark-border'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <Icon className="w-5 h-5" />
                              <span className="text-sm uppercase tracking-wide">{tab.label}</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-dark-textSecondary ml-8">
                              {tab.description}
                            </p>
                          </button>
                        );
                      })}
                    </nav>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    {/* Profile Header with Avatar */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center space-x-3">
                            <User className="w-6 h-6" />
                            <span>Profile Information</span>
                          </CardTitle>
                          <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="btn btn-outline btn-sm"
                          >
                            {isEditing ? (
                              <>
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                              </>
                            ) : (
                              <>
                                <Camera className="w-4 h-4 mr-2" />
                                Edit Profile
                              </>
                            )}
                          </button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
                          {/* Avatar Section */}
                          <div className="flex flex-col items-center space-y-4">
                            <div className="relative">
                              <div className="w-32 h-32 rounded-full border-4 border-brutal-black dark:border-dark-border overflow-hidden bg-mongo-50 dark:bg-dark-card">
                                {avatarPreview ? (
                                  <img
                                    src={avatarPreview}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                  />
                                ) : user?.imageUrl ? (
                                  <img
                                    src={user.imageUrl}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-mongo-500 dark:bg-mongo-600">
                                    <User className="w-16 h-16 text-brutal-white dark:text-dark-text" />
                                  </div>
                                )}
                              </div>
                              {isEditing && (
                                <label className="absolute bottom-0 right-0 bg-mongo-500 dark:bg-mongo-600 text-brutal-white dark:text-dark-text p-2 rounded-full border-2 border-brutal-black dark:border-dark-border cursor-pointer hover:bg-mongo-600 dark:hover:bg-mongo-700 transition-colors">
                                  <Camera className="w-4 h-4" />
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    className="hidden"
                                  />
                                </label>
                              )}
                            </div>
                            <div className="text-center">
                              <h3 className="font-bold text-lg text-brutal-black dark:text-dark-text">
                                {user?.firstName} {user?.lastName}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-dark-textSecondary">
                                {user?.emailAddresses[0]?.emailAddress}
                              </p>
                            </div>
                          </div>

                          {/* Profile Stats */}
                          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-mongo-50 dark:bg-dark-card p-4 rounded-lg border-2 border-brutal-black dark:border-dark-border text-center">
                              <Activity className="w-6 h-6 mx-auto mb-2 text-mongo-600 dark:text-mongo-400" />
                              <p className="text-2xl font-bold text-brutal-black dark:text-dark-text">127</p>
                              <p className="text-xs text-gray-600 dark:text-dark-textSecondary">Days Active</p>
                            </div>
                            <div className="bg-mongo-50 dark:bg-dark-card p-4 rounded-lg border-2 border-brutal-black dark:border-dark-border text-center">
                              <Target className="w-6 h-6 mx-auto mb-2 text-mongo-600 dark:text-mongo-400" />
                              <p className="text-2xl font-bold text-brutal-black dark:text-dark-text">85%</p>
                              <p className="text-xs text-gray-600 dark:text-dark-textSecondary">Goals Met</p>
                            </div>
                            <div className="bg-mongo-50 dark:bg-dark-card p-4 rounded-lg border-2 border-brutal-black dark:border-dark-border text-center">
                              <Zap className="w-6 h-6 mx-auto mb-2 text-mongo-600 dark:text-mongo-400" />
                              <p className="text-2xl font-bold text-brutal-black dark:text-dark-text">42</p>
                              <p className="text-xs text-gray-600 dark:text-dark-textSecondary">Streak</p>
                            </div>
                            <div className="bg-mongo-50 dark:bg-dark-card p-4 rounded-lg border-2 border-brutal-black dark:border-dark-border text-center">
                              <Bell className="w-6 h-6 mx-auto mb-2 text-mongo-600 dark:text-mongo-400" />
                              <p className="text-2xl font-bold text-brutal-black dark:text-dark-text">3</p>
                              <p className="text-xs text-gray-600 dark:text-dark-textSecondary">Reminders</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Profile Form */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-3">
                          <Settings className="w-6 h-6" />
                          <span>Personal Details</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div>
                              <label className="block text-sm font-bold text-brutal-black dark:text-dark-text mb-2 uppercase tracking-wide">
                                Full Name
                              </label>
                              <input
                                {...registerProfile('name', { required: 'Name is required' })}
                                type="text"
                                className="input"
                                disabled={!isEditing}
                              />
                              {profileErrors.name && (
                                <p className="mt-1 text-sm text-brutal-red dark:text-brutal-red font-medium">{profileErrors.name.message}</p>
                              )}
                            </div>

                            {/* Email (Read-only) */}
                            <div>
                              <label className="block text-sm font-bold text-brutal-black dark:text-dark-text mb-2 uppercase tracking-wide">
                                Email Address
                              </label>
                              <input
                                type="email"
                                value={user?.emailAddresses[0]?.emailAddress || ''}
                                disabled
                                className="input bg-gray-100 dark:bg-dark-surface"
                              />
                              <p className="mt-1 text-xs text-gray-500 dark:text-dark-textSecondary font-medium">Email cannot be changed</p>
                            </div>

                            {/* University */}
                            <div>
                              <label className="block text-sm font-bold text-brutal-black dark:text-dark-text mb-2 uppercase tracking-wide">
                                University
                              </label>
                              <input
                                {...registerProfile('university')}
                                type="text"
                                className="input"
                                disabled={!isEditing}
                                placeholder="Enter your university"
                              />
                            </div>

                            {/* Major */}
                            <div>
                              <label className="block text-sm font-bold text-brutal-black dark:text-dark-text mb-2 uppercase tracking-wide">
                                Major/Field of Study
                              </label>
                              <input
                                {...registerProfile('major')}
                                type="text"
                                className="input"
                                disabled={!isEditing}
                                placeholder="Enter your major"
                              />
                            </div>

                            {/* Date of Birth */}
                            <div>
                              <label className="block text-sm font-bold text-brutal-black dark:text-dark-text mb-2 uppercase tracking-wide">
                                Date of Birth
                              </label>
                              <input
                                {...registerProfile('dateOfBirth')}
                                type="date"
                                className="input"
                                disabled={!isEditing}
                              />
                            </div>

                            {/* Gender */}
                            <div>
                              <label className="block text-sm font-bold text-brutal-black dark:text-dark-text mb-2 uppercase tracking-wide">
                                Gender
                              </label>
                              <select 
                                {...registerProfile('gender')} 
                                className="input"
                                disabled={!isEditing}
                              >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex justify-end space-x-4">
                            {isEditing && (
                              <button 
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="btn btn-ghost"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                              </button>
                            )}
                            <button 
                              type="submit" 
                              className="btn btn-primary"
                              disabled={!isEditing}
                            >
                              <Save className="w-4 h-4 mr-2" />
                              {isEditing ? 'Save Changes' : 'Edit to Save'}
                            </button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === 'password' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <Shield className="w-6 h-6" />
                        <span>Security Settings</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Security Status */}
                        <div className="bg-mongo-50 dark:bg-dark-card p-6 rounded-lg border-2 border-brutal-black dark:border-dark-border">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-3 h-3 bg-mongo-500 rounded-full"></div>
                            <h3 className="font-bold text-lg text-brutal-black dark:text-dark-text">Account Security</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center space-x-2">
                              <Check className="w-5 h-5 text-mongo-500" />
                              <span className="text-sm font-medium text-brutal-black dark:text-dark-text">Strong Password</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Check className="w-5 h-5 text-mongo-500" />
                              <span className="text-sm font-medium text-brutal-black dark:text-dark-text">Email Verified</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Lock className="w-5 h-5 text-mongo-500" />
                              <span className="text-sm font-medium text-brutal-black dark:text-dark-text">2FA Available</span>
                            </div>
                          </div>
                        </div>

                        <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
                          <div className="space-y-4">
                            {/* Current Password */}
                            <div>
                              <label className="block text-sm font-bold text-brutal-black dark:text-dark-text mb-2 uppercase tracking-wide">
                                Current Password
                              </label>
                              <div className="relative">
                                <input
                                  {...registerPassword('currentPassword', { required: 'Current password is required' })}
                                  type={showCurrentPassword ? 'text' : 'password'}
                                  className="input pr-12"
                                  placeholder="Enter your current password"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-brutal-black dark:hover:text-dark-text transition-colors"
                                >
                                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                              </div>
                              {passwordErrors.currentPassword && (
                                <p className="mt-1 text-sm text-brutal-red dark:text-brutal-red font-medium">{passwordErrors.currentPassword.message}</p>
                              )}
                            </div>

                            {/* New Password */}
                            <div>
                              <label className="block text-sm font-bold text-brutal-black dark:text-dark-text mb-2 uppercase tracking-wide">
                                New Password
                              </label>
                              <div className="relative">
                                <input
                                  {...registerPassword('newPassword', { 
                                    required: 'New password is required',
                                    minLength: { value: 8, message: 'Password must be at least 8 characters' }
                                  })}
                                  type={showNewPassword ? 'text' : 'password'}
                                  className="input pr-12"
                                  placeholder="Enter your new password"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-brutal-black dark:hover:text-dark-text transition-colors"
                                >
                                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                              </div>
                              {passwordErrors.newPassword && (
                                <p className="mt-1 text-sm text-brutal-red dark:text-brutal-red font-medium">{passwordErrors.newPassword.message}</p>
                              )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                              <label className="block text-sm font-bold text-brutal-black dark:text-dark-text mb-2 uppercase tracking-wide">
                                Confirm New Password
                              </label>
                              <div className="relative">
                                <input
                                  {...registerPassword('confirmPassword', { 
                                    required: 'Please confirm your password',
                                    validate: (value) => value === watch('newPassword') || 'Passwords do not match'
                                  })}
                                  type={showConfirmPassword ? 'text' : 'password'}
                                  className="input pr-12"
                                  placeholder="Confirm your new password"
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-brutal-black dark:hover:text-dark-text transition-colors"
                                >
                                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                              </div>
                              {passwordErrors.confirmPassword && (
                                <p className="mt-1 text-sm text-brutal-red dark:text-brutal-red font-medium">{passwordErrors.confirmPassword.message}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <button type="submit" className="btn btn-primary">
                              <Save className="w-4 h-4 mr-2" />
                              Change Password
                            </button>
                          </div>
                        </form>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeTab === 'preferences' && (
                  <div className="space-y-6">
                    {/* Notifications Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-3">
                          <Bell className="w-6 h-6" />
                          <span>Notifications</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handlePreferencesSubmit(onPreferencesSubmit)} className="space-y-6">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-mongo-50 dark:bg-dark-card rounded-lg border-2 border-brutal-black dark:border-dark-border">
                              <div>
                                <label className="text-sm font-bold text-brutal-black dark:text-dark-text uppercase tracking-wide">Email Notifications</label>
                                <p className="text-xs text-gray-500 dark:text-dark-textSecondary font-medium">Receive updates via email</p>
                              </div>
                              <input
                                {...registerPreferences('notifications.email')}
                                type="checkbox"
                                className="h-5 w-5 text-mongo-600 focus:ring-mongo-500 border-2 border-brutal-black dark:border-dark-border rounded"
                              />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-mongo-50 dark:bg-dark-card rounded-lg border-2 border-brutal-black dark:border-dark-border">
                              <div>
                                <label className="text-sm font-bold text-brutal-black dark:text-dark-text uppercase tracking-wide">Push Notifications</label>
                                <p className="text-xs text-gray-500 dark:text-dark-textSecondary font-medium">Receive push notifications</p>
                              </div>
                              <input
                                {...registerPreferences('notifications.push')}
                                type="checkbox"
                                className="h-5 w-5 text-mongo-600 focus:ring-mongo-500 border-2 border-brutal-black dark:border-dark-border rounded"
                              />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-mongo-50 dark:bg-dark-card rounded-lg border-2 border-brutal-black dark:border-dark-border">
                              <div>
                                <label className="text-sm font-bold text-brutal-black dark:text-dark-text uppercase tracking-wide">Reminders</label>
                                <p className="text-xs text-gray-500 dark:text-dark-textSecondary font-medium">Get reminded about wellness activities</p>
                              </div>
                              <input
                                {...registerPreferences('notifications.reminders')}
                                type="checkbox"
                                className="h-5 w-5 text-mongo-600 focus:ring-mongo-500 border-2 border-brutal-black dark:border-dark-border rounded"
                              />
                            </div>
                          </div>
                        </form>
                      </CardContent>
                    </Card>

                    {/* Privacy Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-3">
                          <Lock className="w-6 h-6" />
                          <span>Privacy Settings</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                          <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-mongo-50 dark:bg-dark-card rounded-lg border-2 border-brutal-black dark:border-dark-border">
                              <div>
                              <label className="text-sm font-bold text-brutal-black dark:text-dark-text uppercase tracking-wide">Share Data</label>
                              <p className="text-xs text-gray-500 dark:text-dark-textSecondary font-medium">Allow sharing of anonymous wellness data</p>
                              </div>
                              <input
                                {...registerPreferences('privacy.shareData')}
                                type="checkbox"
                              className="h-5 w-5 text-mongo-600 focus:ring-mongo-500 border-2 border-brutal-black dark:border-dark-border rounded"
                              />
                            </div>
                          <div className="flex items-center justify-between p-4 bg-mongo-50 dark:bg-dark-card rounded-lg border-2 border-brutal-black dark:border-dark-border">
                              <div>
                              <label className="text-sm font-bold text-brutal-black dark:text-dark-text uppercase tracking-wide">Anonymous Mode</label>
                              <p className="text-xs text-gray-500 dark:text-dark-textSecondary font-medium">Use app in anonymous mode</p>
                              </div>
                              <input
                                {...registerPreferences('privacy.anonymousMode')}
                                type="checkbox"
                              className="h-5 w-5 text-mongo-600 focus:ring-mongo-500 border-2 border-brutal-black dark:border-dark-border rounded"
                              />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Goals Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-3">
                          <Target className="w-6 h-6" />
                          <span>Wellness Goals</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-brutal-black dark:text-dark-text mb-2 uppercase tracking-wide">
                                Daily Steps
                              </label>
                              <input
                                {...registerPreferences('goals.dailySteps', { valueAsNumber: true })}
                                type="number"
                                className="input"
                              placeholder="10000"
                              />
                            </div>
                            <div>
                            <label className="block text-sm font-bold text-brutal-black dark:text-dark-text mb-2 uppercase tracking-wide">
                                Sleep Hours
                              </label>
                              <input
                                {...registerPreferences('goals.sleepHours', { valueAsNumber: true })}
                                type="number"
                                step="0.5"
                                className="input"
                              placeholder="8.0"
                              />
                            </div>
                            <div>
                            <label className="block text-sm font-bold text-brutal-black dark:text-dark-text mb-2 uppercase tracking-wide">
                                Study Hours
                              </label>
                              <input
                                {...registerPreferences('goals.studyHours', { valueAsNumber: true })}
                                type="number"
                                step="0.5"
                                className="input"
                              placeholder="6.0"
                              />
                            </div>
                            <div>
                            <label className="block text-sm font-bold text-brutal-black dark:text-dark-text mb-2 uppercase tracking-wide">
                                Water Intake (L)
                              </label>
                              <input
                                {...registerPreferences('goals.waterIntake', { valueAsNumber: true })}
                                type="number"
                                step="0.1"
                                className="input"
                              placeholder="2.5"
                              />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Save Button */}
                        <div className="flex justify-end">
                      <button 
                        type="submit" 
                        onClick={handlePreferencesSubmit(onPreferencesSubmit)}
                        className="btn btn-primary"
                      >
                            <Save className="w-4 h-4 mr-2" />
                            Save Preferences
                          </button>
                        </div>
                  </div>
                )}

                {activeTab === 'connections' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <Smartphone className="w-6 h-6" />
                        <span>Connected Devices</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Device Status */}
                        <div className="bg-mongo-50 dark:bg-dark-card p-6 rounded-lg border-2 border-brutal-black dark:border-dark-border">
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="w-3 h-3 bg-brutal-red rounded-full"></div>
                            <h3 className="font-bold text-lg text-brutal-black dark:text-dark-text">No Devices Connected</h3>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-dark-textSecondary font-medium mb-4">
                            Connect your smartwatch or fitness tracker to automatically sync your wellness data and get real-time insights.
                          </p>
                        </div>

                        {/* Available Devices */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-brutal-white dark:bg-dark-card p-6 rounded-lg border-2 border-brutal-black dark:border-dark-border hover:shadow-brutalist transition-all duration-200 cursor-pointer">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-mongo-500 rounded-lg flex items-center justify-center">
                                <Smartphone className="w-6 h-6 text-brutal-white" />
                              </div>
                              <div>
                                <h4 className="font-bold text-brutal-black dark:text-dark-text">Apple Watch</h4>
                                <p className="text-sm text-gray-600 dark:text-dark-textSecondary">Health & Fitness</p>
                              </div>
                            </div>
                            <button className="w-full mt-4 btn btn-outline btn-sm">
                              Connect
                            </button>
                          </div>

                          <div className="bg-brutal-white dark:bg-dark-card p-6 rounded-lg border-2 border-brutal-black dark:border-dark-border hover:shadow-brutalist transition-all duration-200 cursor-pointer">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-mongo-500 rounded-lg flex items-center justify-center">
                                <Activity className="w-6 h-6 text-brutal-white" />
                              </div>
                              <div>
                                <h4 className="font-bold text-brutal-black dark:text-dark-text">Fitbit</h4>
                                <p className="text-sm text-gray-600 dark:text-dark-textSecondary">Activity Tracking</p>
                              </div>
                            </div>
                            <button className="w-full mt-4 btn btn-outline btn-sm">
                              Connect
                            </button>
                          </div>
                        </div>

                        {/* Manual Data Entry */}
                        <div className="bg-brutal-yellow dark:bg-brutal-yellow p-6 rounded-lg border-2 border-brutal-black dark:border-dark-border">
                          <div className="flex items-center space-x-3 mb-2">
                            <Upload className="w-5 h-5 text-brutal-black" />
                            <h4 className="font-bold text-brutal-black">Manual Entry</h4>
                          </div>
                          <p className="text-sm text-brutal-black font-medium mb-4">
                            Don't have a device? You can manually enter your wellness data.
                          </p>
                          <button className="btn btn-primary">
                            <Upload className="w-4 h-4 mr-2" />
                            Add Data Manually
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;