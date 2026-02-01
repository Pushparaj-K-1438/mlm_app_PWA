//@ts-nocheck
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Cake, Sparkles, PartyPopper, Gift } from "lucide-react";
import { useGetCall } from "@/hooks";
import { SERVICE } from "@/constants/services";

const BirthdayModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const { data: profileData, loading } = useGetCall(SERVICE.GET_PROFILE);

  useEffect(() => {
    if (loading || !profileData?.data) return;

    const userDob = profileData?.data?.dob;
    if (!userDob) return;

    // Get today's date
    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth(); // 0-11

    // Parse DOB (format: YYYY-MM-DD)
    const dobDate = new Date(userDob);
    const dobDay = dobDate.getDate();
    const dobMonth = dobDate.getMonth();

    // Check if today is the birthday
    const isBirthday = todayDate === dobDay && todayMonth === dobMonth;

    if (!isBirthday) return;

    // Check if birthday wish was already shown today
    const todayKey = `birthday-wish-${today.getFullYear()}-${todayMonth + 1}-${todayDate}`;
    const alreadyShown = localStorage.getItem(todayKey);

    if (!alreadyShown) {
      // Show birthday modal
      setUserName(profileData?.data?.first_name || "");
      setIsOpen(true);

      // Mark as shown
      localStorage.setItem(todayKey, "true");
    }
  }, [profileData, loading]);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md mx-auto">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 rounded-lg opacity-50" />
        <div className="relative">
          <DialogHeader className="text-center">
            {/* Birthday Icons */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="flex gap-2">
                  <PartyPopper className="w-8 h-8 text-pink-500 animate-bounce" style={{ animationDelay: '0s' }} />
                  <Cake className="w-12 h-12 text-purple-500 animate-pulse" />
                  <PartyPopper className="w-8 h-8 text-pink-500 animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-500 animate-spin" style={{ animationDuration: '3s' }} />
                <Gift className="absolute -bottom-2 -left-2 w-6 h-6 text-red-500 animate-bounce" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>

            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Happy Birthday!
            </DialogTitle>
            <DialogDescription className="text-base text-gray-700 pt-2">
              <span className="font-semibold text-purple-600">{userName}</span>
            </DialogDescription>
          </DialogHeader>

          {/* Birthday Message */}
          <div className="text-center py-6 space-y-4">
            <p className="text-lg text-gray-700">
              உங்கள் கடின உழைப்பும் அர்ப்பணிப்பும் இந்த ஆண்டில் மேன் மேலும் பல விருதுகளையும், லாபத்தையும் கொண்டு வந்து இந்த ஆண்டு உங்களுக்கு வெற்றியின் ஆண்டாக அமையட்டும்.
              
            </p>
            <p className="text-sm text-gray-600">
              இனிய பிறந்தநாள் நல்வாழ்த்துக்கள்.
            </p>
            <p className="text-sm text-gray-600">
              ~ Starupworld Marketing.
            </p>

            {/* Decorative Elements */}
            <div className="flex justify-center gap-2 text-2xl pt-2">
              <span className="animate-bounce" style={{ animationDelay: '0s' }}>🎂</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🎁</span>
              <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🎈</span>
              <span className="animate-bounce" style={{ animationDelay: '0.6s' }}>🎉</span>
              <span className="animate-bounce" style={{ animationDelay: '0.8s' }}>🎊</span>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-center">
            <button
              onClick={handleClose}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Thank You! 🥳
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BirthdayModal;
