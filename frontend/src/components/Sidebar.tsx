import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3,
  BookOpen,
  User,
  Home,
  Settings,
  HelpCircle,
  Menu,
  X,
  ChevronRight,
  Activity,
  Target,
  Award,
  Calendar,
  TrendingUp,
  Heart,
  Moon,
  Droplets,
  Brain,
  Smartphone
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>(['main']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const isActive = (path: string) => location.pathname === path;

  const mainRoutes = [
    {
      path: '/',
      label: 'Home',
      icon: Home,
      description: 'Welcome page'
    },
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      description: 'Your wellness overview'
    },
    {
      path: '/resources',
      label: 'Resources',
      icon: BookOpen,
      description: 'Wellness articles & guides'
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: User,
      description: 'Account settings'
    }
  ];

  const wellnessSections = [
    {
      icon: Activity,
      label: 'Activity Tracking',
      items: [
        { label: 'Steps & Movement', path: '/dashboard', icon: Activity },
        { label: 'Exercise Log', path: '/dashboard', icon: Target },
        { label: 'Heart Rate', path: '/dashboard', icon: Heart }
      ]
    },
    {
      icon: Moon,
      label: 'Sleep & Rest',
      items: [
        { label: 'Sleep Tracking', path: '/dashboard', icon: Moon },
        { label: 'Sleep Analysis', path: '/dashboard', icon: TrendingUp }
      ]
    },
    {
      icon: Brain,
      label: 'Mental Wellness',
      items: [
        { label: 'Mood Tracking', path: '/dashboard', icon: Brain },
        { label: 'Stress Levels', path: '/dashboard', icon: Activity },
        { label: 'Study Hours', path: '/dashboard', icon: BookOpen }
      ]
    },
    {
      icon: Droplets,
      label: 'Nutrition & Health',
      items: [
        { label: 'Water Intake', path: '/dashboard', icon: Droplets },
        { label: 'Diet Tracking', path: '/dashboard', icon: Activity },
        { label: 'Health Metrics', path: '/dashboard', icon: Heart }
      ]
    }
  ];

  const toolsSections = [
    {
      icon: Smartphone,
      label: 'Integrations',
      items: [
        { label: 'Smartwatch Sync', path: '/dashboard', icon: Smartphone },
        { label: 'Apple Health', path: '/dashboard', icon: Activity },
        { label: 'Google Fit', path: '/dashboard', icon: Activity }
      ]
    },
    {
      icon: Award,
      label: 'Achievements',
      items: [
        { label: 'Badges & Rewards', path: '/dashboard', icon: Award },
        { label: 'Streaks', path: '/dashboard', icon: Calendar },
        { label: 'Goals Progress', path: '/dashboard', icon: Target }
      ]
    }
  ];

  const settingsRoutes = [
    {
      path: '/settings',
      label: 'Settings',
      icon: Settings,
      description: 'App preferences'
    },
    {
      path: '/help',
      label: 'Help & Support',
      icon: HelpCircle,
      description: 'Get assistance'
    }
  ];

  const renderSection = (section: any, sectionKey: string) => {
    const isExpanded = expandedSections.includes(sectionKey);
    const SectionIcon = section.icon;

    return (
      <div key={sectionKey} className="mb-2">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <div className="flex items-center space-x-3">
            <SectionIcon className="w-4 h-4" />
            <span>{section.label}</span>
          </div>
          <ChevronRight 
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
          />
        </button>
        
        {isExpanded && (
          <div className="ml-7 mt-1 space-y-1">
            {section.items.map((item: any, index: number) => {
              const ItemIcon = item.icon;
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ItemIcon className="w-3 h-3" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
        w-80
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">ManasFit</h2>
              <p className="text-xs text-gray-500">Wellness Dashboard</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Main Routes */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Main Navigation
            </h3>
            <div className="space-y-1">
              {mainRoutes.map((route) => {
                const Icon = route.icon;
                return (
                  <Link
                    key={route.path}
                    to={route.path}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors group ${
                      isActive(route.path)
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="flex-1">
                      <div className="font-medium">{route.label}</div>
                      <div className="text-xs text-gray-500">{route.description}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Wellness Tracking */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Wellness Tracking
            </h3>
            <div className="space-y-2">
              {wellnessSections.map((section, index) => 
                renderSection(section, `wellness-${index}`)
              )}
            </div>
          </div>

          {/* Tools & Features */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Tools & Features
            </h3>
            <div className="space-y-2">
              {toolsSections.map((section, index) => 
                renderSection(section, `tools-${index}`)
              )}
            </div>
          </div>

          {/* Settings */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Settings
            </h3>
            <div className="space-y-1">
              {settingsRoutes.map((route) => {
                const Icon = route.icon;
                return (
                  <Link
                    key={route.path}
                    to={route.path}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors group ${
                      isActive(route.path)
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="flex-1">
                      <div className="font-medium">{route.label}</div>
                      <div className="text-xs text-gray-500">{route.description}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">
              Version 1.0.0
            </p>
            <p className="text-xs text-gray-400">
              © 2024 ManasFit. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
