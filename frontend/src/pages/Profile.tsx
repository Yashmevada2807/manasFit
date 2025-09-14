import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  User, 
  Mail, 
  GraduationCap, 
  Calendar, 
  Settings, 
  Bell, 
  Shield, 
  Target,
  Save,
  Eye,
  EyeOff,
  Smartphone,
  Award
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
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
  const { user, updateProfile, changePassword } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'preferences' | 'connections'>('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || '',
      university: user?.university || '',
      major: user?.major || '',
      dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
      gender: user?.gender || undefined,
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    watch,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<PasswordFormData>();

  const {
    register: registerPreferences,
    handleSubmit: handlePreferencesSubmit,
    formState: { errors: preferencesErrors },
  } = useForm<PreferencesFormData>({
    defaultValues: {
      notifications: user?.preferences.notifications || {
        email: true,
        push: true,
        reminders: true,
      },
      privacy: user?.preferences.privacy || {
        shareData: false,
        anonymousMode: false,
      },
      goals: user?.preferences.goals || {
        dailySteps: 10000,
        sleepHours: 8,
        studyHours: 6,
        waterIntake: 2.5,
      },
    },
  });

  const newPassword = watch('newPassword');

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile(data);
    } catch (error) {
      // Error is handled by the store
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      resetPassword();
      toast.success('Password changed successfully!');
    } catch (error) {
      // Error is handled by the store
    }
  };

  const onPreferencesSubmit = async (data: PreferencesFormData) => {
    try {
      await updateProfile({ preferences: data });
    } catch (error) {
      // Error is handled by the store
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'password', label: 'Password', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'connections', label: 'Connections', icon: Smartphone },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          activeTab === tab.id
                            ? 'bg-primary-100 text-primary-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
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
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          {...registerProfile('name', { required: 'Name is required' })}
                          type="text"
                          className="input"
                        />
                        {profileErrors.name && (
                          <p className="mt-1 text-sm text-error-600">{profileErrors.name.message}</p>
                        )}
                      </div>

                      {/* Email (Read-only) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="input pl-10 bg-gray-50"
                          />
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                      </div>

                      {/* University */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          University
                        </label>
                        <div className="relative">
                          <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            {...registerProfile('university')}
                            type="text"
                            className="input pl-10"
                            placeholder="Enter your university"
                          />
                        </div>
                      </div>

                      {/* Major */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Major
                        </label>
                        <input
                          {...registerProfile('major')}
                          type="text"
                          className="input"
                          placeholder="Enter your major"
                        />
                      </div>

                      {/* Date of Birth */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Date of Birth
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <input
                            {...registerProfile('dateOfBirth')}
                            type="date"
                            className="input pl-10"
                          />
                        </div>
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Gender
                        </label>
                        <select {...registerProfile('gender')} className="input">
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button type="submit" className="btn btn-primary">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeTab === 'password' && (
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-6">
                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          {...registerPassword('currentPassword', { required: 'Current password is required' })}
                          type={showCurrentPassword ? 'text' : 'password'}
                          className="input pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {passwordErrors.currentPassword && (
                        <p className="mt-1 text-sm text-error-600">{passwordErrors.currentPassword.message}</p>
                      )}
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          {...registerPassword('newPassword', {
                            required: 'New password is required',
                            minLength: { value: 6, message: 'Password must be at least 6 characters' },
                          })}
                          type={showNewPassword ? 'text' : 'password'}
                          className="input pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {passwordErrors.newPassword && (
                        <p className="mt-1 text-sm text-error-600">{passwordErrors.newPassword.message}</p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          {...registerPassword('confirmPassword', {
                            required: 'Please confirm your password',
                            validate: (value) => value === newPassword || 'Passwords do not match',
                          })}
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="input pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      {passwordErrors.confirmPassword && (
                        <p className="mt-1 text-sm text-error-600">{passwordErrors.confirmPassword.message}</p>
                      )}
                    </div>

                    <div className="flex justify-end">
                      <button type="submit" className="btn btn-primary">
                        <Save className="w-4 h-4 mr-2" />
                        Change Password
                      </button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                {/* Notifications */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="w-5 h-5 mr-2" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePreferencesSubmit(onPreferencesSubmit)} className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-900">Email Notifications</label>
                            <p className="text-sm text-gray-500">Receive wellness tips and updates via email</p>
                          </div>
                          <input
                            {...registerPreferences('notifications.email')}
                            type="checkbox"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-900">Push Notifications</label>
                            <p className="text-sm text-gray-500">Get reminders and alerts on your device</p>
                          </div>
                          <input
                            {...registerPreferences('notifications.push')}
                            type="checkbox"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium text-gray-900">Reminders</label>
                            <p className="text-sm text-gray-500">Daily reminders to log your wellness data</p>
                          </div>
                          <input
                            {...registerPreferences('notifications.reminders')}
                            type="checkbox"
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button type="submit" className="btn btn-primary">
                          <Save className="w-4 h-4 mr-2" />
                          Save Preferences
                        </button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {/* Goals */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="w-5 h-5 mr-2" />
                      Wellness Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePreferencesSubmit(onPreferencesSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Daily Steps Goal
                          </label>
                          <input
                            {...registerPreferences('goals.dailySteps', { min: 1000, max: 50000 })}
                            type="number"
                            className="input"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sleep Hours Goal
                          </label>
                          <input
                            {...registerPreferences('goals.sleepHours', { min: 4, max: 12 })}
                            type="number"
                            step="0.5"
                            className="input"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Study Hours Goal
                          </label>
                          <input
                            {...registerPreferences('goals.studyHours', { min: 1, max: 16 })}
                            type="number"
                            step="0.5"
                            className="input"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Water Intake Goal (L)
                          </label>
                          <input
                            {...registerPreferences('goals.waterIntake', { min: 1, max: 10 })}
                            type="number"
                            step="0.1"
                            className="input"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button type="submit" className="btn btn-primary">
                          <Save className="w-4 h-4 mr-2" />
                          Save Goals
                        </button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'connections' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Smartphone className="w-5 h-5 mr-2" />
                    Smartwatch Connections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user?.smartwatchConnections && user.smartwatchConnections.length > 0 ? (
                      user.smartwatchConnections.map((connection, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                              <Smartphone className="w-5 h-5 text-primary-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900 capitalize">
                                {connection.provider.replace('-', ' ')}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Last sync: {new Date(connection.lastSync).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              connection.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {connection.isActive ? 'Connected' : 'Disconnected'}
                            </span>
                            <button className="btn btn-outline btn-sm">
                              Disconnect
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Smartphone className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No connections yet</h3>
                        <p className="text-gray-500 mb-4">
                          Connect your smartwatch to automatically sync your wellness data.
                        </p>
                        <button className="btn btn-primary">
                          Connect Device
                        </button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
