import { Dayjs } from "dayjs";


export interface formError {
  endDate : string
  startDate : string
  request : string
}

export interface Event {
    planingId: any;
    vehicleId: string,
    title: string;
    startDateTime: string;
    endDateTime: string;
    createdAt : string,
    updatedAt : string,
    departure : string;
    arrival : string
    state : string;
    nbPlace : number;
    tarif : number
    initialNbPlace : number;

}

export interface EventType {
    id: any;
    title: string;
    start: Dayjs;
    end: Dayjs;
    departure : string;
    arrival : string
    nbPlace : number;
    tarif : number
}

export interface MonthEvent {
    id: any;
    title: string;
    startDateTime: string;
    endDateTime: string;
    departure : string;
    arrival : string
    nbPlace : number;
    tarif : number
    initialNbPlace : number;
  }

export interface ContextWrapperProps {
    children: any;
  }

export type CalEventAction = {
    type: string;
    payload?: any;
  };