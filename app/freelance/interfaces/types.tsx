import { Dayjs } from "dayjs";

export interface formError {
  endDate : string
  startDate : string
}

export enum CritereBuy{
  HEURE = "par heure",
  JOUR = "par jour",
  FORFAITAIRE = "par forfait"
}

export enum PercentLevel {
  Zero = "0",
  Three = "3",
  Five = "5",
  Seven = "7",
  Ten = "10"
}

export interface Event {
    PlaningId: any;
    title: string;
    driverId : string;
    startDateTime: string;
    endDateTime: string;
    createdAt : string;
    updatedAt : string;
    state : string;
    criterebuy : CritereBuy;
    prixdecritere : number;
    prixtotal : number;
    percent : number 
    prixtotalreduit : number;
}

export interface EventType {
    id: number;
    title: string;
    start: Dayjs;
    end: Dayjs;
    tarif : number
}

export interface MonthEvent {
  PlaningId: any;
  title: string;
  driverId : string
  startDateTime: string;
  endDateTime: string;
  createdAt : string;
  updatedAt : string;
  state : string;
  criterebuy : CritereBuy;
  prixdecritere : number;
  prixtotal : number
  percent : number
  prixtotalreduit : number;
  
  }

export interface ContextWrapperProps {
    children: any;
  }

export type CalEventAction = {
    type: string;
    payload?: any;
  };