import { TimeType } from '../types';

export interface ITime {
  hour: string;
  minute: string;
  second?: string;
  type?: TimeType;
}
