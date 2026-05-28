import React from "react";
import { FileText } from "lucide-react";
import { useGetCall } from "@/hooks";
import { SERVICE } from "@/constants/services";
import Loader from "@/components/ui/Loader";

/**
 * Terms & Conditions reader. Admin writes a single document via the web; we
 * render it here. Plain text with newlines and HTML are both supported —
 * `dangerouslySetInnerHTML` parses HTML tags, and `whitespace-pre-line` on
 * the wrapper preserves admin-typed line breaks inside the text nodes.
 *
 * The data source (the auth-free `terms-and-conditions` endpoint) is trusted
 * because only super-admin can write to it; no extra sanitization here.
 */
export default function TermsAndConditions() {
  const { data, loading } = useGetCall(SERVICE.TERMS_AND_CONDITIONS);
  const content: string | null = data?.data?.content ?? null;
  const updatedAt: string | null = data?.data?.updated_at ?? null;

  return (
    <div className="min-h-screen bg-gray-50 safe-area-inset-bottom pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 safe-area-inset-top">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-500 to-gray-600 flex items-center justify-center text-white">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Terms &amp; Conditions
            </h1>
            <p className="text-sm text-gray-600">
              Please read the terms carefully.
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 mt-6">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
            <Loader />
          </div>
        ) : !content ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center text-gray-500">
            Terms &amp; Conditions have not been published yet.
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
            <div
              className="text-sm text-gray-800 leading-relaxed whitespace-pre-line break-words"
              dangerouslySetInnerHTML={{ __html: content }}
            />
            {updatedAt && (
              <p className="text-xs text-gray-400 mt-6 pt-4 border-t border-gray-100">
                Last updated:{" "}
                {new Date(updatedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
