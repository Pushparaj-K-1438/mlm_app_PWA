import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { 
  Home, 
  Video, 
  GraduationCap, 
  Trophy, 
  Users, 
  Wallet,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Crown,
  Play
} from 'lucide-react';
import UserOverview from './UserOverview';
import DailyVideoWatch from './DailyVideoWatch';
import TrainingProgram from './TrainingProgram';
import PromotionVideos from './PromotionVideos';
import PinRequests from './PinRequests';
import ReferralTree from './ReferralTree';
import EarningsHistory from './EarningsHistory';
import WithdrawRequests from './WithdrawRequests';
import YoutubeChannels from './YoutubeChannels';

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const { dailyVideos } = useData();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hasWatchedDailyVideo, setHasWatchedDailyVideo] = useState(false);

  // Check if user has watched today's daily video
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayVideo = dailyVideos.find(video => video.showingDate === today);
    const watchedVideos = JSON.parse(localStorage.getItem(`watchedVideos_${user?.id}`) || '[]');
    
    if (todayVideo && watchedVideos.includes(todayVideo.id)) {
      setHasWatchedDailyVideo(true);
    }
  }, [dailyVideos, user?.id]);

  // Redirect to daily video if not watched
  if (!hasWatchedDailyVideo && location.pathname !== '/user/daily-video') {
    return <Navigate to="/user/daily-video" replace />;
  }

  const navigation = [
    { name: 'Dashboard', href: '/user', icon: Home, current: location.pathname === '/user' },
    { name: 'Daily Video', href: '/user/daily-video', icon: Video, current: location.pathname === '/user/daily-video' },
    { name: 'Training', href: '/user/training', icon: GraduationCap, current: location.pathname === '/user/training' },
    { name: 'Promotion Videos', href: '/user/promotion', icon: Trophy, current: location.pathname === '/user/promotion' },
    { name: 'Pin Requests', href: '/user/pin-requests', icon: Crown, current: location.pathname === '/user/pin-requests' },
    { name: 'Referrals', href: '/user/referrals', icon: Users, current: location.pathname === '/user/referrals' },
    { name: 'Earnings', href: '/user/earnings', icon: Wallet, current: location.pathname === '/user/earnings' },
    { name: 'Withdrawals', href: '/user/withdrawals', icon: Wallet, current: location.pathname === '/user/withdrawals' },
    { name: 'YouTube Channels', href: '/user/youtube', icon: Play, current: location.pathname === '/user/youtube' },
  ];

  const getLevelColor = (role) => {
    const colors = {
      promotor: 'from-blue-600 to-blue-700',
      promotor1: 'from-green-600 to-green-700',
      promotor2: 'from-purple-600 to-purple-700',
      promotor3: 'from-yellow-600 to-yellow-700',
      promotor4: 'from-pink-600 to-pink-700'
    };
    return colors[role] || 'from-gray-600 to-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setSidebarOpen(false)} />
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <div className={`w-8 h-8 bg-gradient-to-r ${getLevelColor(user?.role)} rounded-lg flex items-center justify-center`}>
                <Crown className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">{user?.level}</span>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    item.current
                      ? `bg-gradient-to-r ${getLevelColor(user?.role)} text-white`
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-4 h-6 w-6" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <div className={`w-8 h-8 bg-gradient-to-r ${getLevelColor(user?.role)} rounded-lg flex items-center justify-center`}>
                <Crown className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">{user?.level}</span>
            </div>
            <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    item.current
                      ? `bg-gradient-to-r ${getLevelColor(user?.role)} text-white`
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-50">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0 md:hidden">
                  <button
                    type="button"
                    className="h-10 w-10 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <Menu className="h-6 w-6" />
                  </button>
                </div>
                <div className="hidden md:block">
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Welcome back, {user?.username}!
                  </h1>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-gray-500">
                  <Bell className="h-6 w-6" />
                </button> */}
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                    <p className="text-xs text-gray-500">{user?.level}</p>
                  </div>
                  <div className={`w-10 h-10 bg-gradient-to-r ${getLevelColor(user?.role)} rounded-full flex items-center justify-center`}>
                    <span className="text-white font-medium text-sm">
                      {user?.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="py-6">
            <Routes>
              <Route path="/" element={<UserOverview />} />
              <Route path="/daily-video" element={<DailyVideoWatch onVideoWatched={() => setHasWatchedDailyVideo(true)} />} />
              <Route path="/training" element={<TrainingProgram />} />
              <Route path="/promotion" element={<PromotionVideos />} />
              <Route path="/pin-requests" element={<PinRequests />} />
              <Route path="/referrals" element={<ReferralTree />} />
              <Route path="/earnings" element={<EarningsHistory />} />
              <Route path="/withdrawals" element={<WithdrawRequests />} />
              <Route path="/youtube" element={<YoutubeChannels />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}