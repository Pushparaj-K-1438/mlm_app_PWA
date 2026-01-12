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
  Gift
} from 'lucide-react';
import logo from '@/assets/logo.png';

export default function UserOverview() {
  const { user } = useAuth();

  const currentTime = new Date();
  const greeting = currentTime.getHours() < 12 ? 'Good Morning' : 
                  currentTime.getHours() < 18 ? 'Good Afternoon' : 'Good Evening';

  const totalEarnings = user?.earnings.cash + user?.earnings.grow + user?.earnings.scratch;

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

  const getUpgradeOptions = (currentRole) => {
    const upgrades = {
      promotor: ['promotor1'],
      promotor1: ['promotor2'],
      promotor2: ['promotor3', 'promotor4']
    };
    return upgrades[currentRole] || [];
  };

  const upgradeOptions = getUpgradeOptions(user?.role);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Greeting Section */}
      <div className="mb-8">
        <div className={`bg-gradient-to-r ${getLevelColor(user?.role)} rounded-2xl p-8 text-white`}>
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
              <div className="flex items-center mt-4">
                <Clock className="w-5 h-5 mr-2" />
                <span className="text-lg">
                  {currentTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end mb-2">
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalEarnings}</p>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12% from last month
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Cash Wallet</p>
              <p className="text-2xl font-bold text-gray-900">₹{user?.earnings.cash}</p>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <DollarSign className="w-3 h-3 mr-1" />
                Available for withdrawal
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Grow Wallet</p>
              <p className="text-2xl font-bold text-gray-900">₹{user?.earnings.grow}</p>
              <p className="text-xs text-purple-600 flex items-center mt-1">
                <TrendingUp className="w-3 h-3 mr-1" />
                Investment earnings
              </p>
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
              <p className="text-2xl font-bold text-gray-900">₹{user?.earnings.scratch}</p>
              <p className="text-xs text-orange-600 flex items-center mt-1">
                <Gift className="w-3 h-3 mr-1" />
                Bonus rewards
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Gift className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Level Upgrade Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Crown className="w-5 h-5 mr-2" />
              Level Upgrade Options
            </h3>
          </div>
          <div className="p-6">
            {upgradeOptions.length > 0 ? (
              <div className="space-y-4">
                {upgradeOptions.map((option) => {
                  const levelNames = {
                    promotor1: 'Promotor Level 1',
                    promotor2: 'Promotor Level 2',
                    promotor3: 'Promotor Level 3',
                    promotor4: 'Promotor Level 4'
                  };
                  
                  return (
                    <div key={option} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                      <div className="flex items-center">
                        <img src={logo} alt="Logo" className="w-12 h-12" />
                        {/* <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-yellow-600 rounded-lg flex items-center justify-center mr-3">
                          <ArrowUp className="w-5 h-5 text-white" />
                        </div> */}
                        <div>
                          <p className="font-medium text-gray-900">{levelNames[option]}</p>
                          <p className="text-sm text-gray-500">Unlock new earning opportunities</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Request Pin
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Crown className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Maximum Level Reached</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You've reached the highest available level!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Today's Activities */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Today's Activities
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-900">Daily Video Watched</span>
                </div>
                <span className="text-xs text-green-600 font-medium">Completed</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-900">Training Day {user?.trainingDay}</span>
                </div>
                <span className="text-xs text-blue-600 font-medium">
                  {user?.trainingDay === 7 ? 'Completed' : 'In Progress'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-900">Promotion Videos</span>
                </div>
                <span className="text-xs text-yellow-600 font-medium">Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <Award className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-900">View Earnings</span>
            </button>
            <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
              <Users className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-900">Invite Friends</span>
            </button>
            <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
              <Wallet className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-900">Withdraw</span>
            </button>
            <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors">
              <Crown className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-900">Upgrade Level</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}