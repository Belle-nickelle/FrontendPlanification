import React, { useContext } from 'react';
import Image from 'next/image';
import { GlobalContext } from './context/GlobalContext';
import dayjs from 'dayjs';

export default function CalendarHeader() {

  const { monthIndex, setMonthIndex } = useContext(GlobalContext);
  const {calendarPage, setCalendarPage} = useContext(GlobalContext)

  const { dayCalendar, setDayCalendar } = useContext(GlobalContext);
  const { monthCalendar, setMonthCalendar } = useContext(GlobalContext);
  const {weekCalendar, setWeekCalendar} = useContext(GlobalContext);

  function handlePrevMonth() {
    setMonthIndex(monthIndex - 1);
  }

  function handleNextMonth() {
    setMonthIndex(monthIndex + 1);
  }

  function handleReset() {
    setMonthIndex(
      monthIndex === dayjs().month()
        ? monthIndex + Math.random()
        : dayjs().month()
    );
  }

  return (
    <header className="px-4 py-2 flex items-center justify-between">
      <div className="flex items-center">
        <Image
          src="/images/calendar.svg"
          alt="Image Google"
          width={50}
          height={50}
          priority
        />
        <h1 className="mr-10 text-xl text-gray-500 font-bold">Plan ▶</h1>
        <button
          className="border rounded py-2 px-4 mr-5"
          onClick={handleReset}
        >
          Au jourd'hui
        </button>
        <button onClick={handlePrevMonth}>
          <span className="cursor-pointer text-blue-600 mx-2">
            <Image
              src="/images/chevron-g.svg"
              alt="chevron"
              width={25}
              height={25}
              priority
            />
          </span>
        </button>
        <button onClick={handleNextMonth}>
          <span className="cursor-pointer text-blue-600 mx-2">
            <Image
              src="/images/chevron-d.svg"
              alt="chevron"
              width={25}
              height={25}
              priority
            />
          </span>
        </button>
        <h2 className="ml-4 text-xl text-gray-500 font-bold">
          {dayjs(new Date(dayjs().year(), monthIndex)).format("MMMM YYYY")}
        </h2>
      </div>
      <div className="flex items-center">
      <button
          className={`border rounded py-2 px-4 mr-2 ${
            dayCalendar ? 'bg-primary text-white' : ''
          }`}
          onClick={() => {
            setMonthCalendar(false);
            setWeekCalendar(false);
            setCalendarPage(false)
            setDayCalendar(true);
          }}
        >
          JOUR
        </button>
      <button
          className={`border rounded py-2 px-4 mr-2 ${
            weekCalendar ? 'bg-primary text-white' : ''
          }`}
          onClick={() => {
            setDayCalendar(false);
            setMonthCalendar(false);
            setCalendarPage(false)
            setWeekCalendar(true)
          }}
        > 
          SEMAINE
        </button>
       
        <button
          className={`border rounded py-2 px-4 mr-2 ${
            monthCalendar ? 'bg-primary text-white' : ''
          }`}
          onClick={() => {
            setDayCalendar(false);
            setWeekCalendar(false)
            setCalendarPage(false)
            setMonthCalendar(true);
          }}
        >
          MOIS
        </button>
        <button
          className={`border rounded py-2 px-4 mr-2 ${
            calendarPage ? 'bg-primary text-white' : ''
          }`}
          onClick={() => {
            setDayCalendar(false);
            setWeekCalendar(false)
            setMonthCalendar(false);
            setCalendarPage(true)
          }}
        >
          PLANIFICATION
        </button>
      </div>
    </header>
  );
}











