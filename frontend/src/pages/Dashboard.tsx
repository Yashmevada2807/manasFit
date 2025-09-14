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
  Filter
} from 'lucide-react';
import { useWellnessStore } from '../store/wellnessStore';
import { useAuthStore } from '../store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import WellnessChart from '../components/WellnessChart';
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
  const { user } = useAuthStore();
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    getDashboardData();
  }, [getDashboardData]);

  const handlePeriodChange = (period: string) => {
    setCurrentPeriod(period);
    getDashboardData(period);
  };

  if (isLoading && !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brutal-grey">
        <div className="loading-spinner" />
      </div>
    );
  }

  const stats = dashboardData?.stats;
  const alerts = dashboardData?.alerts || [];
  const unreadAlerts = alerts.filter(alert => !alert.isRead);

  const statCards = [
    {
      title: 'STEPS TODAY',
      value: stats?.averageSteps.toLocaleString() || '0',
      icon: Activity,
      goal: user?.preferences.goals.dailySteps || 10000,
    },
    {
      title: 'SLEEP HOURS',
      value: `${stats?.averageSleep || 0}H`,
      icon: Moon,
      goal: user?.preferences.goals.sleepHours || 8,
    },
    {
      title: 'STUDY HOURS',
      value: `${stats?.averageStudy || 0}H`,
      icon: BookOpen,
      goal: user?.preferences.goals.studyHours || 6,
    },
    {
      title: 'WATER INTAKE',
      value: `${stats?.averageWater || 0}L`,
      icon: Droplets,
      goal: user?.preferences.goals.waterIntake || 2.5,
    },
  ];

  return (
    <div className="min-h-screen bg-brutal-grey">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="brutalist-block bg-mongo-500 text-brutal-black mb-4 inline-block">
                <h1 className="text-4xl font-bold px-6 py-4 uppercase">
                  WELCOME BACK, {user?.name?.toUpperCase()}!
                </h1>
              </div>
              <p className="text-lg font-bold text-brutal-black uppercase">
                HERE'S YOUR WELLNESS OVERVIEW FOR THE LAST {
                  currentPeriod === '7d' ? '7 DAYS' : 
                  currentPeriod === '30d' ? '30 DAYS' : '90 DAYS'
                }
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="btn btn-secondary btn-md uppercase"
              >
                <Plus className="w-5 h-5 mr-2" />
                ADD DATA
              </button>
            </div>
          </div>

          {/* Period Selector */}
          <div className="mt-6 flex items-center space-x-4">
            <Filter className="w-6 h-6 text-brutal-black" />
            <div className="flex space-x-2">
              {['1d', '7d', '30d', '90d'].map((period) => (
                <button
                  key={period}
                  onClick={() => handlePeriodChange(period)}
                  className={`px-4 py-2 font-bold border-4 border-brutal-black transition-all uppercase text-sm ${
                    currentPeriod === period
                      ? 'bg-brutal-yellow text-brutal-black'
                      : 'bg-brutal-white text-brutal-black hover:bg-mongo-50'
                  }`}
                >
                  {period === '1d' ? 'TODAY' : 
                   period === '7d' ? '7 DAYS' :
                   period === '30d' ? '30 DAYS' : '90 DAYS'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts */}
        {unreadAlerts.length > 0 && (
          <div className="mb-6">
            <Card variant="accent">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="w-6 h-6 mr-3" />
                  WELLNESS ALERTS ({unreadAlerts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {unreadAlerts.slice(0, 3).map((alert) => (
                    <div
                      key={alert._id}
                      className="brutalist-block bg-brutal-white text-brutal-black p-4"
                    >
                      <p className="font-bold text-sm uppercase">{alert.message}</p>
                      <p className="text-xs font-medium mt-2 uppercase">
                        {format(new Date(alert.triggeredAt), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            const progress = stat.goal > 0 ? Math.min((parseFloat(stat.value.replace(/[^\d.]/g, '')) / stat.goal) * 100, 100) : 0;
            
            return (
              <Card key={index} hover>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-bold text-brutal-black uppercase">{stat.title}</p>
                      <p className="text-3xl font-bold text-brutal-black mt-1">{stat.value}</p>
                      <p className="text-xs font-medium text-gray-600 mt-1 uppercase">
                        GOAL: {stat.goal}{stat.title.includes('HOURS') ? 'H' : stat.title.includes('WATER') ? 'L' : ''}
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-mongo-500 border-4 border-brutal-black flex items-center justify-center">
                      <Icon className="w-8 h-8 text-brutal-black" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs font-bold text-brutal-black mb-2 uppercase">
                      <span>PROGRESS</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-brutal-white border-2 border-brutal-black h-4">
                      <div
                        className={`h-full transition-all duration-300 ${
                          progress >= 100 ? 'bg-mongo-500' : 
                          progress >= 75 ? 'bg-mongo-400' : 
                          progress >= 50 ? 'bg-brutal-yellow' : 'bg-brutal-red'
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts and Additional Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Wellness Chart */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-6 h-6 mr-3" />
                  WELLNESS TRENDS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <WellnessChart data={dashboardData?.wellnessEntries || []} />
              </CardContent>
            </Card>
          </div>

          {/* Current Streak & Rewards */}
          <div className="space-y-6">
            {/* Current Streak */}
            <Card variant="primary">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-6 h-6 mr-3" />
                  CURRENT STREAK
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-5xl font-bold text-brutal-black mb-4">
                    {dashboardData?.currentStreak || 0}
                  </div>
                  <p className="text-lg font-bold text-brutal-black uppercase">DAYS IN A ROW</p>
                  <p className="text-sm font-medium text-brutal-black mt-4 uppercase">
                    KEEP TRACKING YOUR WELLNESS DATA TO MAINTAIN YOUR STREAK!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Rewards */}
            {dashboardData?.recentRewards && dashboardData.recentRewards.length > 0 && (
              <Card variant="accent">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="w-6 h-6 mr-3" />
                    RECENT REWARDS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.recentRewards.slice(0, 3).map((reward) => (
                      <div key={reward.id} className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-brutal-black border-2 border-brutal-black flex items-center justify-center">
                          <Award className="w-5 h-5 text-brutal-yellow" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-brutal-black uppercase">{reward.name}</p>
                          <p className="text-xs font-medium text-brutal-black uppercase">{reward.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Goals Section */}
        {dashboardData?.goals && dashboardData.goals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-6 h-6 mr-3" />
                YOUR GOALS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboardData.goals.map((goal) => (
                  <div key={goal._id} className="brutalist-block bg-brutal-white text-brutal-black p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-brutal-black uppercase">{goal.type}</h4>
                      <span className="text-sm font-medium text-brutal-black uppercase">{goal.period}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-bold mb-2">
                      <span>{goal.current}</span>
                      <span>/ {goal.target}</span>
                    </div>
                    <div className="w-full bg-brutal-grey border-2 border-brutal-black h-3">
                      <div
                        className="bg-mongo-500 h-full transition-all duration-300"
                        style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
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
