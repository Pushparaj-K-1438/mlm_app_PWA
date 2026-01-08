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
  IndianRupee,
  ChevronRight,
  Activity
} from 'lucide-react';
import { useGetCall } from '@/hooks';
import { SERVICE } from "@/constants/services";

export default function UserDashboard() {
  const { user } = useAuth();

  const currentTime = new Date();
  const greeting = currentTime.getHours() < 12 ? 'Good Morning' :
    currentTime.getHours() < 18 ? 'Good Afternoon' : 'Good Evening';

  const totalEarnings = user?.earnings?.cash + user?.earnings?.grow + user?.earnings?.scratch;
  const { data: userData, loading: userDataLoading } = useGetCall(SERVICE.USER_DASHBOARD);

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
      0: ['promotor'],
      1: ['promotor1'],
      2: ['promotor2'],
      3: ['promotor3', 'promotor4']
    };
    return upgrades[currentLevel] || [];
  };

  const upgradeOptions = getUpgradeOptions(userData?.data?.current_promoter_level || 0);

  return (
    // Mobile Container: Full width, safe area padding, and native app background
    <div className="w-full pb-20 px-4 space-y-6 bg-gray-50 min-h-screen">

      {/* Greeting Section - Native App Card Style */}
      <div className={`bg-gradient-to-br ${getLevelColor(currentRole)} rounded-3xl p-6 text-white shadow-lg relative overflow-hidden`}>
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold leading-tight">
                {greeting}, {user?.username}! 👋
              </h1>
              <p className="text-sm opacity-90 mt-1 font-light">
                {currentTime.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
              <Crown className="w-5 h-5 text-yellow-300" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/20">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 opacity-80" />
              <span className="text-sm font-medium opacity-90">
                {currentTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <span className="text-xs font-bold uppercase tracking-wide">
                {currentRole === 'trainee' ? 'Trainee' : currentRole.replace('promotor', 'Level')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Native App Cards */}
      <div className="grid grid-cols-2 gap-4">
        {/* Cash Wallet */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 active:scale-[0.98] transition-all duration-200 hover:shadow-md">
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <IndianRupee className="w-5 h-5 text-blue-600" />
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Cash Wallet</p>
              <p className="text-xl font-bold text-gray-900 leading-none">
                {userDataLoading ? '...' : `₹${userData?.data?.cash_wallet || 0}`}
              </p>
            </div>
          </div>
        </div>

        {/* Grow Wallet */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 active:scale-[0.98] transition-all duration-200 hover:shadow-md">
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Grow Wallet</p>
              <p className="text-xl font-bold text-gray-900 leading-none">
                {userDataLoading ? '...' : `₹${userData?.data?.grow_wallet || 0}`}
              </p>
            </div>
          </div>
        </div>

        {/* Scratch Cards */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 active:scale-[0.98] transition-all duration-200 hover:shadow-md">
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Wallet className="w-5 h-5 text-orange-600" />
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Scratch</p>
              <p className="text-xl font-bold text-gray-900 leading-none">
                {userDataLoading ? '...' : `₹${userData?.data?.scratch_wallet || 0}`}
              </p>
            </div>
          </div>
        </div>

        {/* Total Promoters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 active:scale-[0.98] transition-all duration-200 hover:shadow-md">
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Promoters</p>
              <p className="text-xl font-bold text-gray-900 leading-none">
                {userDataLoading ? '...' : (userData?.data?.total_referrals || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {/* Current Promoter Level - Native App Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900 flex items-center">
              <Crown className="w-4 h-4 mr-2 text-yellow-500" />
              Current Level
            </h3>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <div className="p-5">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-md ${getLevelColor(currentRole)}`}>
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">
                  {currentRole === 'trainee' ? 'Trainee' :
                    currentRole === 'promotor' ? 'Promoter' :
                      currentRole === 'promotor1' ? 'Promoter Level 1' :
                        currentRole === 'promotor2' ? 'Promoter Level 2' :
                          currentRole === 'promotor3' ? 'Promoter Level 3' :
                            currentRole === 'promotor4' ? 'Promoter Level 4' : 'Unknown'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {userData?.data?.current_promoter_level === null ? 'Start your journey' :
                    userData?.data?.current_promoter_level === 0 ? 'Basic promoter level' :
                      userData?.data?.current_promoter_level === 1 ? 'Promoter level' :
                        userData?.data?.current_promoter_level === 2 ? 'Enhanced earning opportunities' :
                          userData?.data?.current_promoter_level === 3 ? 'Advanced benefits' :
                            userData?.data?.current_promoter_level === 4 ? 'Max level achieved' : ''}
                </p>
              </div>
            </div>

            {upgradeOptions.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Available Upgrades:</p>
                <div className="flex flex-wrap gap-2">
                  {upgradeOptions.map((option, index) => (
                    <button
                      key={index}
                      className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium active:scale-95 transition-transform"
                    >
                      {option === 'promotor' ? 'Promoter' :
                        option === 'promotor1' ? 'Level 1' :
                          option === 'promotor2' ? 'Level 2' :
                            option === 'promotor3' ? 'Level 3' :
                              option === 'promotor4' ? 'Level 4' : option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Today's Activities - Native App Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900 flex items-center">
              <Activity className="w-4 h-4 mr-2 text-blue-500" />
              Today's Activities
            </h3>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <div className="p-2">
            <div className={`flex items-center justify-between p-4 rounded-xl mx-2 my-2 ${userData?.data?.daily_video_watched === 1 ? 'bg-green-50' : 'bg-gray-50'
              } active:scale-[0.98] transition-all duration-200`}>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${userData?.data?.daily_video_watched === 1 ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                <div>
                  <span className="text-sm font-medium text-gray-700 block">Daily Video</span>
                  <span className="text-xs text-gray-500">Watch today's promotional video</span>
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${userData?.data?.daily_video_watched === 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                {userDataLoading ? '...' : (userData?.data?.daily_video_watched === 1 ? 'Done' : 'Pending')}
              </span>
            </div>

            <div className={`flex items-center justify-between p-4 rounded-xl mx-2 my-2 ${userData?.data?.training_status === 2 ? 'bg-green-50' : 'bg-blue-50'
              } active:scale-[0.98] transition-all duration-200`}>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-3 ${userData?.data?.training_status === 2 ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                <div>
                  <span className="text-sm font-medium text-gray-700 block">Training</span>
                  <span className="text-xs text-gray-500">Complete your training modules</span>
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${userData?.data?.training_status === 2 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
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
  );
}