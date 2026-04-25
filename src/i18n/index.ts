import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import vi from "./locales/vi.json";
import en from "./locales/en.json";

export const SUPPORTED_LANGS = ["vi", "en"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        vi: { translation: vi },
        en: { translation: en },
      },
      fallbackLng: "vi",
      supportedLngs: SUPPORTED_LANGS as unknown as string[],
      interpolation: { escapeValue: false },
      detection: {
        order: ["localStorage", "navigator"],
        lookupLocalStorage: "app-lang",
        caches: ["localStorage"],
      },
    });
}

export default i18n;