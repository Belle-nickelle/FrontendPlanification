import React, { ReactNode, useEffect, useState } from 'react';
import { GlobalContext, GlobalContextType } from './GlobalContext';
import dayjs, {Dayjs} from 'dayjs';


import { Event, MonthEvent, ContextWrapperProps } from '../interfaces/types';






const ContextWrapper: React.FC<ContextWrapperProps> = ({ children }) => {

  const [monthIndex, setMonthIndex] = useState(dayjs().month());
  const [smallCalendarMorth, setSmallCalendarMonth] = useState(null);
  const [daySelected, setDaySelected] = useState(null);
  const [showEventModel, setShowEventModel] = useState(null);
  const [dayCalendar, setDayCalendar] = useState(false);
  const [monthCalendar, setMonthCalendar] = useState(true);
  const [calendarPage, setCalendarPage] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [MonthID, setMonthID] = useState(0);
  const [weekCalendar, setWeekCalendar] = useState(null);
  const [availabilities, setAvailabilities] = useState<Event[]>([]);
  const [eventsDay, setEventsDay] = useState<Event[]>([]);
  const [eventsMonth, setEventsMonth] = useState<MonthEvent[]>([]);
  
  const value: GlobalContextType = {
    monthIndex,
    setMonthIndex,
    smallCalendarMorth,
    setSmallCalendarMonth,
    daySelected,
    setDaySelected,
    showEventModel,
    setShowEventModel,
    setMonthCalendar,
    setDayCalendar,
    setWeekCalendar,
    dayCalendar,
    monthCalendar,
    weekCalendar,
    availabilities,
    setAvailabilities,
    eventsDay,
    setEventsDay,
    setEventsMonth,
    eventsMonth,
    calendarPage,
    setCalendarPage,
    MonthID, 
    setMonthID,
    events,
    setEvents
  };

  useEffect(() => {
    if (smallCalendarMorth != null) {
      setMonthIndex(smallCalendarMorth)
    }
  }, [smallCalendarMorth])

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
};

export default ContextWrapper;
