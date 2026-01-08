import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, ExternalLink, Youtube, Users, Video, Play, Coins, Lock, CheckCircle, Sparkles, Gift } from "lucide-react";
import { useQueryParams, useGetCall, useActionCall } from "@/hooks";
import { MODAL_OPEN } from "@/constants/others";
import { SERVICE } from "@/constants/services";
import DailyVideoWarning from "@/components/DailyVideoWarning";
import { useToast } from "@/hooks/use-toast";
import TrainingVideoWarning from "@/components/TrainingVideoWarning";

interface ScratchCard {
  id: number;
  scratch_card_id: number;
  is_scratched: number;
  amount?: number;
  created_at?: string;
  updated_at?: string;
}

const ScratchCardPage = () => {
  const { extractFilterOnQuery, updateSearchParam, searchParams } = useQueryParams();
  const { data: scratchCardsData, loading: scratchCardsLoading, setQuery } = useGetCall(SERVICE.SCRATCH_CARDS);
  const { Post, Put, error: RequestError, } = useActionCall(SERVICE.SCRATCHED_STATUS_UPDATE);
  const { toast } = useToast();
  const Modal = searchParams.get("Modal") || undefined;

  const [scratchCards, setScratchCards] = useState<ScratchCard[]>([]);
  const [loadingCard, setLoadingCard] = useState<number | null>(null);
  const [scratchingCard, setScratchingCard] = useState<number | null>(null);

  useEffect(() => {
    if (scratchCardsData?.data) {
      setScratchCards(scratchCardsData.data);
    }
  }, [scratchCardsData]);

  const handleScratchCard = async (scratchCardId: number, cardId: number) => {
    setLoadingCard(cardId);
    setScratchingCard(cardId);

    try {
      const response = await Post({
        scratch_card_id: cardId
      });

      if (response?.success) {
        setScratchCards(prev =>
          prev.map(card =>
            card.id === cardId
              ? { ...card, is_scratched: 1, amount: response.data?.amount }
              : card
          )
        );

        toast({
          title: "Scratch Card Revealed!",
          description: `You won ₹${response.data?.amount || 0}!`,
        });
      }
    } catch (error) {
      console.error('Error scratching card:', error);
      toast({
        title: "Error",
        description: "Failed to scratch the card. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingCard(null);
      setScratchingCard(null);
    }
  };

  const ScratchCardItem = ({ card }: { card: ScratchCard }) => {
    const isScratched = card.is_scratched === 1;

    return (
      <div
        className={`relative bg-white rounded-3xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl cursor-pointer group overflow-hidden ${isScratched
            ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50'
            : 'border-gray-200 hover:border-blue-300'
          }`}
        onClick={() => !isScratched && handleScratchCard(card.scratch_card_id, card.id)}
      >
        {/* Card Header */}
        <div className={`p-4 ${isScratched ? 'bg-green-100' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isScratched ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Gift className="w-5 h-5 text-white" />
              )}
              <span className={`font-semibold ${isScratched ? 'text-green-800' : 'text-white'}`}>
                Scratch Card #{card.scratch_card_id}
              </span>
            </div>
            {isScratched ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <Lock className="w-5 h-5 text-white/70 group-hover:text-white" />
            )}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 text-center">
          {isScratched ? (
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-600">
                ₹{card.amount || 0}
              </div>
              <div className="text-sm text-green-600 font-medium">
                Amount Revealed!
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className={`w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center ${scratchingCard === card.id ? 'animate-pulse' : ''}`}>
                <Coins className="w-8 h-8 text-white" />
              </div>
              <div className="text-gray-600 font-medium">
                {scratchingCard === card.id ? 'Scratching...' : 'Click to Scratch'}
              </div>
              <div className="text-xs text-gray-500">
                Reveal your prize!
              </div>
            </div>
          )}
        </div>

        {/* Loading Overlay */}
        {loadingCard === card.id && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-3xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Sparkle Effect for Unscratched Cards */}
        {!isScratched && (
          <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden">
            <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1" />
          </div>
        )}
      </div>
    );
  };

  if (scratchCardsLoading) {
    return (
      <div className="w-full pb-24 px-4 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading scratch cards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-24 px-4 bg-gray-50 min-h-screen">
      {/* Header Section - Native App Style */}
      <div className="py-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Scratch Cards
        </h1>
        <p className="text-gray-600 mt-1">
          Scratch cards to reveal your prizes!
        </p>
      </div>

      {/* Stats Card - Mobile Native Style */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-3">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Available Cards</p>
              <p className="text-xl font-bold text-gray-900">
                {scratchCards.filter(card => card.is_scratched === 0).length}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Scratched Cards</p>
              <p className="text-xl font-bold text-gray-900">
                {scratchCards.filter(card => card.is_scratched === 1).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions Card - Mobile Native Style */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-5 mb-6 border border-purple-100">
        <h3 className="text-base font-semibold text-gray-900 mb-3">How to Play</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-start">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
            <p>Tap on any unscratched card to reveal your prize</p>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
            <p>Each card can only be scratched once</p>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
            <p>Prizes will be added to your scratch wallet immediately</p>
          </div>
        </div>
      </div>

      {/* Scratch Cards Grid - Mobile Native Style */}
      {scratchCards.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {scratchCards.map((card) => (
            <ScratchCardItem key={card.id} card={card} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-3xl border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Coins className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Scratch Cards Available
          </h3>
          <p className="text-sm text-gray-500 max-w-xs mx-auto">
            Check back later for new scratch cards!
          </p>
        </div>
      )}
    </div>
  );
};

export default function ScratchCard() {
  return (
    <DailyVideoWarning>
      <TrainingVideoWarning>
        <ScratchCardPage />
      </TrainingVideoWarning>
    </DailyVideoWarning>
  );
}