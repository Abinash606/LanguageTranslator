import React, { useState } from "react";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { Languages, ArrowRight } from "lucide-react";

i18next.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: { translation: { title: "English → Hindi + Odia Translator" } },
    hi: { translation: { title: "अंग्रेज़ी → हिंदी + उड़िया अनुवादक" } },
    or: { translation: { title: "ଇଂରାଜୀ → ହିନ୍ଦୀ + ଓଡିଆ ଅନୁବାଦକ" } },
  },
});

function App() {
  const [english, setEnglish] = useState("");
  const [hindi, setHindi] = useState("");
  const [odia, setOdia] = useState("");
  const [loading, setLoading] = useState(false);

  const freeTranslate = async (text, target) => {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=en|${target}`;

    const response = await fetch(url);
    const data = await response.json();
    return data.responseData.translatedText;
  };

  const translate = async () => {
    if (!english.trim()) return;

    setLoading(true);
    try {
      const hindiText = await freeTranslate(english, "hi");
      const odiaText = await freeTranslate(english, "or");

      setHindi(hindiText);
      setOdia(odiaText);
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      translate();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Languages className="w-10 h-10 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-800">
              {i18next.t("title")}
            </h1>
          </div>
          <p className="text-gray-600">
            Translate English text to Hindi and Odia instantly
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              English Text
            </label>
            <textarea
              placeholder="Enter English text here..."
              value={english}
              onChange={(e) => setEnglish(e.target.value)}
              onKeyPress={handleKeyPress}
              rows="5"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors resize-none text-lg"
            />
            <p className="text-sm text-gray-500 mt-2">
              Press Ctrl + Enter to translate
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <button
              onClick={translate}
              disabled={!english.trim() || loading}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Translating...</span>
                </>
              ) : (
                <>
                  <span>Translate</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Hindi Translation (हिंदी)
              </label>
              <textarea
                value={hindi}
                readOnly
                rows="5"
                placeholder="Hindi translation will appear here..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 resize-none text-lg"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                Odia Translation (ଓଡିଆ)
              </label>
              <textarea
                value={odia}
                readOnly
                rows="5"
                placeholder="Odia translation will appear here..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 resize-none text-lg"
              />
            </div>
          </div>
        </div>

        <div className="text-center mt-8 text-gray-600 text-sm">
          Powered by MyMemory Translation API
        </div>
      </div>
    </div>
  );
}

export default App;