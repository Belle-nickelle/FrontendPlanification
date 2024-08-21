
import React, { useState, useEffect, useContext, KeyboardEvent, FormEvent, use } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import Image from 'next/image';
import { GlobalContext } from '../context/GlobalContext';
import { Event } from '../interfaces/types';
import { getMonth } from '../utils/util';
import { formError } from '../interfaces/types';
import { CritereBuy, PercentLevel } from '../interfaces/types';
import CommonFom from '../forms/CommonFom';
import Alert from '../alerts/alert';



dayjs.extend(localizedFormat);

const MonthlyCalendar: React.FC = () => {

  const { eventsMonth, setEventsMonth } = useContext(GlobalContext);
  const { monthIndex, setMonthIndex } = useContext(GlobalContext);
  const { MonthID, setMonthID } = useContext(GlobalContext);
  const { events, setEvents } = useContext(GlobalContext);

  const [currentMonth, setCurrentMonth] = useState(getMonth());
  const [currentMonthIndex, setCurrentMonthIndex] = useState(dayjs().month());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [title, setTitle] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("")
  const [state, setState] = useState("")
  const [criterebuy, setCriterebuy] = useState<CritereBuy | null>(null)
  const [prixdecritere, setPrixdecritere] = useState<number | null>(null)
  const [prixtotal, setPrixtotal] = useState<number | null>(null)
  const [prixtotalreduit, setPrixtotalreduit] = useState<number | null>(null)
  const [percent, setPercent] = useState<number | null>(null)
  const driverId = "907b3dca-a29a-4b3e-961c-7d44c5e3d7d2"

  const [showForm, setShowForm] = useState<boolean>(false);

  const [errors, setErrors] = useState<formError>({
    endDate: '',
    startDate: ''
  })
  const [showAlert, setShowAlert] = useState(false);


  const handleClose = () => {
    setShowAlert(false);
    setErrors({
      endDate: '',
      startDate: ''
    })
  };


  //gestion du changement des mois et indice de mois
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

  const handleKeyPress = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      handleFormSubmit(e);
    }
  };

  //gestion de la sélection des évènements
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setTitle(event.title);
    setStartDate(event.startDateTime);
    setEndDate(event.endDateTime);
    setCriterebuy(event.criterebuy)
    setPrixtotal(event.prixtotal)
    setPrixdecritere(event.prixdecritere)
    setShowForm(true);
  };
/*
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPlaning();
    }, 500);

    return () => clearInterval(interval);
  }, [eventsMonth, events]);

  const fetchPlaning = async () => {
    try {
      const response = await fetch(`http://localhost:8080/planing/freelance/get-all/${driverId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        const data = await response.json();
        setEventsMonth(data);
        console.log(eventsMonth)
      } else {
        console.error('Erreur lors de la récupération des chauffeurs');
      }
    } catch (error) {
      console.error(error);
    }
  };
*/
  //gestion de la soumission du formulaire
  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title && startDate && criterebuy && prixtotal && prixdecritere && endDate && percent != null && prixtotalreduit) {

      const startDate1 = dayjs(startDate as string);
      const endDate1 = dayjs(endDate as string);
      const currentDate = dayjs().startOf('day')
      const start = dayjs(startDate).startOf('day')

      if (selectedEvent) {

        if (startDate1.isBefore(endDate1)) {

          if (currentDate.isBefore(start) || currentDate.isSame(start)) {
            setUpdatedAt(dayjs().format("YYYY-MM-DD HH:mm"))
            setCreatedAt(selectedEvent.createdAt)

            setEventsMonth(eventsMonth.map(ev => ev.PlaningId === selectedEvent.PlaningId ? {
              ...ev,
              title: title,
              startDateTime: startDate,
              endDateTime: endDate,
              createdAt: createdAt,
              updatedAt: updatedAt,
              state: state,
              criterebuy: criterebuy,
              prixdecritere: prixdecritere,
              prixtotal: prixtotal,
              percent: percent,
              prixtotalreduit: prixtotalreduit
            } : ev));

            try {
              const response = await fetch(`http://localhost:8080/planing/freelance/update/${selectedEvent.PlaningId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  title: title,
                  startDateTime: startDate,
                  endDateTime: endDate,
                  createdAt: createdAt,
                  updatedAt: updatedAt,
                  state: state,
                  criterebuy: criterebuy,
                  prixdecritere: prixdecritere,
                  prixtotal: prixtotal,
                  percent: percent,
                  prixtotalreduit: prixtotalreduit
                }),
              });

              if (response.ok) {
                setShowForm(false);
                setSelectedEvent(null)

                setTitle('');
                setStartDate('');
                setCreatedAt("")
                setUpdatedAt("")
                setEndDate('');
                setCriterebuy(null)
                setPrixdecritere(null)
                setPrixtotal(null)
                setPercent(null)
                setPrixtotalreduit(null)
              } else {
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  request: "erreur l'ors de l'envoi au serveur, peut etre un problème d'indisponibilité du serveur",
                }));
                setShowAlert(true);
              }
            } catch (error) {
              setErrors((prevErrors) => ({
                ...prevErrors,
                request: "erreur de connexion au serveur de base, peut etre un problène de panne du serveur",
              }));
              setShowAlert(true);
            }






            setSelectedEvent(null)

            //mise à jour après soumission
            setShowForm(false);
            setSelectedEvent(null)

            setTitle('');
            setStartDate('');
            setCreatedAt("")
            setUpdatedAt("")
            setEndDate('');
            setCriterebuy(null)
            setPrixdecritere(null)
            setPrixtotal(null)
            setPercent(null)
            setPrixtotalreduit(null)



          } else {
            setErrors((prevErrors) => ({
              ...prevErrors,
              startDate: "La date de debut doit etre après la date d'aujourd'hui ou etre la meme date",
            }));
            setShowAlert(true);
          }
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            endDate: "La date de fin doit être après la date de début",
          }));
          setShowAlert(true);
        }

      } else {
        if (startDate1.isBefore(endDate1)) {

          if (currentDate.isBefore(start) || currentDate.isSame(start)) {

            const val: number = MonthID
            setMonthID(val + 1)
            setEventsMonth([...eventsMonth, {
              PlaningId: MonthID,
              driverId : driverId,
              title: title,
              startDateTime: startDate,
              endDateTime: endDate,
              createdAt: createdAt,
              updatedAt: updatedAt,
              state: state,
              criterebuy: criterebuy,
              prixdecritere: prixdecritere,
              prixtotal: prixtotal,
              percent: percent,
              prixtotalreduit: prixtotalreduit
            }]);

            try {
              const response = await fetch('http://localhost:8080/planing/freelance/add', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  title: title,
                  driverId : driverId,
                  startDateTime: startDate,
                  endDateTime: endDate,
                  createdAt: createdAt,
                  updatedAt: updatedAt,
                  state: state,
                  criterebuy: criterebuy,
                  prixdecritere: prixdecritere,
                  prixtotal: prixtotal,
                  percent: percent,
                  prixtotalreduit: prixtotalreduit
                }),
              });

              if (response.ok) {
                setShowForm(false);
                setSelectedEvent(null)

                setTitle('');
                setStartDate('');
                setCreatedAt("")
                setUpdatedAt("")
                setEndDate('');
                setCriterebuy(null)
                setPrixdecritere(null)
                setPrixtotal(null)
                setPercent(null)
                setPrixtotalreduit(null)
              } else {
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  request: "erreur l'ors de l'envoi au serveur, peut etre un problème d'indisponibilité du serveur",
                }));
                setShowAlert(true);
              }
            } catch (error) {
              setErrors((prevErrors) => ({
                ...prevErrors,
                request: "erreur de connexion au serveur de base, peut etre un problène de panne du serveur",
              }));
              setShowAlert(true);
            }

            //mise à jour après soumission
            setShowForm(false);
            setSelectedEvent(null)

            setTitle('');
            setStartDate('');
            setCreatedAt("")
            setUpdatedAt("")
            setEndDate('');
            setCriterebuy(null)
            setPrixdecritere(null)
            setPrixtotal(null)
            setPercent(null)
            setPrixtotalreduit(null)
          } else {
            setErrors((prevErrors) => ({
              ...prevErrors,
              startDate: "La date de debut doit etre après la date d'aujourd'hui ou etre la meme date",
            }));
            setShowAlert(true);
          }
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            endDate: "La date de fin doit être après la date de début",
          }));
          setShowAlert(true);
        }


      }

    }
  };

  //gestion de l'annulation d'une modification, d'un ajout ou d'une suppression d'un évènement
  const handleCancel = () => {
    setShowForm(false);
    setSelectedEvent(null);
    setTitle('');
    setStartDate('');
    setCreatedAt("")
    setUpdatedAt("")
    setEndDate('');
    setCriterebuy(null)
    setPrixdecritere(null)
    setPrixtotal(null)
    setPercent(null)
    setPrixtotalreduit(null)
  }
  const handleDelete1 = async (id: any) => {

    try {
      const response = await fetch(`http://localhost:8080/planing/freelance/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        setShowForm(false);
        setSelectedEvent(null);
        setTitle('');
        setStartDate('');
        setCreatedAt("")
        setUpdatedAt("")
        setEndDate('');
        setCriterebuy(null)
        setPrixdecritere(null)
        setPrixtotal(null)
        setPercent(null)
        setPrixtotalreduit(null)
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          request: "erreur l'ors de l'envoi au serveur, peut etre un problème d'indisponibilité du serveur",
        }));
        setShowAlert(true);
      }
    } catch (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        request: "erreur de connexion au serveur de base, peut etre un problène de panne du serveur",
      }));
      setShowAlert(true);
    }

    //setEventsMonth(eventsMonth.filter(ev => ev.id !== id));

  };


  //gestion de la suppression d'un évènement
  const handleDelete = (id: any) => {
    setEventsMonth(eventsMonth.filter(ev => ev.PlaningId !== id));
    setShowForm(false);
    setSelectedEvent(null)
    setTitle('');
    setStartDate('');
    setCreatedAt("")
    setUpdatedAt("")
    setEndDate('');
    setCriterebuy(null)
    setPrixdecritere(null)
    setPrixtotal(null)
    setPercent(null)
    setPrixtotalreduit(null)
  };
  // definition des couleurs des évènements
  const colors = [
    'bg-[#A55F98]',
    'bg-[#470A3B]',
    'bg-[#E329BF]',
    'bg-[#255385]',
    'bg-[#434F5B]',
    'bg-[#4175AC] ',
    'bg-[#246638]',
    'bg-[#2F4C38]',
    'bg-[#775521] ',
    'bg-[#A6895C]',
    "bg-[#BFB538]",
    "bg-[#3D3908]",
    "bg-[#6F1723]",
    "bg-[#34495E] ",
    "bg-[#D4AC0D] ",
    "bg-[#8C168A]",
    "bg-[#6F1723]",
    "bg-[#108991]"
  ];

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
  const getEventsForDate = (date: string) => {
    return eventsMonth.flatMap((event, index) => {
      const eventDays = getEventDaysBetween(event);
      if (eventDays.includes(date)) {
        return [
          {
            ...event,
            colorClass: colors[index % colors.length],
          },
        ];
      }
      return [];
    });
  };

  useEffect(() => {
    if (prixdecritere && startDate && endDate && percent != null) {
      if (criterebuy === CritereBuy.HEURE) {
        const total = ((dayjs(endDate).diff(startDate) / 3600000) * prixdecritere).toFixed(2);
        setPrixtotal(parseFloat(total))
        if (prixtotal) {
          setPrixtotalreduit(parseFloat((prixtotal - prixtotal * (percent / 100)).toFixed(2)));
          console.log(prixtotalreduit)
          console.log(percent)
        }

      } else if (criterebuy === CritereBuy.JOUR) {
        const total = (((dayjs(endDate).diff(startDate) / 3600000) / 24) * prixdecritere).toFixed(2);
        setPrixtotal(parseFloat(total))
        if (prixtotal) {
          setPrixtotalreduit(parseFloat((prixtotal - prixtotal * (percent / 100)).toFixed(2)));
        }
      } else if (criterebuy === CritereBuy.FORFAITAIRE) {
        setPrixtotal(prixdecritere);
        if (prixtotal) {
          setPrixtotalreduit(parseFloat((prixtotal - prixtotal * (percent / 100)).toFixed(2)));
        }
      }
    }
  }, [prixdecritere, prixtotal, startDate, endDate, criterebuy, percent, prixtotalreduit]);



  return (
    <div className='flex-1' >
      <div className="p-4">
        <div className="flex justify-between mb-4">
          <button onClick={handlePrevMonth} className="px-4 py-2 bg-secondary text-white rounded">
            <span className="cursor-pointer text-blue-600 mx-2">
              <Image
                src="/images/chevron-gg.svg"
                alt="chevron"
                width={25}
                height={25}
                priority
              />
            </span>
          </button>
          <h2 className="text-xl font-bold">{dayjs(new Date(dayjs().year(), currentMonthIndex)).format(
            "MMMM YYYY"
          )}</h2>
          <button onClick={handleNextMonth} className="px-4 py-2 bg-secondary text-white rounded">
            <span className="cursor-pointer text-blue-600 mx-2">
              <Image
                src="/images/chevron-dd.svg"
                alt="chevron"
                width={25}
                height={25}
                priority
              />
            </span>
          </button>
        </div>
        <div className='flex-1 grid grid-cols-7 grid-rows-5'>

          {currentMonth[0].map((day: any, i: any) => (
            <span key={i} className="text-sm py-1 text-center">
              {day.format('dd').charAt(0)}
            </span>

          ))}

          {currentMonth.map((row: any, i: any) => (
            <React.Fragment key={i}>
              {row.map((day: any, index: any) => (

                <div
                  className={`border p-2 h-24}`}
                >
                  <h3
                    className={`w-8 h-8 flex items-center justify-center text-sm font-bold rounded-full transition-colors duration-300 ${day.isSame(dayjs(), 'day')
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                  >
                    {day.format("D")}
                  </h3>

                  <ul>
                    {getEventsForDate(day.format('YYYY-MM-DD')).map((event, index) => (
                      <li
                        key={index}
                        className={` p-1 rounded mb-1 cursor-pointer group ${event.colorClass}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEventClick(event);
                        }}
                      >

                        <button
                          className="flex items-center w-full  hover:bg-blue-300 group-hover:bg-blue-300"
                        >
                          <span className="mr-2.5 text-white font-bold flex-0 group-hover:flex-1">
                            {event.title}
                          </span>
                          <span>▶</span>
                        </button>

                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
        <button
          className="fixed bottom-4 right-4 bg-primary text-white h-14 flex items-center justify-center hover:shadow-2xl hover:shadow-planing"
          onClick={() => setShowForm(true)}
        ><span className="cursor-pointer text-white mx-2">
            AJOUTER UNE DISPONIBILITE
          </span>
        </button>
        {showForm &&
          <CommonFom
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setCriterebuy={setCriterebuy}
            criterebuy={criterebuy}
            setPercent={setPercent}
            percent={percent}
            setPrixtotal={setPrixtotal}
            prixtotal={prixtotal}
            prixtotalreduit={prixtotalreduit}
            title={title}
            prixdecritere={prixdecritere}
            setPrixdecritere={setPrixdecritere}
            setTitle={setTitle}

            handleCancel={handleCancel}
            handleDelete={handleDelete}
            selectedEvent={selectedEvent}
            handleKeyPress={handleKeyPress}
            handleFormSubmit={handleFormSubmit}

          />
        }
      </div>
      <div>
        {showAlert && (
          <Alert
            errors={errors}
            handleClose={handleClose}
          />
        )}

      </div>
    </div>
  );
};

export default MonthlyCalendar;
