//@ts-nocheck
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Wallet, 
  TrendingUp, 
  Users, 
  Award, 
  Calendar,
  Clock,
  Crown,
  ArrowUp,
  DollarSign,
  Gift,
  IndianRupee,
  Play,
  CheckCircle,
  Circle,
  Star,
  Zap
} from 'lucide-react';
import logo from '@/assets/logo.png';
import { useGetCall } from '@/hooks';
import { SERVICE } from "@/constants/services";

export default function UserDashboard() {
  const { user } = useAuth();

  const currentTime = new Date();
  const greeting = currentTime.getHours() < 12 ? 'Good Morning' : 
                  currentTime.getHours() < 18 ? 'Good Afternoon' : 'Good Evening';

  const {data: userData, loading: userDataLoading} = useGetCall(SERVICE.USER_DASHBOARD);

  // Map API promoter level to role names
  const getCurrentRole = (level) => {
    const roleMap = {
      null: 'trainee',
      0: 'promotor',
      1: 'promotor1',
      2: 'promotor2',
      3: 'promotor3',
      4: 'promotor4'
    };
    return roleMap[level] || 'trainee';
  };

  const currentRole = getCurrentRole(userData?.data?.current_promoter_level);

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

  const getLevelIcon = (role) => {
    const icons = {
      promotor: <Crown className="w-6 h-6" />,
      promotor1: <Star className="w-6 h-6" />,
      promotor2: <Award className="w-6 h-6" />,
      promotor3: <Zap className="w-6 h-6" />,
      promotor4: <Crown className="w-6 h-6" />
    };
    return icons[role] || <Crown className="w-6 h-6" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 safe-area-inset-bottom pb-20">
      {/* Greeting Section */}
      <div className={`bg-gradient-to-br ${getLevelColor(currentRole)} px-6 pt-12 pb-8 text-white`}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {greeting}, {user?.username}! 👋
            </h1>
            <p className="text-lg opacity-90">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
            {getLevelIcon(currentRole)}
          </div>
        </div>
        
        <div className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            <span className="text-lg">
              {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-75">Current Level</p>
            <p className="text-xl font-bold">
              {currentRole === 'trainee' ? 'Trainee' :
               currentRole === 'promotor' ? 'Promoter' :
               currentRole === 'promotor1' ? 'Level 1' :
               currentRole === 'promotor2' ? 'Level 2' :
               currentRole === 'promotor3' ? 'Level 3' :
               currentRole === 'promotor4' ? 'Level 4' : 'Unknown'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-6 -mt-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-500">Cash Wallet</p>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <IndianRupee className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">₹{userDataLoading ? '...' : (userData?.data?.cash_wallet || 0)}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-500">Grow Wallet</p>
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">₹{userDataLoading ? '...' : (userData?.data?.grow_wallet || 0)}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-500">Scratch Cards</p>
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Gift className="w-4 h-4 text-orange-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">₹{userDataLoading ? '...' : (userData?.data?.scratch_wallet || 0)}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-500">Promoters</p>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{userDataLoading ? '...' : (userData?.data?.total_referrals || 0)}</p>
          </div>
        </div>

        {/* Current Promoter Level Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
          <div className={`bg-gradient-to-r ${getLevelColor(currentRole)} p-4`}>
            <h3 className="text-lg font-medium text-white flex items-center">
              <Crown className="w-5 h-5 mr-2" />
              Current Promoter Level
            </h3>
          </div>
          <div className="p-6">
            <div className="flex items-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mr-4 ${getLevelColor(currentRole)}`}>
                {getLevelIcon(currentRole)}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {currentRole === 'trainee' ? 'Trainee' :
                   currentRole === 'promotor' ? 'Promoter' :
                   currentRole === 'promotor1' ? 'Promoter Level 1' :
                   currentRole === 'promotor2' ? 'Promoter Level 2' :
                   currentRole === 'promotor3' ? 'Promoter Level 3' :
                   currentRole === 'promotor4' ? 'Promoter Level 4' : 'Unknown Level'}
                </h3>
                <p className="text-sm text-gray-500">
                  {userData?.data?.current_promoter_level === null ? 'Start your journey as a trainee' :
                  userData?.data?.current_promoter_level === 0 ? 'Basic promoter level' :
                   userData?.data?.current_promoter_level === 1 ? 'Promoter level' :
                   userData?.data?.current_promoter_level === 2 ? 'Enhanced earning opportunities' :
                   userData?.data?.current_promoter_level === 3 ? 'Advanced promoter benefits' :
                   userData?.data?.current_promoter_level === 4 ? 'Maximum level achieved' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Activities */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Today's Activities
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className={`flex items-center justify-between p-4 rounded-xl border ${
                userData?.data?.daily_video_watched === 1 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                    userData?.data?.daily_video_watched === 1 ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {userData?.data?.daily_video_watched === 1 ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Daily Video Watched</p>
                    <p className="text-xs text-gray-500">Watch today's video to earn rewards</p>
                  </div>
                </div>
                {userData?.data?.daily_video_watched !== 1 && (
                  <button className="p-2 bg-blue-600 text-white rounded-full">
                    <Play className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className={`flex items-center justify-between p-4 rounded-xl border ${
                userData?.data?.training_status === 2 ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                    userData?.data?.training_status === 2 ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    {userData?.data?.training_status === 2 ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Training Status</p>
                    <p className="text-xs text-gray-500">
                      {userDataLoading ? 'Loading...' : (
                        userData?.data?.training_status === 0 ? 'Pending - Start your training' :
                        userData?.data?.training_status === 1 ? 'In Progress - Continue learning' :
                        userData?.data?.training_status === 2 ? 'Completed - Well done!' : 'Unknown'
                      )}
                    </p>
                  </div>
                </div>
                {userData?.data?.training_status !== 2 && (
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                    {userData?.data?.training_status === 0 ? 'Start' : 'Continue'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col items-center justify-center h-24">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
              <Play className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">Watch Video</span>
          </button>
          
          <button className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col items-center justify-center h-24">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
              <Gift className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">Scratch Card</span>
          </button>
        </div>
      </div>
    </div>
  );
}