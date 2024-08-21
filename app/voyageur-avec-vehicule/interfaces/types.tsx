import { Dayjs } from "dayjs";

export interface formError {
  endDate: string
  startDate: string
  request: string
}

export enum CritereBuy {
  HEURE = "par heure",
  JOUR = "par jour",
  FORFAITAIRE = "par forfait"
}

export interface Event {
  AnounceId: any,
  title: string;
  startDateTime: string;
  endDateTime: string;
  createdAt: string,
  updatedAt: string,
  departure: string;
  arrival: string,
  state: boolean,
  criterebuy: CritereBuy;
  prixdecritere: number;
  prixtotal: number;
}

export interface EventType {
  id: number;
  title: string;
  start: Dayjs;
  end: Dayjs;
  departure: string;
  arrival: string
}

export interface MonthEvent {
  AnounceId: any,
  title: string;
  startDateTime: string;
  endDateTime: string;
  createdAt: string,
  updatedAt: string,
  departure: string;
  arrival: string,
  state: boolean,
  criterebuy: CritereBuy;
  prixdecritere: number;
  prixtotal: number;
}

export interface ContextWrapperProps {
  children: any;
}

export type CalEventAction = {
  type: string;
  payload?: any;
};