import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Building2, CreditCard, Hash, User, MessageCircle, Mail, MapPin, Copy, Check } from "lucide-react";
import { useGetCall } from "@/hooks";
import { SERVICE } from "@/constants/services";
import Loader from "@/components/ui/Loader";
import { useToast } from "@/hooks/use-toast";

const ContactUs = () => {
  const {
    loading,
    data: bankData,
  } = useGetCall(SERVICE.GET_ADMIN_BANK_DETAILS);
  const { toast } = useToast();
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const bankDetails = bankData?.data || {};

  const copyToClipboard = (text: string, item: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(item);
    toast({
      title: "Copied!",
      description: `${item} copied to clipboard`,
    });
    setTimeout(() => setCopiedItem(null), 2000);
  };

  if (loading) {
    return (
      <div className="w-full pb-24 px-4 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading contact information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full pb-24 px-4 bg-gray-50 min-h-screen">
      {/* Header Section - Native App Style */}
      <div className="py-6">
        <h1 className="text-2xl font-bold text-gray-900">Contact Us</h1>
        <p className="text-gray-600 mt-1">
          Get in touch with us using the information below
        </p>
      </div>

      {/* Contact Options - Mobile Native Style */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-3">
            <MessageCircle className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">WhatsApp</h3>
          <p className="text-xs text-gray-500">Chat with us</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
            <Phone className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">Call Us</h3>
          <p className="text-xs text-gray-500">Direct support</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
            <Mail className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">Email</h3>
          <p className="text-xs text-gray-500">Send us a message</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mb-3">
            <MapPin className="w-5 h-5 text-orange-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-900 mb-1">Visit Us</h3>
          <p className="text-xs text-gray-500">Office location</p>
        </div>
      </div>

      {/* Bank Information Card - Mobile Native Style */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-base font-semibold text-gray-900 flex items-center">
            <Building2 className="w-4 h-4 mr-2 text-blue-500" />
            Banking Information
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Our banking details for payments and transactions
          </p>
        </div>
        <div className="p-5 space-y-4">
          {/* Account Number */}
          <div className="bg-gray-50 rounded-2xl p-4 active:scale-[0.98] transition-transform">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Account Number</div>
                  <div className="text-xs text-gray-500">For fund transfers</div>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(bankDetails.account_number || "N/A", "Account Number")}
                className="flex items-center gap-1 text-blue-600 active:scale-95 transition-transform"
              >
                {copiedItem === "Account Number" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="mt-2 font-mono text-base font-semibold text-gray-900">
              {bankDetails.account_number || "N/A"}
            </div>
          </div>

          {/* Account Holder Name */}
          <div className="bg-gray-50 rounded-2xl p-4 active:scale-[0.98] transition-transform">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Account Holder Name</div>
                  <div className="text-xs text-gray-500">Beneficiary name</div>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(bankDetails.account_holder_name || "N/A", "Account Holder Name")}
                className="flex items-center gap-1 text-blue-600 active:scale-95 transition-transform"
              >
                {copiedItem === "Account Holder Name" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="mt-2 font-medium text-gray-900">
              {bankDetails.account_holder_name || "N/A"}
            </div>
          </div>

          {/* IFSC Code */}
          <div className="bg-gray-50 rounded-2xl p-4 active:scale-[0.98] transition-transform">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Hash className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">IFSC Code</div>
                  <div className="text-xs text-gray-500">Bank identifier code</div>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(bankDetails.ifsc_code || "N/A", "IFSC Code")}
                className="flex items-center gap-1 text-blue-600 active:scale-95 transition-transform"
              >
                {copiedItem === "IFSC Code" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="mt-2 font-mono text-base font-semibold uppercase text-gray-900">
              {bankDetails.ifsc_code || "N/A"}
            </div>
          </div>

          {/* Bank Name */}
          <div className="bg-gray-50 rounded-2xl p-4 active:scale-[0.98] transition-transform">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Bank Name</div>
                  <div className="text-xs text-gray-500">Financial institution</div>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(bankDetails.bank_name || "N/A", "Bank Name")}
                className="flex items-center gap-1 text-blue-600 active:scale-95 transition-transform"
              >
                {copiedItem === "Bank Name" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="mt-2 font-medium text-gray-900">
              {bankDetails.bank_name || "N/A"}
            </div>
          </div>

          {/* Branch Name */}
          <div className="bg-gray-50 rounded-2xl p-4 active:scale-[0.98] transition-transform">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Branch Name</div>
                  <div className="text-xs text-gray-500">Bank branch location</div>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(bankDetails.branch_name || "N/A", "Branch Name")}
                className="flex items-center gap-1 text-blue-600 active:scale-95 transition-transform"
              >
                {copiedItem === "Branch Name" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="mt-2 font-medium text-gray-900">
              {bankDetails.branch_name || "N/A"}
            </div>
          </div>

          {/* WhatsApp Number */}
          <div className="bg-gray-50 rounded-2xl p-4 active:scale-[0.98] transition-transform">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">WhatsApp Number</div>
                  <div className="text-xs text-gray-500">Contact for support</div>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(bankDetails.whatsapp_number || "N/A", "WhatsApp Number")}
                className="flex items-center gap-1 text-blue-600 active:scale-95 transition-transform"
              >
                {copiedItem === "WhatsApp Number" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="mt-2 font-mono text-base font-semibold text-gray-900">
              {bankDetails.whatsapp_number || "N/A"}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Mobile Native Style */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => window.open(`https://wa.me/${bankDetails.whatsapp_number?.replace(/\D/g, '')}`, '_blank')}
            className="bg-green-50 border border-green-100 rounded-2xl p-3 flex flex-col items-center justify-center active:scale-95 transition-transform"
          >
            <MessageCircle className="w-5 h-5 text-green-600 mb-1" />
            <span className="text-xs font-medium text-green-800">WhatsApp</span>
          </button>
          <button
            onClick={() => window.open(`tel:${bankDetails.whatsapp_number}`, '_blank')}
            className="bg-blue-50 border border-blue-100 rounded-2xl p-3 flex flex-col items-center justify-center active:scale-95 transition-transform"
          >
            <Phone className="w-5 h-5 text-blue-600 mb-1" />
            <span className="text-xs font-medium text-blue-800">Call</span>
          </button>
          <button
            onClick={() => window.open(`mailto:support@example.com`, '_blank')}
            className="bg-purple-50 border border-purple-100 rounded-2xl p-3 flex flex-col items-center justify-center active:scale-95 transition-transform"
          >
            <Mail className="w-5 h-5 text-purple-600 mb-1" />
            <span className="text-xs font-medium text-purple-800">Email</span>
          </button>
          <button
            onClick={() => window.open(`https://maps.google.com/?q=Office+Location`, '_blank')}
            className="bg-orange-50 border border-orange-100 rounded-2xl p-3 flex flex-col items-center justify-center active:scale-95 transition-transform"
          >
            <MapPin className="w-5 h-5 text-orange-600 mb-1" />
            <span className="text-xs font-medium text-orange-800">Location</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;