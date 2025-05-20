import * as Localization from 'react-native-localize';
import i18n from 'i18n-js';

// Example translations
const translations = {
  en: {
    selectVideo: 'Select Video',
    selectRange: 'Select Range',
    selectSavePath: 'Select Save Path',
    extractFrames: 'Extract Frames',
    extracting: 'Extracting frames...',
    language: 'Language',
    success: 'Frames extracted successfully!',
    error: 'An error occurred',
  },
  fa: {
    selectVideo: 'انتخاب ویدئو',
    selectRange: 'انتخاب بازه',
    selectSavePath: 'انتخاب مسیر ذخیره',
    extractFrames: 'استخراج فریم‌ها',
    extracting: 'در حال استخراج فریم‌ها...',
    language: 'زبان',
    success: 'استخراج فریم‌ها با موفقیت انجام شد!',
    error: 'خطایی رخ داد',
  },
};

i18n.translations = translations;
i18n.fallbacks = true;

const setI18nConfig = (languageTag) => {
  i18n.locale = languageTag || Localization.getLocales()[0].languageTag;
};

export { i18n, setI18nConfig };