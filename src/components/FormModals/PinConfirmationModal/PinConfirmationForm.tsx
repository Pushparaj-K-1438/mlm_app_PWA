import { useFormik } from "formik";
import { useState } from "react";
import Btn from "@/components/ui/Btn";
import { FileText, Globe, CheckCircle, AlertCircle } from "lucide-react";

const PinConfirmationForm = ({
  data = {},
  onAction = (values: any) => {},
  onCloseModal = () => {},
  loading = false,
}: any) => {
  const [isTamil, setIsTamil] = useState(true);

  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      current_level: data?.level ?? "",
    },
    onSubmit: async (values: any) => {
      onAction(values);
    },
  });

  const tamilContent = [
    "நமது நிறுவனம் Education and Promotion முறையில் Re-purchase and Re-selling மூலம் நடைபெறும்.",
    "நமது நிறுவனத்தில் இணையும் பொழுது ஒருவர் எந்தவிதமான Investment and Purchase இல்லாமல் இலவசமாக தான் இணைய முடியும்.",
    "நமது நிறுவனத்தில் இணைந்த பிறகு 7 நாட்கள் Training முடித்த பிறகு அவர்களின் சுய விருப்பத்தின் பெயரில் அவர்களின் ID - க்கு நிறுவனம் பரிந்துரை செய்யும் Product- யை Purchase செய்து மட்டுமே Upgrade செய்து கொள்ள முடியும்.",
    "நமது நிறுவனத்தில் ID - யை Upgrade செய்த பிறகு நிறுவனத்தின் மூலம் ஈட்டிய பணத்தை நிறுவனத்தின் நிபந்தனைகளுக்கு உட்பட்டு 30 நாட்களுக்கு ஒரு முறை withdraw செய்து கொள்ளலாம்.",
    "வருங்காலங்களில் நிறுவனத்தை தொடர்ந்து செயல்படுத்த நிறுவனத்தின் Plan - களை மாற்றியமைத்து நிறுவனத்தைத் தொடர்ந்து செயல்படுத்த நிறுவனத்தின் நிர்வாக இயக்குனருக்கு முழு உரிமை உண்டு.",
    "மேலே உள்ள அனைத்து நிபந்தனைகளும் தெரிந்துகொண்டு எனது முழு சுய விருப்பத்தின் பெயரில் யாருடைய தூண்டுதல் இல்லாமலும் எனது ID - யை  Upgrade செய்து கொள்கிறேன்."
  ];

  const englishContent = [
    "Our company operates through Education and Promotion through Re-purchase and Re-selling.",
    "When joining our company, one can join for free without any investment or purchase.",
    "After joining our company and completing 7 days of training, they can upgrade only by purchasing the product recommended by the company for their ID, at their own discretion.",
    "The Managing Director of the Company has the full right to continue operating the Company in the future by amending the Company's Plans.",
    "Knowing all the above conditions, I upgrade my ID of my own free will and without any inducement from anyone."
  ];

  const currentContent = isTamil ? tamilContent : englishContent;

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {/* Language Toggle */}
      <div className="flex items-center justify-between bg-blue-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-center">
          <FileText className="w-5 h-5 text-blue-600 mr-2" />
          <h4 className="font-medium text-blue-900">Terms & Conditions</h4>
        </div>
        <button
          type="button"
          onClick={() => setIsTamil(!isTamil)}
          className="flex items-center px-3 py-1.5 bg-white border border-blue-200 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
        >
          <Globe className="w-4 h-4 mr-1" />
          {isTamil ? "English" : "தமிழ்"}
        </button>
      </div>

      {/* Terms Content */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 max-h-60 overflow-y-auto">
        <ul className="text-sm text-gray-700 space-y-3">
          {currentContent.map((item, index) => {
            const isLastItem = index === currentContent.length - 1;
            return (
              <li key={index} className="flex items-start">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                <span className={isLastItem ? "font-semibold" : ""}>
                  {item}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Confirmation Message */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-amber-900 mb-1">Confirmation Required</h4>
            <p className="text-sm text-amber-800">
              By accepting these terms, you confirm that you have read and understood all the conditions mentioned above.
            </p>
          </div>
        </div>
      </div>

      {/* Accept Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Accept Terms & Conditions
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PinConfirmationForm;