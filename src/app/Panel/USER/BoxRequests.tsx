import { useState } from "react";
import {
  Package,
  Clock,
  Send,
  CheckCircle,
  Plus,
  X,
  MapPin,
  Calendar,
  Phone,
  AlertCircle,
} from "lucide-react";
import { useGetCall, useActionCall } from "@/hooks";
import { SERVICE } from "@/constants/services";
import { OPTIONS } from "@/constants/others";
import Loader from "@/components/ui/Loader";
import DailyVideoWarning from "@/components/DailyVideoWarning";
import InputText from "@/components/ui/InputText";
import InputTextArea from "@/components/ui/InputTextArea";
import SelectInput from "@/components/ui/SelectInput";
import toast from "react-hot-toast";

const STATUS_MAP: Record<number, { label: string; cls: string; Icon: any }> = {
  1: { label: "Requested", cls: "bg-amber-100 text-amber-800", Icon: Clock },
  2: { label: "Sent", cls: "bg-blue-100 text-blue-800", Icon: Send },
  3: { label: "Delivered", cls: "bg-green-100 text-green-800", Icon: CheckCircle },
};

// Base Promoter (level 0) = "Energy Plus"; all other levels = "Health Plus".
const productName = (lvl: any) => (Number(lvl) === 0 ? "Energy Plus" : "Health Plus");

const EMPTY_FORM = {
  quantity: "",
  delivery_type: "",
  delivery_address: "",
  pickup_date: "",
  contact_number: "",
};

export default function BoxRequests() {
  const { data, loading, setQuery } = useGetCall(SERVICE.BOX_REQUESTS_LIST);
  const { Post: requestBoxes, loading: requesting } = useActionCall(SERVICE.BOX_REQUEST);
  const { Post: markDelivered, loading: delivering } = useActionCall(SERVICE.BOX_DELIVERED);

  const meta = data?.meta || {};
  const list: any[] = data?.data || [];
  const currentProduct = productName(meta?.level);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  // Pickup date must be at least 25 days out — same rule as pin activation.
  const minPickupDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 25);
    return d.toISOString().split("T")[0];
  })();

  const handleChange = (e: any) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const refresh = () => setQuery(true);

  const openRequest = () =>
    setForm({ ...EMPTY_FORM, contact_number: meta?.mobile || "" });

  const toggleRequest = () => {
    if (open) {
      setOpen(false);
      setForm({ ...EMPTY_FORM });
    } else {
      openRequest();
      setOpen(true);
    }
  };

  const submitRequest = async () => {
    if (!form.quantity) return toast.error(`Select number of ${currentProduct}`);
    if (!form.delivery_type) return toast.error("Select delivery type");
    if (form.delivery_type === "2" && !form.delivery_address)
      return toast.error("Enter delivery address");
    if (form.delivery_type === "1" && !form.pickup_date)
      return toast.error("Select pickup date");
    if (!form.contact_number) return toast.error("Enter contact number");

    const resp = await requestBoxes({ ...form });
    if (resp) {
      setForm({ ...EMPTY_FORM });
      setOpen(false);
      refresh();
    }
  };

  const onDelivered = async (id: number) => {
    const resp = await markDelivered({ id });
    if (resp) refresh();
  };

  if (loading) {
    return (
      <DailyVideoWarning>
        <Loader />
      </DailyVideoWarning>
    );
  }

  const capReached =
    meta?.cap > 0 && (meta?.received ?? 0) >= meta.cap && !meta?.can_request;

  return (
    <DailyVideoWarning>
      <div className="min-h-screen bg-gray-50 safe-area-inset-bottom pb-24">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 safe-area-inset-top">
          <h1 className="text-xl font-bold text-gray-900 flex items-center">
            <Package className="w-5 h-5 mr-2 text-green-600" />
            Plan Product
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Your plan product allocations and their delivery status.
          </p>
        </div>

        {/* Allocation summary + request action */}
        {meta?.level !== null && meta?.level !== undefined && (
          <div className="px-6 mt-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{currentProduct} received</span>
                <span className="font-semibold text-gray-900">
                  {meta.received ?? 0}
                  {meta.cap ? ` / ${meta.cap}` : ""}
                </span>
              </div>

              {meta?.can_request && (
                <button
                  onClick={toggleRequest}
                  className="mt-3 w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium active:scale-95 transition-transform"
                >
                  {open ? (
                    <>
                      <X className="w-4 h-4 mr-1" /> Close
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-1" /> Request {currentProduct}
                      {meta?.remaining ? ` (${meta.remaining} left)` : ""}
                    </>
                  )}
                </button>
              )}

              {capReached && (
                <p className="mt-2 text-xs text-gray-500">
                  You've reached your {currentProduct} limit for this level.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Request form */}
        {open && meta?.can_request && (
          <div className="px-6 mt-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Number of {currentProduct} *
                </label>
                <SelectInput
                  name="quantity"
                  placeholder={`Select number of ${currentProduct}`}
                  options={(meta?.options || []).map((n: number) => ({
                    value: String(n),
                    label: `${n} ${currentProduct}`,
                  }))}
                  onChange={handleChange}
                  value={form}
                  error={{}}
                />
              </div>

              <div>
                <div className="flex items-center mb-1">
                  <Package className="w-4 h-4 text-gray-500 mr-1.5" />
                  <label className="text-sm font-medium text-gray-700">
                    Delivery Type *
                  </label>
                </div>
                <SelectInput
                  name="delivery_type"
                  placeholder="Select delivery type"
                  options={OPTIONS.GIFT_DELIVERY_LEVEL}
                  onChange={handleChange}
                  value={form}
                  error={{}}
                />
              </div>

              {form.delivery_type === "2" && (
                <div>
                  <div className="flex items-center mb-1">
                    <MapPin className="w-4 h-4 text-gray-500 mr-1.5" />
                    <label className="text-sm font-medium text-gray-700">
                      Delivery Address *
                    </label>
                  </div>
                  <InputTextArea
                    name="delivery_address"
                    placeholder="Enter delivery address"
                    onChange={handleChange}
                    value={form}
                    error={{}}
                  />
                </div>
              )}

              {form.delivery_type === "1" && (
                <div>
                  <div className="flex items-center mb-1">
                    <Calendar className="w-4 h-4 text-gray-500 mr-1.5" />
                    <label className="text-sm font-medium text-gray-700">
                      Pickup Date *
                    </label>
                  </div>
                  <InputText
                    name="pickup_date"
                    type="date"
                    placeholder="Pickup date"
                    onChange={handleChange}
                    value={form}
                    error={{}}
                    minDate={minPickupDate}
                  />
                  <div className="mt-1 flex items-center text-amber-600 text-xs">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" />
                    Please select a date at least 25 days from today
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center mb-1">
                  <Phone className="w-4 h-4 text-gray-500 mr-1.5" />
                  <label className="text-sm font-medium text-gray-700">
                    Contact Number *
                  </label>
                </div>
                <InputText
                  name="contact_number"
                  placeholder="Enter contact number"
                  onChange={handleChange}
                  value={form}
                  error={{}}
                />
              </div>

              <button
                onClick={submitRequest}
                disabled={requesting}
                className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium disabled:opacity-50"
              >
                {requesting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </div>
        )}

        {/* List */}
        <div className="px-6 mt-4 space-y-3">
          {list.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No plan product requests yet.</p>
            </div>
          ) : (
            list.map((b) => {
              const s = STATUS_MAP[Number(b.status)] || STATUS_MAP[1];
              const StatusIcon = s.Icon;
              return (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mr-3">
                        <Package className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {b.quantity} {productName(b.level)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {b.created_at_formatted}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${s.cls}`}
                    >
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {s.label}
                    </span>
                  </div>

                  {Number(b.status) === 2 && (
                    <button
                      onClick={() => onDelivered(b.id)}
                      disabled={delivering}
                      className="mt-3 w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium disabled:opacity-50 active:scale-95 transition-transform"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Mark as Delivered
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </DailyVideoWarning>
  );
}
