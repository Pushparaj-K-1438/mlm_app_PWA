import React from "react";
import {
  MessageSquare,
  Plus,
  Edit2,
  Trash2,
  CheckCheck,
  Clock,
  X,
} from "lucide-react";
import Swal from "sweetalert2";
import { useActionCall, useGetCall } from "@/hooks";
import { SERVICE } from "@/constants/services";
import Loader from "@/components/ui/Loader";

const MAX_WORDS = 500;

const wordCount = (text: string): number => {
  if (!text) return 0;
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
};

const formatDate = (iso: string | null): string => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

type Suggestion = {
  id: number;
  content: string;
  is_read: number;
  read_at: string | null;
  created_at: string;
};

/**
 * User Suggestions page.
 *
 * Lifecycle UX:
 *   • Up to 3 UNREAD suggestions at a time (cap enforced by API; UI hides
 *     the Add button when full).
 *   • Edit/Delete icons visible only while is_read=0. Once admin marks
 *     read, the card shows a "Seen" badge with no action icons — only
 *     way to free a slot is admin marking another row as read.
 *   • Word counter live in the form, mirrors the API's 500-word cap.
 */
export default function Suggestions() {
  const { data, loading, setQuery } = useGetCall(SERVICE.SUGGESTIONS);
  const { Post, Put, Delete, loading: actionLoading } = useActionCall(
    SERVICE.SUGGESTIONS
  );

  const refresh = () => setQuery({});

  const items: Suggestion[] = data?.data ?? [];
  const meta = data?.meta ?? {
    unread_count: 0,
    unread_cap: 3,
    can_add_more: true,
    max_words: MAX_WORDS,
  };

  const [formOpen, setFormOpen] = React.useState<boolean>(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [content, setContent] = React.useState<string>("");

  const openCreate = () => {
    setEditingId(null);
    setContent("");
    setFormOpen(true);
  };
  const openEdit = (row: Suggestion) => {
    setEditingId(row.id);
    setContent(row.content);
    setFormOpen(true);
  };
  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setContent("");
  };

  const words = wordCount(content);
  const overLimit = words > MAX_WORDS;
  const disabledSave =
    actionLoading || !content.trim() || overLimit;

  const handleSubmit = async () => {
    if (disabledSave) return;
    let resp;
    if (editingId) {
      resp = await Put(String(editingId), { content }, "Suggestion updated");
    } else {
      resp = await Post({ content }, "Suggestion submitted");
    }
    if (resp) {
      closeForm();
      refresh();
    }
  };

  const handleDelete = async (row: Suggestion) => {
    const result = await Swal.fire({
      title: "Delete this suggestion?",
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      confirmButtonColor: "#dc2626",
    });
    if (result.isConfirmed) {
      const resp = await Delete(String(row.id), "Suggestion deleted");
      if (resp) refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 safe-area-inset-bottom pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 safe-area-inset-top">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Suggestions</h1>
            <p className="text-sm text-gray-600">
              Share up to {meta.unread_cap} unread suggestions with the admin.
            </p>
          </div>
        </div>
      </div>

      {/* Cap status bar */}
      <div className="px-4 sm:px-6 mt-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs text-gray-500">Pending review</div>
            <div className="text-lg font-bold text-gray-900">
              {meta.unread_count}{" "}
              <span className="text-sm font-normal text-gray-500">
                / {meta.unread_cap}
              </span>
            </div>
          </div>
          {meta.can_add_more ? (
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Suggestion
            </button>
          ) : (
            <span className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-md text-right">
              Limit reached. Wait for admin to read one of yours.
            </span>
          )}
        </div>
      </div>

      {/* List */}
      <div className="px-4 sm:px-6 mt-4 space-y-3">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
            <Loader />
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center text-gray-500">
            You haven't sent any suggestions yet. Tap{" "}
            <span className="font-semibold text-blue-600">Add Suggestion</span>{" "}
            to share your first one.
          </div>
        ) : (
          items.map((row) => {
            const read = Number(row.is_read) === 1;
            return (
              <div
                key={row.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="px-5 pt-4 pb-3 flex items-center justify-between gap-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 text-[11px] font-semibold rounded-full ${
                      read
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {read ? (
                      <>
                        <CheckCheck className="w-3 h-3 mr-1" /> Seen by admin
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 mr-1" /> Pending review
                      </>
                    )}
                  </span>
                  {!read && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(row)}
                        className="text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-md"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(row)}
                        className="text-red-600 hover:bg-red-50 p-1.5 rounded-md"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="px-5 pb-4">
                  <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line break-words">
                    {row.content}
                  </p>
                  <div className="mt-3 text-[11px] text-gray-500 flex items-center justify-between">
                    <span>Sent {formatDate(row.created_at)}</span>
                    {read && row.read_at && (
                      <span>Read {formatDate(row.read_at)}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom-sheet style form modal. z-[100] beats the bottom navigation
          (z-50 in MobileLayout) so the Cancel/Submit row isn't trapped
          behind it. Outer wrapper takes a generous safe-area bottom padding
          (24 = ~96px) to clear both the nav and any device home-indicator
          on mobile. Modal container is also capped at 82vh so it never
          extends into that reserved space. */}
      {formOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 px-2 pb-24 sm:pb-2">
          <div className="w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-xl border border-gray-100 max-h-[82vh] flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">
                {editingId ? "Edit Suggestion" : "New Suggestion"}
              </h3>
              <button
                type="button"
                onClick={closeForm}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto flex-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Your suggestion ({MAX_WORDS} words max)
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                placeholder="Share your idea, feedback or improvement…"
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  overLimit ? "border-red-400" : "border-gray-300"
                }`}
              />
              <div className="flex items-center justify-between mt-2 text-xs">
                <span
                  className={overLimit ? "text-red-600 font-semibold" : "text-gray-500"}
                >
                  {words} / {MAX_WORDS} words
                </span>
                {overLimit && (
                  <span className="text-red-600">
                    Please shorten to {MAX_WORDS} words or fewer.
                  </span>
                )}
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-2 flex-shrink-0 bg-white rounded-b-2xl">
              <button
                type="button"
                onClick={closeForm}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={disabledSave}
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading
                  ? "Saving…"
                  : editingId
                  ? "Save Changes"
                  : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
