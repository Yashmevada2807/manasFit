import { useEffect, useState } from 'react';
import { 
  Activity, 
  Heart, 
  Moon, 
  BookOpen, 
  Droplets, 
  TrendingUp,
  Calendar,
  Target,
  AlertCircle,
  Award,
  Plus,
  Filter,
  BarChart3,
  Clock,
  Zap,
  Users,
  ChevronRight,
  Eye,
  CheckCircle2,
  Menu
} from 'lucide-react';
import { useWellnessStore } from '../store/wellnessStore';
import { useUser } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import WellnessChart from '../components/WellnessChart';
import ActivityHeatmap from '../components/ActivityHeatmap';
import Sidebar from '../components/Sidebar';
import AddWellnessDataModal from '../components/AddWellnessDataModal';
import { format } from 'date-fns';

const Dashboard = () => {
  const { 
    dashboardData, 
    isLoading, 
    getDashboardData, 
    currentPeriod, 
    setCurrentPeriod 
  } = useWellnessStore();
  const { user } = useUser();
  const [showAddModal, setShowAddModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    getDashboardData();
  }, [getDashboardData]);

  const handlePeriodChange = (period: string) => {
    setCurrentPeriod(period);
    getDashboardData(period);
  };

  if (isLoading && !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-gray-600">Loading your wellness dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats;
  const alerts = dashboardData?.alerts || [];
  const unreadAlerts = alerts.filter(alert => !alert.isRead);

  // Generate mock heatmap data for demonstration
  const generateHeatmapData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Random activity data (in real app, this would come from backend)
      const count = Math.floor(Math.random() * 5);
      const level = count === 0 ? 0 : Math.min(Math.ceil(count), 4);
      
      data.push({
        date: format(date, 'yyyy-MM-dd'),
        count,
        level
      });
    }
    
    return data.reverse();
  };

  const heatmapData = generateHeatmapData();

  const statCards = [
    {
      title: 'Steps Today',
      value: stats?.averageSteps.toLocaleString() || '0',
      icon: Activity,
      goal: 10000,
      color: 'blue',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Sleep Hours',
      value: `${stats?.averageSleep || 0}h`,
      icon: Moon,
      goal: 8,
      color: 'purple',
      change: '+5%',
      trend: 'up'
    },
    {
      title: 'Study Hours',
      value: `${stats?.averageStudy || 0}h`,
      icon: BookOpen,
      goal: 6,
      color: 'green',
      change: '-2%',
      trend: 'down'
    },
    {
      title: 'Water Intake',
      value: `${stats?.averageWater || 0}L`,
      icon: Droplets,
      goal: 2.5,
      color: 'cyan',
      change: '+8%',
      trend: 'up'
    },
  ];

  const quickActions = [
    { title: 'Log Activity', icon: Activity, color: 'blue', action: () => setShowAddModal(true) },
    { title: 'Set Goal', icon: Target, color: 'green', action: () => {} },
    { title: 'View Insights', icon: Eye, color: 'purple', action: () => {} },
    { title: 'Export Data', icon: BarChart3, color: 'orange', action: () => {} },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-4 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.firstName || 'User'}! 👋
                </h1>
                <p className="text-gray-600">
                  Here's your wellness overview for the last {
                    currentPeriod === '7d' ? '7 days' : 
                    currentPeriod === '30d' ? '30 days' : '90 days'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Period Selector */}
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                {['1d', '7d', '30d', '90d'].map((period) => (
                  <button
                    key={period}
                    onClick={() => handlePeriodChange(period)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentPeriod === period
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {period === '1d' ? 'Today' : 
                     period === '7d' ? '7 Days' :
                     period === '30d' ? '30 Days' : '90 Days'}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Data</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-4 lg:p-8">

        {/* Alerts */}
        {unreadAlerts.length > 0 && (
          <div className="mb-8">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-amber-800 mb-2">
                    You have {unreadAlerts.length} wellness alert{unreadAlerts.length > 1 ? 's' : ''}
                  </h3>
                  <div className="space-y-2">
                    {unreadAlerts.slice(0, 2).map((alert) => (
                      <p key={alert._id} className="text-sm text-amber-700">
                        {alert.message}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            const progress = stat.goal > 0 ? Math.min((parseFloat(stat.value.replace(/[^\d.]/g, '')) / stat.goal) * 100, 100) : 0;
            
            return (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <div className={`flex items-center space-x-1 text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className={`w-4 h-4 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                    <span>{stat.change}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">Goal: {stat.goal}{stat.title.includes('Hours') ? 'h' : stat.title.includes('Water') ? 'L' : ''}</p>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-${stat.color}-600 h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                  <span>{stat.goal}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Activity Heatmap */}
          <div className="lg:col-span-2">
            <ActivityHeatmap 
              data={heatmapData}
              onDateClick={(date) => console.log('Clicked date:', date)}
            />
          </div>

          {/* Quick Actions & Streak Info */}
          <div className="space-y-6">
            {/* Current Streak */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Current Streak</h3>
                <Zap className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {dashboardData?.currentStreak || 0}
                </div>
                <p className="text-sm text-gray-600 mb-4">days in a row</p>
                <div className="bg-gray-100 rounded-lg p-3">
                  <p className="text-xs text-gray-600">
                    Keep tracking your wellness data to maintain your streak!
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={action.action}
                      className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 bg-${action.color}-100 rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-4 h-4 text-${action.color}-600`} />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{action.title}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Wellness Trends */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Wellness Trends</h3>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <WellnessChart data={dashboardData?.wellnessEntries || []} />
          </div>

          {/* Recent Rewards */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Achievements</h3>
              <Award className="w-5 h-5 text-gray-400" />
            </div>
            {dashboardData?.recentRewards && dashboardData.recentRewards.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentRewards.slice(0, 3).map((reward) => (
                  <div key={reward.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{reward.name}</p>
                      <p className="text-xs text-gray-600">{reward.description}</p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">No achievements yet</p>
                <p className="text-gray-400 text-xs">Keep tracking to earn rewards!</p>
              </div>
            )}
          </div>
        </div>

        {/* Goals Section */}
        {dashboardData?.goals && dashboardData.goals.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Your Goals</h3>
              <Target className="w-5 h-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardData.goals.map((goal) => (
                <div key={goal._id} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900 capitalize">{goal.type}</h4>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {goal.period}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-medium mb-2">
                    <span className="text-gray-900">{goal.current}</span>
                    <span className="text-gray-500">/ {goal.target}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span className="font-medium">{Math.round((goal.current / goal.target) * 100)}%</span>
                    <span>{goal.target}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Add Wellness Data Modal */}
      {showAddModal && (
        <AddWellnessDataModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            getDashboardData();
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
