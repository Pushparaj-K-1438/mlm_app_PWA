import { useParams } from "react-router-dom";
import { ArrowLeft, Download, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useGetCall, useQueryParams } from "@/hooks";
import { BASE_URL } from "@/constants/services";
import Loader from "@/components/ui/Loader";
import logo from "@/assets/logo.png";

const money = (value: any) =>
  Number(value ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

/**
 * Printable invoice for a delivered plan-product batch.
 *
 * Every number comes from the server (InvoiceBuilder) — nothing is calculated
 * here, so the printed document can never disagree with the database. This
 * on-screen version is for reading; "Download" opens a short-lived signed
 * link to the server-rendered PDF, which the browser (or the APK wrapper)
 * saves natively — not the print dialog, and not a blob.
 */
export default function Invoice() {
  const { id } = useParams();
  const { navigate } = useQueryParams();

  const { data, loading, error } = useGetCall(
    `box-requests/${id}/invoice`
  );

  // Asks the server for a short-lived signed link. avoidFetch: only on click.
  const { fetchApi: fetchLink, loading: downloading } = useGetCall(
    `box-requests/${id}/invoice/link`,
    { avoidFetch: true }
  );

  const inv = data?.data;

  /** Fetch a fresh signed link and resolve it against the API origin. */
  const getSignedUrl = async (): Promise<string> => {
    const res: any = await fetchLink({});
    const path = res?.data?.url;
    if (!path) throw new Error("Could not prepare the invoice");
    // Signed relatively, so resolve against the API's origin, not this app's.
    return new URL(path, BASE_URL).toString();
  };

  /**
   * Download the invoice.
   *
   * Two earlier approaches were ruled out by the APK wrapper:
   *
   *  1. blob + <a download> — an Android WebView cannot pass a blob: URL to
   *     the system download manager. Silently did nothing.
   *  2. window.open / location.href — WebView has no PDF renderer, so it
   *     painted a blank white screen and dropped the user out of the app.
   *
   * A hidden iframe pointed at a real, signed URL is what a WebView's
   * DownloadListener can actually act on: it never navigates the page, and
   * onDownloadStart receives a genuine URL that DownloadManager can fetch on
   * its own (which a blob: URL could never be). Works unchanged in a normal
   * browser too.
   */
  const handleDownload = async () => {
    try {
      const url = await getSignedUrl();

      const frame = document.createElement("iframe");
      frame.style.display = "none";
      frame.src = url;
      document.body.appendChild(frame);

      // Leave it attached long enough for the transfer to start, then tidy up.
      setTimeout(() => frame.remove(), 60_000);

      toast.success("Downloading invoice…");
    } catch (e: any) {
      toast.error(e?.message || "Could not download the invoice");
    }
  };

  if (loading) return <Loader />;

  if (!inv) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-16 text-center">
        <AlertCircle className="mx-auto mb-3 h-10 w-10 text-gray-400" />
        <p className="text-gray-700">
          {error || "This invoice isn't available yet."}
        </p>
        <button
          onClick={() => navigate.push("/portal/user/box-requests")}
          className="mt-4 text-sm font-semibold text-blue-600"
        >
          Back to Plan Product
        </button>
      </div>
    );
  }

  const item = inv.items?.[0] ?? {};
  const totals = inv.totals ?? {};
  const by = inv.billed_by ?? {};
  const to = inv.billed_to ?? {};

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      {/*
        Print rules: hide the whole app, then reveal only the invoice sheet.
        Done here rather than in the layout so the page stays self-contained.
      */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #invoice-sheet, #invoice-sheet * { visibility: visible !important; }
          #invoice-sheet {
            position: absolute; left: 0; top: 0;
            width: 100%; margin: 0; padding: 24px;
            box-shadow: none !important; border: 0 !important;
          }
          .no-print { display: none !important; }
          @page { size: A4; margin: 12mm; }
        }
      `}</style>

      {/* Screen-only toolbar */}
      <div className="no-print sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3">
        <button
          onClick={() => navigate.push("/portal/user/box-requests")}
          className="inline-flex items-center text-sm font-medium text-gray-700"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </button>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="inline-flex items-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white active:scale-95 disabled:opacity-60"
        >
          <Download className="mr-1.5 h-4 w-4" />
          {downloading ? "Preparing…" : "Download"}
        </button>
      </div>

      <div className="px-3 py-4">
        <div
          id="invoice-sheet"
          className="mx-auto max-w-3xl rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Invoice
              </h1>
              <table className="mt-3 text-xs sm:text-sm">
                <tbody>
                  <tr>
                    <td className="pr-6 text-gray-500">Invoice#</td>
                    <td className="font-semibold text-gray-900">
                      {inv.invoice_no}
                    </td>
                  </tr>
                  <tr>
                    <td className="pr-6 pt-1 text-gray-500">Invoice Date</td>
                    <td className="pt-1 font-semibold text-gray-900">
                      {inv.invoice_date}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <img
              src={logo}
              alt={by.name || "Company"}
              className="h-12 w-auto object-contain sm:h-16"
            />
          </div>

          {/* Billed by / Billed to */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-800">Billed by</p>
              <p className="mt-2 text-sm font-bold text-gray-900">{by.name}</p>
              {by.address ? (
                <p className="mt-0.5 text-xs leading-relaxed text-gray-600">
                  {by.address}
                </p>
              ) : null}
              {by.gstin ? (
                <p className="mt-1.5 text-xs text-gray-700">
                  <span className="font-semibold">GSTIN</span> {by.gstin}
                </p>
              ) : null}
              {by.pan ? (
                <p className="text-xs text-gray-700">
                  <span className="font-semibold">PAN</span> {by.pan}
                </p>
              ) : null}
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-800">Billed to</p>
              <p className="mt-2 text-sm font-bold text-gray-900">{to.name}</p>
              {to.address ? (
                <p className="mt-0.5 text-xs leading-relaxed text-gray-600">
                  {to.address}
                </p>
              ) : null}
              {to.customer_id ? (
                <p className="mt-1.5 text-xs text-gray-700">
                  <span className="font-semibold">Customer ID</span>{" "}
                  {to.customer_id}
                </p>
              ) : null}
              {to.mobile ? (
                <p className="text-xs text-gray-700">
                  <span className="font-semibold">Mobile</span> {to.mobile}
                </p>
              ) : null}
            </div>
          </div>

          {/* Supply */}
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 px-1 text-xs">
            <p className="text-gray-500">
              Country of Supply{" "}
              <span className="font-semibold text-gray-800">
                {inv.country_of_supply}
              </span>
            </p>
          </div>

          {/* Items — scrolls sideways on a phone, fits the page in print */}
          <div className="mt-4 -mx-1 overflow-x-auto">
            <table className="w-full min-w-[580px] border-collapse text-xs">
              <thead>
                <tr className="bg-gray-700 text-white">
                  <th className="px-3 py-2.5 text-left font-semibold">
                    Item description
                  </th>
                  <th className="px-2 py-2.5 text-center font-semibold">Qty</th>
                  <th className="px-2 py-2.5 text-right font-semibold">MRP</th>
                  <th className="px-2 py-2.5 text-right font-semibold">
                    Sales Price
                  </th>
                  <th className="px-2 py-2.5 text-center font-semibold">GST</th>
                  <th className="px-2 py-2.5 text-right font-semibold">
                    Taxable
                  </th>
                  <th className="px-2 py-2.5 text-right font-semibold">SGST</th>
                  <th className="px-2 py-2.5 text-right font-semibold">CGST</th>
                  <th className="px-3 py-2.5 text-right font-semibold">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-3 py-3 text-gray-900">
                    1. {item.description}
                  </td>
                  <td className="px-2 py-3 text-center text-gray-700">
                    {item.qty}
                  </td>
                  <td className="px-2 py-3 text-right text-gray-700">
                    ₹{money(item.mrp)}
                  </td>
                  <td className="px-2 py-3 text-right text-gray-700">
                    ₹{money(item.sales_price)}
                  </td>
                  <td className="px-2 py-3 text-center text-gray-700">
                    {item.gst_percent}%
                  </td>
                  <td className="px-2 py-3 text-right text-gray-700">
                    ₹{money(item.taxable)}
                  </td>
                  <td className="px-2 py-3 text-right text-gray-700">
                    ₹{money(item.sgst)}
                  </td>
                  <td className="px-2 py-3 text-right text-gray-700">
                    ₹{money(item.cgst)}
                  </td>
                  <td className="px-3 py-3 text-right font-semibold text-gray-900">
                    ₹{money(item.amount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-6 flex justify-end">
            <div className="w-full sm:w-80">
              <div className="flex justify-between py-1.5 text-sm">
                <span className="text-gray-600">Sub Total</span>
                <span className="font-medium text-gray-900">
                  ₹{money(totals.sub_total)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 text-sm">
                <span className="text-gray-600">Taxable Amount</span>
                <span className="font-medium text-gray-900">
                  ₹{money(totals.taxable)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 text-sm">
                <span className="text-gray-600">
                  CGST ({totals.cgst_percent}%)
                </span>
                <span className="font-medium text-gray-900">
                  ₹{money(totals.cgst)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 text-sm">
                <span className="text-gray-600">
                  SGST ({totals.sgst_percent}%)
                </span>
                <span className="font-medium text-gray-900">
                  ₹{money(totals.sgst)}
                </span>
              </div>

              {/* Only shown when there is something to round — a zero
                  round-off line is just noise. */}
              {Number(totals.round_off ?? 0) !== 0 ? (
                <div className="flex justify-between py-1.5 text-sm">
                  <span className="text-gray-600">Round Off</span>
                  <span className="font-medium text-gray-900">
                    {Number(totals.round_off) > 0 ? "+" : "−"}₹
                    {money(Math.abs(Number(totals.round_off)))}
                  </span>
                </div>
              ) : null}

              <div className="mt-2 flex items-center justify-between border-t border-gray-300 pt-3">
                <span className="text-base font-semibold text-gray-900">
                  Total
                </span>
                <span className="text-xl font-bold text-gray-900">
                  ₹{money(totals.grand_total ?? totals.total)}
                </span>
              </div>

              <div className="mt-3 border-t border-gray-200 pt-2">
                <p className="text-xs text-gray-500">Invoice Total (in words)</p>
                <p className="mt-0.5 text-sm font-semibold leading-snug text-gray-900">
                  {totals.in_words}
                </p>
              </div>
            </div>
          </div>

          {/* Contact footer */}
          {by.email || by.phone ? (
            <p className="mt-8 border-t border-gray-100 pt-4 text-xs text-gray-500">
              For any enquiries
              {by.email ? (
                <>
                  , email us at{" "}
                  <span className="font-semibold text-gray-700">{by.email}</span>
                </>
              ) : null}
              {by.phone ? (
                <>
                  {" "}
                  or call{" "}
                  <span className="font-semibold text-gray-700">{by.phone}</span>
                </>
              ) : null}
              .
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
