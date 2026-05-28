import React from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useGetCall } from "@/hooks";
import { SERVICE } from "@/constants/services";
import Loader from "@/components/ui/Loader";

type FaqItem = {
  id: number;
  question: string;
  answer: string;
};

// One accordion row. Local open/closed state — first item starts open so the
// page never looks empty, the rest start collapsed.
const FaqRow: React.FC<{ item: FaqItem; defaultOpen?: boolean }> = ({
  item,
  defaultOpen = false,
}) => {
  const [open, setOpen] = React.useState<boolean>(defaultOpen);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-start justify-between gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-semibold text-gray-900 whitespace-pre-line">
          {item.question}
        </span>
        <span className="mt-0.5 flex-shrink-0 w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
          {open ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 -mt-1 border-t border-gray-100 pt-3">
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {item.answer}
          </p>
        </div>
      )}
    </div>
  );
};

export default function SupportHelp() {
  const { data, loading } = useGetCall(SERVICE.SUPPORT_HELPS_LIST);
  const items: FaqItem[] = data?.data ?? [];

  return (
    <div className="min-h-screen bg-gray-50 safe-area-inset-bottom pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 safe-area-inset-top">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Support &amp; Help</h1>
            <p className="text-sm text-gray-600">
              Tap any question to see the answer.
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 mt-6 space-y-3">
        {loading ? (
          <Loader />
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center text-gray-500">
            No help topics published yet. Please check back later.
          </div>
        ) : (
          items.map((item, idx) => (
            <FaqRow key={item.id} item={item} defaultOpen={idx === 0} />
          ))
        )}
      </div>
    </div>
  );
}
