import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, ExternalLink, Youtube, Users, Video, Play, Coins, Lock, CheckCircle } from "lucide-react";
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
  const {Post,Put,error: RequestError,}= useActionCall(SERVICE.SCRATCHED_STATUS_UPDATE);
  const { toast } = useToast();
  const Modal = searchParams.get("Modal") || undefined;

  const [scratchCards, setScratchCards] = useState<ScratchCard[]>([]);
  const [loadingCard, setLoadingCard] = useState<number | null>(null);

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

    return (
      <div
        className={`relative bg-white rounded-xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl cursor-pointer group ${
          isScratched
            ? 'border-green-300 bg-gradient-to-br from-green-50 to-emerald-50'
            : 'border-gray-200 hover:border-blue-300'
        }`}
        onClick={() => !isScratched && handleScratchCard(card.scratch_card_id, card.id)}
      >
        {/* Card Header */}
        <div className={`p-4 rounded-t-xl ${isScratched ? 'bg-green-100' : 'bg-gray-100'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Coins className={`w-5 h-5 ${isScratched ? 'text-green-600' : 'text-gray-600'}`} />
              <span className={`font-semibold ${isScratched ? 'text-green-800' : 'text-gray-800'}`}>
                Scratch Card #{card.scratch_card_id}
              </span>
            </div>
            {isScratched ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <Lock className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
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
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                <Coins className="w-8 h-8 text-gray-500" />
              </div>
              <div className="text-gray-600 font-medium">
                Click to Scratch
              </div>
              <div className="text-xs text-gray-500">
                Reveal your prize!
              </div>
            </div>
          )}
        </div>

        {/* Loading Overlay */}
        {loadingCard === card.id && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    );
  };

  if (scratchCardsLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Scratch Cards
            </h1>
            <p className="mt-2 text-gray-600">
              Scratch cards to reveal your prizes!
            </p>
          </div>
        </div>
      </div>

      {/* Scratch Cards Grid */}
      {scratchCards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {scratchCards.map((card) => (
            <ScratchCardItem key={card.id} card={card} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Coins className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No Scratch Cards Available
          </h3>
          <p className="mt-2 text-gray-500">
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