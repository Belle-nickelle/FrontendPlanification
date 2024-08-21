import { Dayjs } from "dayjs";

export enum ConfortLevel {
  VIP = 'VIP',
  CLASS = 'CLASSIQUE',
}

export enum CritereBuy{
  HEURE = "par heure",
  JOUR = "par jour",
  FORFAITAIRE = "par forfait"
}

export interface formError {
  endDate : string
  startDate : string
}

export interface Event {
  announcementId: any;
  clientId : string
  title: string;
  startDateTime: string;
  endDateTime: string;
  createdAt : string;
  updatedAt : string;
  state : string;
  departure: string;
  arrival: string;
  criterebuy : CritereBuy;
  prixdecritere : number;
  prixtotal : number;
  confort: ConfortLevel;
}


export interface EventType {
  id: number;
  title: string;
  start: Dayjs;
  end: Dayjs;
  departure: string;
  arrival: string,
  confort: ConfortLevel
}

export interface MonthEvent {
  announcementId: any;
  clientId : string
  title: string;
  startDateTime: string;
  endDateTime: string;
  createdAt : string;
  updatedAt : string;
  state : string;
  departure: string;
  arrival: string;
  criterebuy : CritereBuy;
  prixdecritere : number;
  prixtotal : number;
  confort: ConfortLevel;
}

export interface ContextWrapperProps {
  children: any;
}

export type CalEventAction = {
  type: string;
  payload?: any;
};