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
  const {Post,Put, error: RequestError} = useActionCall(SERVICE.SCRATCHED_STATUS_UPDATE);
  const { toast } = useToast();
  const Modal = searchParams.get("Modal") || undefined;

  const [scratchCards, setScratchCards] = useState<ScratchCard[]>([]);
  const [loadingCard, setLoadingCard] = useState<number | null>(null);
  const [revealedCards, setRevealedCards] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (scratchCardsData?.data) {
      setScratchCards(scratchCardsData.data);
    }
  }, [scratchCardsData]);

  const handleScratchCard = async (scratchCardId: number, cardId: number) => {
    setLoadingCard(cardId);

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
        
        // Add to revealed cards set
        setRevealedCards(prev => new Set(prev).add(cardId));

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
    }
  };

  const ScratchCardItem = ({ card }: { card: ScratchCard }) => {
    const isScratched = card.is_scratched === 1;
    const isRevealed = revealedCards.has(card.id);

    return (
      <div
        onClick={() => !isScratched && !isRevealed && handleScratchCard(card.scratch_card_id, card.id)}
        className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl cursor-pointer ${
          isScratched
            ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50'
            : isRevealed
            ? 'border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50'
            : 'border-gray-200 hover:border-blue-300 active:scale-95'
        }`}
      >
        {/* Card Header */}
        <div className={`p-4 rounded-t-2xl ${isScratched ? 'bg-green-100' : isRevealed ? 'bg-blue-100' : 'bg-gray-100'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isScratched
                  ? 'bg-green-200'
                  : isRevealed
                  ? 'bg-blue-200'
                  : 'bg-gray-200'
              }`}>
                {isScratched ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : isRevealed ? (
                  <Gift className="w-5 h-5 text-blue-600" />
                ) : (
                  <Lock className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <span className={`font-semibold ${
                isScratched
                  ? 'text-green-800'
                  : isRevealed
                  ? 'text-blue-800'
                  : 'text-gray-800'
              }`}>
                Scratch Card #{card.scratch_card_id}
              </span>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 text-center">
          {isScratched ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-green-600">
                ₹{card.amount || 0}
              </div>
              <div className="text-sm text-green-600 font-medium">
                Amount Revealed!
              </div>
            </div>
          ) : isRevealed ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                <Gift className="w-8 h-8 text-blue-500" />
              </div>
              <div className="text-lg font-semibold text-blue-600">
                Prize Revealed
              </div>
              <div className="text-sm text-blue-500">
                Check your wallet for the prize!
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-full flex items-center justify-center">
                <Coins className="w-10 h-10 text-yellow-600" />
              </div>
              <div className="text-gray-600 font-medium">
                Tap to Scratch
              </div>
              <div className="text-xs text-gray-500">
                Reveal your prize!
              </div>
            </div>
          )}
        </div>

        {/* Loading Overlay */}
        {loadingCard === card.id && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-2xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    );
  };

  if (scratchCardsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 safe-area-inset-bottom pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Coins className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-gray-600">Loading scratch cards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 safe-area-inset-bottom pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 safe-area-inset-top">
        <h1 className="text-xl font-bold text-gray-900">Scratch Cards</h1>
        <p className="text-sm text-gray-600 mt-1">Scratch cards to reveal your prizes!</p>
      </div>

      {/* Scratch Cards Grid */}
      <div className="px-6 mt-6">
        {scratchCards.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {scratchCards.map((card) => (
              <ScratchCardItem key={card.id} card={card} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Coins className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Scratch Cards Available
            </h3>
            <p className="text-gray-600">
              Check back later for new scratch cards!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ScratchCard() {
  return (
    <DailyVideoWarning>
      <TrainingVideoWarning>
        <ScratchCardPage />
      </TrainingVideoWarning>
    </DailyVideoWarning>
  );
}