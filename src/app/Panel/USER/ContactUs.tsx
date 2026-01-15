import React from "react";
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 safe-area-inset-bottom pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-gray-600">Loading contact information...</p>
        </div>
      </div>
    );
  }

  const bankDetails = bankData?.data || {};

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard.`,
      });
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const ContactItem = ({ icon: Icon, title, value, label, copyable = false }: any) => {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="flex items-start">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900">{title}</h3>
            <p className="text-xs text-gray-500 mb-2">{label}</p>
            <div className="flex items-center justify-between">
              <span className="text-gray-900 font-medium">{value}</span>
              {copyable && (
                <button
                  onClick={() => copyToClipboard(value, title)}
                  className="p-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4 text-blue-600" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 safe-area-inset-bottom pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 safe-area-inset-top">
        <h1 className="text-xl font-bold text-gray-900">Contact Us</h1>
        <p className="text-sm text-gray-600 mt-1">Get in touch with us using the information below</p>
      </div>

      {/* Contact Information */}
      <div className="px-4 sm:px-6 mt-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Bank Information</h2>
              <p className="text-sm text-gray-600">Our banking details for payments and transactions</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <ContactItem
            icon={CreditCard}
            title="Account Number"
            value={bankDetails.account_number || "N/A"}
            label="For fund transfers"
            copyable={true}
          />
          
          <ContactItem
            icon={User}
            title="Account Holder Name"
            value={bankDetails.account_holder_name || "N/A"}
            label="Beneficiary name"
            copyable={true}
          />
          
          <ContactItem
            icon={Hash}
            title="IFSC Code"
            value={bankDetails.ifsc_code?.toUpperCase() || "N/A"}
            label="Bank identifier code"
            copyable={true}
          />
          
          <ContactItem
            icon={Building2}
            title="Bank Name"
            value={bankDetails.bank_name || "N/A"}
            label="Financial institution"
            copyable={true}
          />
          
          <ContactItem
            icon={MapPin}
            title="Branch Name"
            value={bankDetails.branch_name || "N/A"}
            label="Bank branch location"
            copyable={true}
          />
        </div>
      </div>

      {/* Contact Methods */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
            <Phone className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Contact Methods</h2>
            <p className="text-sm text-gray-600">Reach out to us through these channels</p>
          </div>
        </div>

        <div className="space-y-4">
          <ContactItem
            icon={Phone}
            title="WhatsApp Number"
            value={bankDetails.whatsapp_number || "N/A"}
            label="Contact for support"
            copyable={true}
          />
          
          <ContactItem
            icon={Mail}
            title="Email Address"
            value="support@example.com"
            label="Send us an email"
            copyable={true}
          />
        </div>
      </div>

      {/* Office Address */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
            <MapPin className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Office Address</h2>
            <p className="text-sm text-gray-600">Visit our office during business hours</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-start">
            <MapPin className="w-5 h-5 text-gray-600 mr-3 mt-0.5" />
            <div>
              <p className="text-gray-900 font-medium">
                123 Main Street, Suite 100
              </p>
              <p className="text-gray-600">
                New York, NY 10001
              </p>
              <p className="text-gray-600">
                United States
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            <MapPin className="w-4 h-4 mr-2" />
            Get Directions
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;