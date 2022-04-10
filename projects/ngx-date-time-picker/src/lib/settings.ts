import { settingsData } from './settings-data';
import { ISettings } from './interfaces';

export const getSettings = (locale: string): ISettings => {
  const data = settingsData[locale.toLowerCase()];
  return data !== undefined
    ? data
    : {
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
          weekDays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
          monthsLong: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ],
          monthsShort: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ],
          today: 'Today',
          clear: 'Clear',
        },
      };
};
