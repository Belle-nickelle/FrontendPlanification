
import React, { useState, useEffect, useContext, KeyboardEvent, FormEvent } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import Image from 'next/image';
import { GlobalContext } from '../context/GlobalContext';
import { Event } from '../interfaces/types';
import { getMonth } from '../utils/util';
import { ConfortLevel, CritereBuy } from '../interfaces/types';
import { formError } from '../interfaces/types';
import CommonFom from '../forms/CommonFom';
import Alert from '../alerts/alert';


dayjs.extend(localizedFormat);

const MonthlyCalendar: React.FC = () => {


  const { eventsMonth, setEventsMonth } = useContext(GlobalContext);
  const { monthIndex, setMonthIndex } = useContext(GlobalContext);
  const { MonthID, setMonthID } = useContext(GlobalContext);
  const { events, setEvents } = useContext(GlobalContext);


  const [title, setTitle] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("")
  const [state, setState] = useState("")
  const [departure, setDeparture] = useState<string>('')
  const [arrival, setArrival] = useState<string>('')
  const [criterebuy, setCriterebuy] = useState<CritereBuy | null>(null)
  const [prixdecritere, setPrixdecritere] = useState<number | null>(null)
  const [prixtotal, setPrixtotal] = useState<number | null>(null)
  const [confort, setConfort] = useState<ConfortLevel | null>(null);

  const [currentMonth, setCurrentMonth] = useState(getMonth());
  const [currentMonthIndex, setCurrentMonthIndex] = useState(dayjs().month());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const clientId = "36c4179e-935b-43d2-bed1-568953684cde"

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
    setDeparture(event.departure)
    setArrival(event.arrival)
    setConfort(event.confort)
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
      const response = await fetch(`http://localhost:8080/anouncement/simpe/get-all/${clientId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        const data = await response.json();
        setEventsMonth(data);
      } else {
        console.error('Erreur lors de la récupération');
      }
    } catch (error) {
      console.error(error);
    }
  };
*/

  //gestion de la soumission du formulaire
  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (criterebuy && startDate && prixdecritere && prixtotal && endDate && arrival && departure && confort) {


      const startDate1 = dayjs(startDate as string);
      const endDate1 = dayjs(endDate as string);
      const currentDate = dayjs().startOf('day')
      const start = dayjs(startDate).startOf('day')

      setTitle(`${departure}- ${arrival}`)
      if (selectedEvent) {

        if (startDate1.isBefore(endDate1)) {

          if (currentDate.isBefore(start) || currentDate.isSame(start)) {

            setUpdatedAt(dayjs().format("YYYY-MM-DD HH:mm"))
            setCreatedAt(selectedEvent.createdAt)
            setTitle(`${departure} - ${arrival}`)

            setEventsMonth(eventsMonth.map(ev => ev.clientId === selectedEvent.clientId ? {
              ...ev,
              title: title,
              startDateTime: startDate,
              endDateTime: endDate,
              createdAt: createdAt,
              updatedAt: updatedAt,
              state: state,
              departure: departure,
              arrival: arrival,
              criterebuy: criterebuy,
              prixdecritere: prixdecritere,
              prixtotal: prixtotal,
              confort: confort,
            } : ev));

          

            try {
              const response = await fetch(`http://localhost:8080/anouncement/simple/update/${selectedEvent.announcementId}`, {
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
                  departure: departure,
                  arrival: arrival,
                  criterebuy: criterebuy,
                  prixdecritere: prixdecritere,
                  prixtotal: prixtotal,
                  confort: confort,
                }),
              });

              if (response.ok) {
                setSelectedEvent(null)

                setShowForm(false);
                setSelectedEvent(null)

                setTitle('');
                setStartDate('');
                setConfort(null)
                setCreatedAt("")
                setUpdatedAt("")
                setEndDate('');
                setDeparture('')
                setArrival('')
                setConfort(null)
                setCriterebuy(null)
                setPrixdecritere(null)
                setPrixtotal(null)
              } else {
                setErrors((prevErrors) => ({
                  ...prevErrors,
                  request: "erreur mince! de l'envoi au serveur, peut etre un problème d'indisponibilité du serveur",
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

            setShowForm(false);
            setSelectedEvent(null)

            setTitle('');
            setStartDate('');
            setConfort(null)
            setCreatedAt("")
            setUpdatedAt("")
            setEndDate('');
            setDeparture('')
            setArrival('')
            setConfort(null)
            setCriterebuy(null)
            setPrixdecritere(null)
            setPrixtotal(null)
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

            setUpdatedAt(dayjs().format("YYYY-MM-DD HH:mm"))
            setCreatedAt(dayjs().format("YYYY-MM-DD HH:mm"))
            setTitle(`${departure} - ${arrival}`)

            const val: number = MonthID
            setMonthID(val + 1);
            setEventsMonth([...eventsMonth, {
              announcementId: MonthID,
              clientId : clientId,
              title: title,
              startDateTime: startDate,
              endDateTime: endDate,
              createdAt: createdAt,
              updatedAt: updatedAt,
              state: state,
              departure: departure,
              arrival: arrival,
              criterebuy: criterebuy,
              prixdecritere: prixdecritere,
              prixtotal: prixtotal,
              confort: confort,
            }]);

            try {
              const response = await fetch('http://localhost:8080/anouncement/simple/add', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  title: title,
                  clientId : clientId,
                  startDateTime: startDate,
                  endDateTime: endDate,
                  createdAt: createdAt,
                  updatedAt: updatedAt,
                  state: state,
                  departure: departure,
                  arrival: arrival,
                  criterebuy: criterebuy,
                  prixdecritere: prixdecritere,
                  prixtotal: prixtotal,
                  confort: confort,
                }),
              });

              if (response.ok) {
                setSelectedEvent(null)

                setShowForm(false);
                setSelectedEvent(null)

                setTitle('');
                setStartDate('');
                setConfort(null)
                setCreatedAt("")
                setUpdatedAt("")
                setEndDate('');
                setDeparture('')
                setArrival('')
                setConfort(null)
                setCriterebuy(null)
                setPrixdecritere(null)
                setPrixtotal(null)
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
            setConfort(null)
            setCreatedAt("")
            setUpdatedAt("")
            setEndDate('');
            setDeparture('')
            setArrival('')
            setConfort(null)
            setCriterebuy(null)
            setPrixdecritere(null)
            setPrixtotal(null)
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
    setConfort(null)
    setCreatedAt("")
    setUpdatedAt("")
    setEndDate('');
    setDeparture('')
    setArrival('')
    setConfort(null)
    setCriterebuy(null)
    setPrixdecritere(null)
    setPrixtotal(null)
  }
  
  const handleDelete1 = async (id: any) => {
    try {
      const response = await fetch(`http://localhost:8080/anouncement/simple/delete/${id}`, {
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
        setConfort(null)
        setCreatedAt("")
        setUpdatedAt("")
        setEndDate('');
        setDeparture('')
        setArrival('')
        setConfort(null)
        setCriterebuy(null)
        setPrixdecritere(null)
        setPrixtotal(null)
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          request: "erreur l'ors de lors de la suppression de l'enregistrement, peut etre un problème d'indisponibilité du serveur",
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
    setEventsMonth(eventsMonth.filter(ev => ev.announcementId !== id));
    setShowForm(false);
    setSelectedEvent(null)
    setTitle('');
    setStartDate('');
    setConfort(null)
    setCreatedAt("")
    setUpdatedAt("")
    setEndDate('');
    setDeparture('')
    setArrival('')
    setConfort(null)
    setCriterebuy(null)
    setPrixdecritere(null)
    setPrixtotal(null)
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

  useEffect(() => {
    if (departure && arrival) {
      setTitle(`${departure} - ${arrival}`);
    } else {
      setTitle('');
    }
  }, [departure, arrival]);

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
    if (prixdecritere && startDate && endDate) {
      if (criterebuy === CritereBuy.HEURE) {
        const total = ((dayjs(endDate).diff(startDate) / 3600000) * prixdecritere).toFixed(2);
        setPrixtotal(parseFloat(total))
      } else if (criterebuy === CritereBuy.JOUR) {
        const total = (((dayjs(endDate).diff(startDate) / 3600000) / 24) * prixdecritere).toFixed(2);
        setPrixtotal(parseFloat(total))
      } else if (criterebuy === CritereBuy.FORFAITAIRE) {
        setPrixtotal(prixdecritere);
      }

    }
  }, [prixdecritere, startDate, endDate, criterebuy]);


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
                          <span className="text-white font-bold mr-2.5 flex-0 group-hover:flex-1">
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
            departure={departure}
            setDeparture={setDeparture}
            arrival={arrival}
            setArrival={setArrival}
            confort={confort}
            setConfort={setConfort}
            prixdecritere={prixdecritere}
            setPrixdecritere={setPrixdecritere}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            prixtotal={prixtotal}
            setPrixtotal={setPrixtotal}
            criterebuy={criterebuy}
            setCriterebuy={setCriterebuy}

            handleCancel={handleCancel}
            handleFormSubmit={handleFormSubmit}
            handleKeyPress={handleKeyPress}
            selectedEvent={selectedEvent}
            handleDelete={handleDelete}
          />
        }
      </div>
      <div>
        {showAlert &&
          <Alert
            handleClose={handleClose}
            errors={errors}
          />
        }

      </div>
    </div>
  );
};

export default MonthlyCalendar;

