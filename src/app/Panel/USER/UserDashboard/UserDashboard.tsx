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
  IndianRupee
} from 'lucide-react';
import logo from '@/assets/logo.png';
import { useGetCall } from '@/hooks';
import { SERVICE } from "@/constants/services";

export default function UserDashboard() {
  const { user } = useAuth();

  const currentTime = new Date();
  const greeting = currentTime.getHours() < 12 ? 'Good Morning' : 
                  currentTime.getHours() < 18 ? 'Good Afternoon' : 'Good Evening';

  const totalEarnings = user?.earnings?.cash + user?.earnings?.grow + user?.earnings?.scratch;
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

  const getUpgradeOptions = (currentLevel) => {
    const upgrades = {
      0: ['promotor'], // trainee -> promotor
      1: ['promotor1'], // promotor -> promotor1
      2: ['promotor2'], // promotor1 -> promotor2
      3: ['promotor3', 'promotor4'] // promotor2 -> promotor3 or promotor4
    };
    return upgrades[currentLevel] || [];
  };

  const upgradeOptions = getUpgradeOptions(userData?.data?.current_promoter_level || 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Greeting Section */}
      <div className="mb-8">
        <div className={`bg-gradient-to-r ${getLevelColor(currentRole)} rounded-2xl p-8 text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {greeting}, {user?.username}! 👋
              </h1>
              <p className="text-lg opacity-90">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="text-right">
              <Crown className="w-6 h-6 mr-2" />
              <div className="flex items-center mt-4">
                <Clock className="w-5 h-5 mr-2" />
                <span className="text-lg">
                  {currentTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
              {/* <div className="flex items-center justify-end mb-2">
                <Crown className="w-6 h-6 mr-2" />
                <span className="text-2xl font-bold">{user?.level}</span>
              </div>
              <div className="text-sm opacity-75">
                Training Day {user?.trainingDay}/7
              </div>
              <div className="w-32 bg-white/20 rounded-full h-2 mt-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${(user?.trainingDay / 7) * 100}%` }}
                ></div>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Cash Wallet</p>
              <p className="text-2xl font-bold text-gray-900">₹{userDataLoading ? '...' : (userData?.data?.cash_wallet || 0)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <IndianRupee className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Grow Wallet</p>
              <p className="text-2xl font-bold text-gray-900">₹{userDataLoading ? '...' : (userData?.data?.grow_wallet || 0)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Scratch Cards</p>
              <p className="text-2xl font-bold text-gray-900">₹{userDataLoading ? '...' : (userData?.data?.scratch_wallet || 0)}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Gift className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Promoters</p>
              <p className="text-2xl font-bold text-gray-900">{userDataLoading ? '...' : (userData?.data?.total_referrals || 0)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Promoter Level */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Crown className="w-5 h-5 mr-2" />
              Current Promoter Level
            </h3>
          </div>
          <div className="p-6">
            <div className="text-center">
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${getLevelColor(currentRole)}`}>
                <Crown className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {currentRole === 'trainee' ? 'Trainee' :
                 currentRole === 'promotor' ? 'Promoter' :
                 currentRole === 'promotor1' ? 'Promoter Level 1' :
                 currentRole === 'promotor2' ? 'Promoter Level 2' :
                 currentRole === 'promotor3' ? 'Promoter Level 3' :
                 currentRole === 'promotor4' ? 'Promoter Level 4' : 'Unknown Level'}
              </h3>
              <p className="text-gray-500 mb-4">
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

        {/* Today's Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
               Activities
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className={`flex items-center justify-between p-3 rounded-lg ${
                userData?.data?.daily_video_watched === 1 ? 'bg-green-50' : 'bg-gray-50'
              }`}>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    userData?.data?.daily_video_watched === 1 ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900">Daily Video Watched</span>
                </div>
                <span className={`text-xs font-medium ${
                  userData?.data?.daily_video_watched === 1 ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {userDataLoading ? '...' : (userData?.data?.daily_video_watched === 1 ? 'Completed' : 'Pending')}
                </span>
              </div>
              
              <div className={`flex items-center justify-between p-3 rounded-lg ${
                userData?.data?.training_status === 2 ? 'bg-green-50' : 'bg-blue-50'
              }`}>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    userData?.data?.training_status === 2 ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-900">Training Status</span>
                </div>
                <span className={`text-xs font-medium ${
                  userData?.data?.training_status === 2 ? 'text-green-600' : 'text-blue-600'
                }`}>
                  {userDataLoading ? '...' : (
                    userData?.data?.training_status === 0 ? 'Pending' :
                    userData?.data?.training_status === 1 ? 'In Progress' :
                    userData?.data?.training_status === 2 ? 'Completed' : 'Unknown'
                  )}
                </span>
              </div>
              
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}