import React, { useState } from "react";
import {
  FileText,
  Image as ImageIcon,
  Eye,
  X,
  Loader2,
} from "lucide-react";
import { useGetCall } from "@/hooks";
import { SERVICE } from "@/constants/services";
import Loader from "@/components/ui/Loader";
import Lib from "@/utils/Lib";

const FILE_TYPE_PDF = 2;

type Doc = {
  id: number;
  title: string;
  file_path: string;
  file_type: number;
  type_label: string;
};

// Discourages the obvious save paths: long-press "Save image" on mobile,
// right-click "Save as", and drag-to-desktop. Screenshots are still possible
// (and per the requirement, that's fine) — this only removes the download
// affordances, it is not DRM.
const noSaveProps = {
  onContextMenu: (e: React.SyntheticEvent) => e.preventDefault(),
  draggable: false,
  style: {
    WebkitTouchCallout: "none",
    WebkitUserSelect: "none",
    userSelect: "none",
  } as React.CSSProperties,
};

/** Full-screen in-app viewer. */
const DocViewer = ({ doc, onClose }: { doc: Doc; onClose: () => void }) => {
  const [loaded, setLoaded] = useState(false);
  const isPdf = Number(doc.file_type) === FILE_TYPE_PDF;
  const src = Lib.CloudPath(doc.file_path);

  return (
    <div className="fixed inset-0 z-[9998] bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-900 border-b border-white/10 safe-area-inset-top">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          aria-label="Close document"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-white font-medium text-sm truncate flex-1">
          {doc.title}
        </h2>
      </div>

      {/* Body */}
      <div
        className="flex-1 overflow-auto relative"
        {...noSaveProps}
      >
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white/70 animate-spin" />
          </div>
        )}

        {isPdf ? (
          // #toolbar=0 hides the built-in viewer's download/print buttons
          // where the browser honours it.
          <iframe
            src={`${src}#toolbar=0&navpanes=0&scrollbar=1`}
            title={doc.title}
            className="w-full h-full border-0 bg-white"
            onLoad={() => setLoaded(true)}
          />
        ) : (
          <div className="min-h-full flex items-start justify-center p-3">
            <img
              src={src}
              alt={doc.title}
              onLoad={() => setLoaded(true)}
              className="max-w-full h-auto rounded-lg"
              {...noSaveProps}
            />
          </div>
        )}
      </div>

      <div className="px-4 py-2 bg-gray-900 text-center safe-area-inset-bottom">
        <p className="text-[11px] text-white/40">
          For viewing only — please do not share outside the company.
        </p>
      </div>
    </div>
  );
};

export default function CompanyDocs() {
  const { data, loading } = useGetCall(SERVICE.COMPANY_DOCUMENTS_LIST);
  // The menu is hidden when the admin switches it off, but the route is still
  // reachable by URL, so the page has to check too. Defaults to visible so a
  // failed call never blocks a legitimate user.
  const { data: menuSettings } = useGetCall(SERVICE.USER_MENU_SETTINGS);
  const menuHidden = menuSettings?.data?.company_docs === false;

  const [active, setActive] = useState<Doc | null>(null);
  const docs: Doc[] = menuHidden ? [] : data?.data ?? [];

  return (
    <div className="min-h-screen bg-gray-50 safe-area-inset-bottom pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 safe-area-inset-top">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center text-white">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Company Docs</h1>
            <p className="text-sm text-gray-600">
              Tap a document to view it here in the app.
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 mt-6 space-y-3">
        {menuHidden ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Not Available
            </h3>
            <p className="text-sm text-gray-600">
              Company documents aren't available right now.
            </p>
          </div>
        ) : loading ? (
          <Loader />
        ) : docs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Documents Yet
            </h3>
            <p className="text-sm text-gray-600">
              Company documents will appear here once they're published.
            </p>
          </div>
        ) : (
          docs.map((doc) => {
            const isPdf = Number(doc.file_type) === FILE_TYPE_PDF;
            return (
              <button
                key={doc.id}
                onClick={() => setActive(doc)}
                className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors"
              >
                <span
                  className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    isPdf
                      ? "bg-red-50 text-red-600"
                      : "bg-blue-50 text-blue-600"
                  }`}
                >
                  {isPdf ? (
                    <FileText className="w-5 h-5" />
                  ) : (
                    <ImageIcon className="w-5 h-5" />
                  )}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold text-gray-900 truncate">
                    {doc.title}
                  </span>
                  <span className="block text-xs text-gray-500">
                    {doc.type_label}
                  </span>
                </span>
                <span
                  className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0"
                  title="View document"
                >
                  <Eye className="w-4 h-4" />
                </span>
              </button>
            );
          })
        )}
      </div>

      {active && <DocViewer doc={active} onClose={() => setActive(null)} />}
    </div>
  );
}
