import { ISettings } from './interfaces';

// 0 Sunday
// 6 Saturday
// 1 Monday

const en: ISettings = {
  locale: 'en-US',
  firstWeekDay: 0,
  partOrder: 'm d y',
  partSeparator: '/',
  placeholder: {
    year: 'yyyy',
    month: 'mm',
    day: 'dd',
  },
  translations: {
    today: 'Today',
    clear: 'Clear',
  },
};

const bg: ISettings = {
  locale: 'bg-BG',
  firstWeekDay: 0,
  partOrder: 'd m y',
  partSeparator: '.',
  placeholder: {
    year: 'ГГГГ',
    month: 'MM',
    day: 'дд',
  },
  translations: {
    today: 'Днес',
    clear: 'Изчистване',
  },
};

const ar: ISettings = {
  locale: 'ar-AE',
  firstWeekDay: 6,
  partOrder: 'd m y',
  partSeparator: '/',
  placeholder: {
    year: '????',
    month: '??',
    day: '??',
  },
  translations: {
    today: 'اليوم',
    clear: 'صافي',
  },
};

const pl: ISettings = {
  locale: 'pl-PL',
  firstWeekDay: 1,
  partOrder: 'd m y',
  partSeparator: '.',
  placeholder: {
    year: 'rrrr',
    month: 'mm',
    day: 'dd',
  },
  translations: {
    today: 'Dzisiaj',
    clear: 'Wyczyść',
  },
};

export const settingsData: {
  [key: string]: ISettings;
} = {
  'en-us': en,
  en,
  'bg-bg': bg,
  bg,
  'ar-ae': ar,
  ar,
  'pl-pl': pl,
  pl,
};
