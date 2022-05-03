export interface ISettings {
  locale: string;
  firstWeekDay: number;
  partOrder: 'm d y' | 'd m y' | 'y m d' | 'y d m';
  partSeparator: '/' | '-' | '.';
  placeholder: {
    year: string;
    month: string;
    day: string;
  };
  translations: {
    today: string;
    clear: string;
  };
}
