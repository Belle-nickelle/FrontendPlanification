import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import { getMonth } from "./utils/util";
import Image from "next/image";
import { GlobalContext } from "./context/GlobalContext";
import { Dayjs } from "dayjs";
import { Event } from "./interfaces/types";
export default function SmallCalendar() {

  const [currentMonth, setCurrentMonth] = useState(getMonth());
  const [currentMonthIndex, setCurrentMonthIndex] = useState(dayjs().month());
  const { monthIndex, setMonthIndex } = useContext(GlobalContext);
  const { setSmallCalendarMonth, setDaySelected, daySelected } = useContext(GlobalContext)
  const { eventsMonth, setEventsMonth } = useContext(GlobalContext);



  useEffect(() => {
    setCurrentMonth(getMonth(currentMonthIndex));
  }, [currentMonthIndex]);


  useEffect(() => {
    setCurrentMonthIndex(monthIndex)
  }, [monthIndex])

  function handlePrevMonth() {
    setCurrentMonthIndex(currentMonthIndex - 1)
    setMonthIndex(monthIndex - 1);
  }

  function handleNextMonth() {
    setCurrentMonthIndex(currentMonthIndex + 1)
    setMonthIndex(monthIndex + 1);
  }

  function getDayclass(day: any) {
    const format = "DD-MM-YY"
    const nowDay = dayjs().format(format)
    const currentDay = day.format(format)
    const slctDay = daySelected && daySelected.format(format)
    if (nowDay === currentDay) {
      return "bg-blue-500 rounded-full text-white"
    } else if (currentDay == slctDay) {
      return "bg-blue-100 rounded-full text-blue-600 font-bold"
    } else {
      return ""
    }
  }

  //recuperation de jour les jours associés à un évènement donné 
  const getEventDaysBetween = (event: Event): string[] => {

    const start: Dayjs = dayjs(event.startDateTime);
    const end: Dayjs = dayjs(event.endDateTime);
    const days: string[] = [];

    let currentDay: Dayjs = start.clone();
    while (currentDay.isBefore(end, 'day') || currentDay.isSame(end, 'day')) {
      days.push(currentDay.format('YYYY-MM-DD'));
      currentDay = currentDay.add(1, 'day');
    }

    return days;
  };

  //recuperation des évènements associés à un jour donné
  const getEventsForDate = (day: string) => {
    return eventsMonth.some((event) => {
      const eventDays = getEventDaysBetween(event);
      return eventDays.includes(day);
    });
  };

  function getDayClassNames(day : string) {

    let classNames = "";

    const result = getEventsForDate(day)

    if (result) {
      classNames += "bg-pink-500 rounded-full text-white"; 
    }
    return classNames
  }


  return (
    <div className="mt-9">
      <header className="flex justify-between">

        <p className=" text-gray-500 font-bold">
          {dayjs(new Date(dayjs().year(), currentMonthIndex)).format(
            "MMMM YYYY"
          )}
        </p>

        <div>
          <button
            onClick={handlePrevMonth}
          >
            <span className="cursor-pointer text-blue-600 m-x2">
              <Image
                src="/images/chevron-g.svg"
                alt="chevron"
                width={25}
                height={25}
                priority
              />
            </span>
          </button>
          <button
            onClick={handleNextMonth}
          >
            <span className="cursor-pointer text-blue-600 m-x2">
              <Image
                src="/images/chevron-d.svg"
                alt="chevron"
                width={25}
                height={25}
                priority
              />
            </span>
          </button>
        </div>

      </header>

      <div className="grid grid-cols-7 grid-rows-6">
        {currentMonth[0].map((day: any, i: any) => (
          <span key={i} className="text-sm py-1 text-center">
            {day.format('dd').charAt(0)}
          </span>

        ))}
        {currentMonth.map((row: any, i: any) => (
          <React.Fragment key={i}>
            {row.map((day: any, index: any) => (
              <button
                className={`py-1 w-full ${getDayclass(day)} ${getDayClassNames(day.format('YYYY-MM-DD'))} `}
              >
                <span className="text-sm">
                  {day.format("D")}
                </span>
              </button>
            ))}
          </React.Fragment>
        ))}

      </div>

    </div>
  );
}