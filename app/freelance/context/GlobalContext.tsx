import React, { createContext } from 'react';
import { Event, EventType, MonthEvent } from '../interfaces/types';

export type GlobalContextType = {
  monthIndex: any;
  setMonthIndex: any;
  smallCalendarMorth : any;
  setSmallCalendarMonth : any;
  daySelected :  any;
  setDaySelected : any;
  showEventModel : any;
  setShowEventModel : any;
  monthCalendar : any;
  dayCalendar : any;
  weekCalendar : any;
  setMonthCalendar : any;
  setDayCalendar: any,
  setWeekCalendar: any,
  availabilities: Event[];
  setAvailabilities: React.Dispatch<React.SetStateAction<Event[]>>;
  eventsDay: Event[];
  setEventsDay: React.Dispatch<React.SetStateAction<Event[]>>;
  eventsMonth: MonthEvent[];
  setEventsMonth: React.Dispatch<React.SetStateAction<MonthEvent[]>>;
  calendarPage : any;
  setCalendarPage : any;
  MonthID : number; 
  setMonthID : any;
  events : Event[];
  setEvents : React.Dispatch<React.SetStateAction<Event[]>>;

};

export const GlobalContext = createContext<GlobalContextType>({
  monthIndex: 0,
  setMonthIndex: () => {},
  smallCalendarMorth : 0,
  setSmallCalendarMonth : (index : any) => {},
  daySelected : null,
  setDaySelected : (day : any) => {},
  showEventModel : false,
  setShowEventModel : () => {},
  monthCalendar : true,
  dayCalendar : false,
  weekCalendar : false,
  calendarPage : false,
  setMonthCalendar : () => {},
  setDayCalendar : () => {},
  setWeekCalendar : () => {},
  setCalendarPage : () => {},
  availabilities: [],
  setAvailabilities: () => {},
  eventsDay: [],
  setEventsDay: () => {},
  eventsMonth: [],
  setEventsMonth: () => {},
  MonthID : 0,
  setMonthID : () => {},
  events :[],
  setEvents : () => {}
});