
import React, { useState, useEffect, useContext, KeyboardEvent, FormEvent } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import Image from 'next/image';
import { GlobalContext } from '../context/GlobalContext';
import { Event } from '../interfaces/types';
import { getMonth } from '../utils/util';
import { formError } from '../interfaces/types';
import { CritereBuy } from '../interfaces/types';
import Alert from '../alerts/alert';
import CommonFom from '../forms/CommonFom';


dayjs.extend(localizedFormat);

const MonthlyCalendar: React.FC = () => {

  //definition des variable de context global
  const { eventsMonth, setEventsMonth } = useContext(GlobalContext);
  const { monthIndex, setMonthIndex } = useContext(GlobalContext);
  //const { MonthID, setMonthID } = useContext(GlobalContext);

  const [currentMonth, setCurrentMonth] = useState(getMonth());
  const [currentMonthIndex, setCurrentMonthIndex] = useState(dayjs().month());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { events, setEvents } = useContext(GlobalContext);

  const [createdAt, setCreatedAt] = useState("")
  const [updatedAt, setUpdateAt] = useState("")
  const [state, setState] = useState("AVAILABLE")
  const [criterebuy, setCriterebuy] = useState<CritereBuy | null>(null)
  const [prixdecritere, setPrixdecritere] = useState<number | null>(null)
  const [prixtotal, setPrixtotal] = useState<number | null>(null)


  //definition des données de formulaire
  const [title, setTitle] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [departure, setDeparture] = useState<string>('')
  const [arrival, setArrival] = useState<string>('')
  const travelerId = "36c4179e-935b-43d2-bed1-568953684cde"

  //definition des l'element des gestion des erreur
  const [errors, setErrors] = useState<formError>({
    endDate: '',
    startDate: '',
    request: ''
  })
  const [showAlert, setShowAlert] = useState(false);

  //rafraichissement du conteneur des erreurs
  const handleClose = () => {
    setShowAlert(false);
    setErrors({
      endDate: '',
      startDate: '',
      request: ''
    })
  };

  //gestion du changement des mois et indice de mois
  useEffect(() => {
    setCurrentMonth(getMonth(currentMonthIndex));
  }, [currentMonthIndex]);

  //gestion de l'index du mois
  useEffect(() => {
    setCurrentMonthIndex(monthIndex)
  }, [monthIndex])

  //gestion de changement des mois vers le mois precedant
  function handlePrevMonth() {
    setCurrentMonthIndex(currentMonthIndex - 1)
    setMonthIndex(monthIndex - 1);
  }

  //gestion de changement de mois vers le moi suivant
  function handleNextMonth() {
    setCurrentMonthIndex(currentMonthIndex + 1)
    setMonthIndex(monthIndex + 1);
  }

  //gestion des la validation des formulaire par la touche entrée du clavier
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
    setCriterebuy(event.criterebuy)
    setPrixtotal(event.prixtotal)
    setPrixdecritere(event.prixdecritere)
    setArrival(event.arrival)
    setShowForm(true);
  };

  //recuperation des informations sur tous les planing d'un chauffeur
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPlaning();
    }, 500);

    return () => clearInterval(interval);
  }, [eventsMonth, events]);

  const fetchPlaning = async () => {
    try {
      const response = await fetch(`http://localhost:8080/anouncement/with-car/get-all/${travelerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (response.ok) {
        const data = await response.json();
        setEventsMonth(data);
      } else {
        console.error('Erreur lors de la récupération des chauffeurs');
      }
    } catch (error) {
      console.error(error);
    }
  };

  //gestion de la soumission du formulaire
  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title && startDate && endDate && criterebuy && prixdecritere && prixtotal && arrival && departure) {

      const startDate1 = dayjs(startDate as string);
      const endDate1 = dayjs(endDate as string);
      const currentDate = dayjs().startOf('day')
      const start = dayjs(startDate).startOf('day')

      //gestion dans le cas des modification de planing deja existant
      if (selectedEvent) {

        if (startDate1.isBefore(endDate1)) {

          if (currentDate.isBefore(start) || currentDate.isSame(start)) {
            setTitle(`${departure} - ${arrival}`)

            //setEventsMonth(eventsMonth.map(ev => ev.id === selectedEvent.id ? { ...ev, title, startDateTime, endDateTime, departure, arrival } : ev));
            setUpdateAt(dayjs().format("YYYY/MM/DD HH"))
            setCreatedAt(selectedEvent.createdAt)

            try {
              const response = await fetch(`http://localhost:8080/anouncement/with-car/update/${selectedEvent.AnounceId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  travelerId,
                  title,
                  startDateTime : startDate,
                  endDateTime : endDate,
                  createdAt,
                  updatedAt,
                  departure,
                  arrival,
                  state,
                  criterebuy: criterebuy,
                  prixdecritere: prixdecritere,
                  prixtotal: prixtotal,
                }),
              });

              if (response.ok) {
                setSelectedEvent(null)
                setShowForm(false);
                setSelectedEvent(null)

                setTitle('');
                setStartDate('');
                setEndDate('');
                setDeparture('')
                setArrival('')
                setCreatedAt("")
                setUpdateAt("")
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

            /*
            const val: number = MonthID
            setMonthID(val + 1);
            setEventsMonth([...eventsMonth, { id: MonthID, title, startDateTime, endDateTime, departure, arrival }]);
            */

            setUpdateAt("")
            setCreatedAt(dayjs().format("YYYY/MM/DD HH"))

            try {
              const response = await fetch('http://localhost:8080/anouncement/with-car/add', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  travelerId,
                  title,
                  startDateTime : startDate,
                  endDateTime : endDate,
                  createdAt,
                  updatedAt,
                  departure,
                  arrival,
                  state,
                  criterebuy: criterebuy,
                  prixdecritere: prixdecritere,
                  prixtotal: prixtotal,
                }),
              });

              if (response.ok) {
                setTitle('');
                setStartDate('');
                setEndDate('');
                setDeparture('')
                setArrival('')
                setCreatedAt("")
                setUpdateAt("")
                setCriterebuy(null)
                setPrixdecritere(null)
                setPrixtotal(null)
                setShowForm(false);
                setSelectedEvent(null)
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
    setEndDate('');
    setDeparture('')
    setArrival('')
    setCreatedAt("")
    setUpdateAt("")
    setCriterebuy(null)
    setPrixdecritere(null)
    setPrixtotal(null)
  }

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


  //gestion de la suppression d'un évènement
  const handleDelete = async (id: any) => {
    try {
      const response = await fetch(`http://localhost:8080/anouncement/with-car/desactivate/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        setShowForm(false);
        setSelectedEvent(null)
        setTitle('');
        setStartDate('');
        setEndDate('');

        setDeparture('')
        setArrival('')
        setCreatedAt("")
        setUpdateAt("")
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
           departure={departure}
           setDeparture={setDeparture}
           arrival={arrival}
           setArrival={setArrival}
           prixdecritere={prixdecritere}
           setPrixdecritere={setPrixdecritere}
           criterebuy={criterebuy}
           setCriterebuy={setCriterebuy}
           endDate={endDate}
           setEndDate={setEndDate}
           setStartDate={setStartDate}
           startDate={startDate}
           prixtotal={prixtotal}
           setPrixtotal={setPrixtotal}

           handleFormSubmit={handleFormSubmit}
           handleCancel={handleCancel}
           handleDelete={handleDelete}
           handleKeyPress={handleKeyPress}
           selectedEvent={selectedEvent}
          />
        }
      </div>
      <div>
        {showAlert &&
          <Alert
          errors={errors}
          handleClose={handleClose}
          />
        }

      </div>
    </div>
  );
};

export default MonthlyCalendar;
