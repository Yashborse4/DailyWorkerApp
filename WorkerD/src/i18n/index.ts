import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';

// English
import en_common from './locales/en/common.json';
import en_onboarding from './locales/en/onboarding.json';
import en_jobs from './locales/en/jobs.json';

// Hindi
import hi_common from './locales/hi/common.json';
import hi_onboarding from './locales/hi/onboarding.json';
import hi_jobs from './locales/hi/jobs.json';

// Marathi
import mr_common from './locales/mr/common.json';
import mr_onboarding from './locales/mr/onboarding.json';
import mr_jobs from './locales/mr/jobs.json';

// New Indian Languages
import bn_common from './locales/bn/common.json';
import bn_onboarding from './locales/bn/onboarding.json';
import bn_jobs from './locales/bn/jobs.json';

import te_common from './locales/te/common.json';
import te_onboarding from './locales/te/onboarding.json';
import te_jobs from './locales/te/jobs.json';

import ta_common from './locales/ta/common.json';
import ta_onboarding from './locales/ta/onboarding.json';
import ta_jobs from './locales/ta/jobs.json';

import gu_common from './locales/gu/common.json';
import gu_onboarding from './locales/gu/onboarding.json';
import gu_jobs from './locales/gu/jobs.json';

import kn_common from './locales/kn/common.json';
import kn_onboarding from './locales/kn/onboarding.json';
import kn_jobs from './locales/kn/jobs.json';

import ml_common from './locales/ml/common.json';
import ml_onboarding from './locales/ml/onboarding.json';
import ml_jobs from './locales/ml/jobs.json';

import pa_common from './locales/pa/common.json';
import pa_onboarding from './locales/pa/onboarding.json';
import pa_jobs from './locales/pa/jobs.json';

import ur_common from './locales/ur/common.json';
import ur_onboarding from './locales/ur/onboarding.json';
import ur_jobs from './locales/ur/jobs.json';

import as_common from './locales/as/common.json';
import as_onboarding from './locales/as/onboarding.json';
import as_jobs from './locales/as/jobs.json';

import or_common from './locales/or/common.json';
import or_onboarding from './locales/or/onboarding.json';
import or_jobs from './locales/or/jobs.json';

const resources = {
  en: { common: en_common, onboarding: en_onboarding, jobs: en_jobs },
  hi: { common: hi_common, onboarding: hi_onboarding, jobs: hi_jobs },
  mr: { common: mr_common, onboarding: mr_onboarding, jobs: mr_jobs },
  bn: { common: bn_common, onboarding: bn_onboarding, jobs: bn_jobs },
  te: { common: te_common, onboarding: te_onboarding, jobs: te_jobs },
  ta: { common: ta_common, onboarding: ta_onboarding, jobs: ta_jobs },
  gu: { common: gu_common, onboarding: gu_onboarding, jobs: gu_jobs },
  kn: { common: kn_common, onboarding: kn_onboarding, jobs: kn_jobs },
  ml: { common: ml_common, onboarding: ml_onboarding, jobs: ml_jobs },
  pa: { common: pa_common, onboarding: pa_onboarding, jobs: pa_jobs },
  ur: { common: ur_common, onboarding: ur_onboarding, jobs: ur_jobs },
  as: { common: as_common, onboarding: as_onboarding, jobs: as_jobs },
  or: { common: or_common, onboarding: or_onboarding, jobs: or_jobs },
};

export const initI18n = async () => {
  const savedLanguage = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en';

  if (!i18n.isInitialized) {
    await i18n
      .use(initReactI18next)
      .init({
        resources,
        lng: savedLanguage,
        fallbackLng: 'en',
        ns: ['common', 'onboarding', 'jobs'],
        defaultNS: 'common',
        interpolation: {
          escapeValue: false,
        },
        react: {
          useSuspense: false,
        },
      });
  } else if (i18n.language !== savedLanguage) {
    await i18n.changeLanguage(savedLanguage);
  }
};

// Start initialization but don't block export
initI18n().catch(err => console.error('i18n init failed:', err));

export default i18n;
