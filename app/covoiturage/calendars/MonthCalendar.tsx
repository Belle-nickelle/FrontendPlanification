
import React, { useState, useEffect, useContext, KeyboardEvent, FormEvent } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import Image from 'next/image';
import { GlobalContext } from '../context/GlobalContext';
import { Event } from '../interfaces/types';
import { getMonth } from '../utils/util';
import { formError } from '../interfaces/types';
import Alert from '../alerts/alert';
import CommonFom from '../forms/CommonFom';



dayjs.extend(localizedFormat);

const MonthlyCalendar: React.FC = () => {

  const { eventsMonth, setEventsMonth } = useContext(GlobalContext);
  const { monthIndex, setMonthIndex } = useContext(GlobalContext);
  //const { MonthID, setMonthID } = useContext(GlobalContext);
  const [currentMonth, setCurrentMonth] = useState(getMonth());
  const [currentMonthIndex, setCurrentMonthIndex] = useState(dayjs().month());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { events, setEvents } = useContext(GlobalContext);
  const [createdAt, setCreatedAt] = useState("")
  const [updateAt, setUpdateAt] = useState("")
  const vehicleId = "1234"
  const driverId = "907b3dca-a29a-4b3e-961c-7d44c5e3d7d2"
  const [state, setState] = useState("AVAILABLE")


  const [title, setTitle] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');

  const [departure, setDeparture] = useState<string>('')
  const [arrival, setArrival] = useState<string>('')
  const [nbPlace, setNbPlace] = useState<number | null>(null)
  const [tarif, setTarif] = useState<number | null>(null)
  const [TarifTotal, setTarifTotal] = useState<number | null>(null)

  const [showForm, setShowForm] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState(false);
  const [initialNbPlace, setInitialNbPlace] = useState<number | null>(null)

  const [errors, setErrors] = useState<formError>({
    endDate: '',
    startDate: '',
    request: ''
  })



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
    setStartDate(dayjs(event.startDateTime).format('YYYY-MM-DD'));
    setStartTime(dayjs(event.startDateTime).format('HH:mm'));
    setEndDate(dayjs(event.endDateTime).format('YYYY-MM-DD'));
    setEndTime(dayjs(event.endDateTime).format('HH:mm'));
    setDeparture(event.departure)
    setArrival(event.arrival)
    setNbPlace(event.nbPlace)
    setTarif(event.tarif)
    setInitialNbPlace(event.initialNbPlace)
    setShowForm(true);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchPlaning();
    }, 500);

    return () => clearInterval(interval);
  }, [eventsMonth, events]);


  const fetchPlaning = async () => {
    try {
      const response = await fetch(`http://localhost:8080/planing/covoiturage/get-all/${driverId}`, {
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


  //gestion de la soumission du formulaire
  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (title && startDate && startTime && endDate && endTime && arrival && departure && nbPlace && tarif) {

      const startDateTime = `${startDate}T${startTime}`;
      const endDateTime = `${endDate}T${endTime}`;

      const startDate1 = dayjs(startDateTime);
      const endDate1 = dayjs(endDateTime);
      const currentDate = dayjs().startOf('day')
      const start = dayjs(startDate).startOf('day')

      if (selectedEvent) {

        if (startDate1.isBefore(endDate1)) {

          if (currentDate.isBefore(start) || currentDate.isSame(start)) {

            setUpdateAt(dayjs().format("YYYY/MM/DD HH:mm"))
            setCreatedAt(selectedEvent.createdAt)
            const updatedAt = updateAt

            //setEventsMonth(eventsMonth.map(ev => ev.id === selectedEvent.id ? { ...ev, title, startDateTime, endDateTime, departure, arrival, nbPlace, tarif } : ev));

            try {
              const response = await fetch(`http://localhost:8080/planing/covoiturage/update/${selectedEvent.planingId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  vehicleId,
                  driverId,
                  title,
                  startDateTime,
                  endDateTime,
                  createdAt,
                  updatedAt,
                  departure,
                  arrival,
                  state,
                  nbPlace,
                  tarif,
                  initialNbPlace,
                }),
              });

              if (response.ok) {
                setSelectedEvent(null)
                setShowForm(false);
                setSelectedEvent(null)
                setTitle('');
                setStartDate('');
                setStartTime('');
                setEndDate('');
                setEndTime('');
                setDeparture('')
                setArrival('')
                setCreatedAt("")
                setUpdateAt("")
                setInitialNbPlace(null)
                setNbPlace(null)
                setTarif(null)
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

      } else {
        if (startDate1.isBefore(endDate1)) {

          if (currentDate.isBefore(start) || currentDate.isSame(start)) {

            setUpdateAt("")
            setCreatedAt(dayjs().format("YYYY/MM/DD HH:mm"))
            const updatedAt = updateAt

            // const val: number = MonthID
            //setMonthID(val + 1);
            // setEventsMonth([...eventsMonth, { id: MonthID, title, startDateTime, endDateTime, departure, arrival, nbPlace, tarif }]);

            try {
              const response = await fetch('http://localhost:8080/planing/covoiturage/add', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  vehicleId,
                  driverId,
                  title,
                  startDateTime,
                  endDateTime,
                  createdAt,
                  updatedAt,
                  departure,
                  arrival,
                  state,
                  nbPlace,
                  tarif,
                  initialNbPlace
                }),
              });

              if (response.ok) {
                setShowForm(false);
                setSelectedEvent(null)
                setTitle('');
                setStartDate('');
                setStartTime('');
                setEndDate('');
                setEndTime('');
                setDeparture('')
                setArrival('')
                setCreatedAt("")
                setUpdateAt("")
                setInitialNbPlace(null)
                setNbPlace(null)
                setTarif(null)
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

  useEffect(() => {
    if (tarif && nbPlace) {
      setTarifTotal(tarif*nbPlace)
    }
  }, [tarif, nbPlace, TarifTotal]);




  //gestion de l'annulation d'une modification, d'un ajout ou d'une suppression d'un évènement
  const handleCancel = () => {
    setShowForm(false);
    setSelectedEvent(null);
    setTitle('');
    setStartDate('');
    setStartTime('');
    setEndDate('');
    setEndTime('');
    setDeparture('')
    setArrival('')
    setCreatedAt("")
    setUpdateAt("")
    setInitialNbPlace(null)
    setNbPlace(null)
    setTarif(null)
  }

  //gestion de la suppression d'une planification
  const handleDelete = async (id: any) => {

    try {
      const response = await fetch(`http://localhost:8080/planing/covoiturage/desactivate/${id}`, {
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
        setStartTime('');
        setEndDate('');
        setEndTime('');
        setDeparture('')
        setArrival('')
        setCreatedAt("")
        setUpdateAt("")
        setInitialNbPlace(null)
        setTarif(null)
        setNbPlace(null)
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
                          <span className="text-white font-bold mr-2.5  flex-0 group-hover:flex-1">
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
            title={title}
            setTitle={setTitle}
            tarif={tarif}
            setTarif={setTarif}
            departure={departure}
            setDeparture={setDeparture}
            arrival={arrival}
            setArrival={setArrival}
            nbPlace={nbPlace}
            setNbPlace={setNbPlace}
            endDate={endDate}
            setStartDate={setStartDate}
            startDate={startDate}
            setEndDate={setEndDate}
            setInitialNbPlace={setInitialNbPlace}

            handleCancel={handleCancel}
            handleDelete={handleDelete}
            selectedEvent={selectedEvent}
            handleKeyPress={handleKeyPress}
            handleFormSubmit={handleFormSubmit}
            TarifTotal = {TarifTotal}
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
