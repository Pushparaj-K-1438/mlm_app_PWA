import { useFormik } from "formik";
import { useState } from "react";
import Btn from "@/components/ui/Btn";

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
    <form className="space-y-4" onSubmit={handleSubmit}>
         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium text-blue-900">Important Notes:</h4>
              <button
                type="button"
                onClick={() => setIsTamil(!isTamil)}
                className="text-sm px-3 py-1 bg-red-100 hover:bg-red-200 border border-red-500 text-red-800 rounded transition-colors"
              >
                {isTamil ? "English" : "தமிழ்"}
              </button>
            </div>
            <ul className="text-sm text-blue-800 space-y-1">
              {currentContent.map((item, index) => {
                const isLastItem = index === currentContent.length - 1;
                return (
                  <li key={index}>
                    • {isLastItem ? <b>{item}</b> : item}
                  </li>
                );
              })}
            </ul>
          </div>
      <div className="flex justify-end space-x-3 pt-4">
        <Btn title={"Accept"} isLoading={loading} onClick={handleSubmit} />
      </div>
    </form>
  );
};

export default PinConfirmationForm;
