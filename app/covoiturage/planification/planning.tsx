import { useState, useMemo, useContext, useEffect, KeyboardEvent, FormEvent } from 'react';
import dayjs from 'dayjs';
import { GlobalContext } from '../context/GlobalContext';
import { getMonth } from '../utils/util';
import { Event } from '../interfaces/types';
import { formError } from '../interfaces/types';
import Alert from '../alerts/alert';
import CommonFom from '../forms/CommonFom';


const CalendarPage: React.FC = () => {

  const { MonthID, setMonthID } = useContext(GlobalContext);
  const { monthIndex, setMonthIndex } = useContext(GlobalContext);
  const [currentMonth, setCurrentMonth] = useState(getMonth());
  const { eventsMonth, setEventsMonth } = useContext(GlobalContext);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(dayjs().month());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());

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
  const [initialNbPlace, setInitialNbPlace] = useState<number | null>(null)
  const [TarifTotal, setTarifTotal] = useState<number | null>(null)

  const [showForm, setShowForm] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState(false);

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


  const sortedEvents = useMemo(() => {
    return eventsMonth.sort((a, b) => dayjs(a.startDateTime).diff(dayjs(b.startDateTime)));
  }, []);

  const groupedEvents = useMemo(() => {
    const result: { [year: number]: { [month: number]: Event[] } } = {};

    sortedEvents.forEach((event) => {
      const eventYear = dayjs(event.startDateTime).year();
      const eventMonth = dayjs(event.startDateTime).month();

      if (!result[eventYear]) {
        result[eventYear] = {};
      }

      if (!result[eventYear][eventMonth]) {
        result[eventYear][eventMonth] = [];
      }

      result[eventYear][eventMonth].push(event);
    });

    return result;
  }, [sortedEvents]);


  //gestion du changement des mois et indice de mois
  useEffect(() => {
    setCurrentMonth(getMonth(currentMonthIndex));
  }, [currentMonthIndex]);


  useEffect(() => {
    setCurrentMonthIndex(monthIndex)
  }, [monthIndex])



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
    setNbPlace(nbPlace)
    setTarif(event.tarif)
    setInitialNbPlace(event.initialNbPlace)
    setShowForm(true);
  };

  //gestion de la soumission du formulaire
  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title && startDate && startTime && endDate && endTime && departure && arrival && nbPlace && tarif) {

      const startDateTime = `${startDate}T${startTime}`;
      const endDateTime = `${endDate}T${endTime}`;

      const startDate1 = dayjs(startDateTime);
      const endDate1 = dayjs(endDateTime);
      const currentDate = dayjs().startOf('day')
      const start = dayjs(startDate).startOf('day')


      if (selectedEvent) {

        if (startDate1.isBefore(endDate1)) {

          if (currentDate.isBefore(start) || currentDate.isSame(start)) {

            //setEventsMonth(eventsMonth.map(ev => ev.id === selectedEvent.id ? { ...ev, title, startDateTime, endDateTime, departure, arrival, nbPlace, tarif } : ev));
            setUpdateAt(dayjs().format("YYYY/MM/DD HH"))
            setCreatedAt(selectedEvent.createdAt)
            const updatedAt = updateAt

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
                  initialNbPlace
                }),
              });

              if (response.ok) {
                setTitle('');
                setStartDate('');
                setStartTime('');
                setEndDate('');
                setEndTime('');
                setDeparture('')
                setArrival('')
                setCreatedAt("")
                setUpdateAt("")
                setNbPlace(null)
                setInitialNbPlace(null)
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

            setSelectedEvent(null)
            //mise à jour après soumission
            setShowForm(false);
            setSelectedEvent(null)
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

            //const val: number = MonthID
            //setMonthID(val + 1);
            //setEventsMonth([...eventsMonth, { id: MonthID, title, startDateTime, endDateTime, departure, arrival, nbPlace, tarif }]);
            //mise à jour après soumission
            setUpdateAt("")
            setCreatedAt(dayjs().format("YYYY/MM/DD HH"))
            const updatedAt = updateAt

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
                setTitle('');
                setStartDate('');
                setStartTime('');
                setEndDate('');
                setEndTime('');
                setDeparture('')
                setArrival('')
                setCreatedAt("")
                setNbPlace(null)
                setInitialNbPlace(null)
                setTarif(null)
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
    setNbPlace(null)
    setInitialNbPlace(null)
    setTarif(null)
  }

  //gestion de la suppression d'un évènement
  const handleDelete = async (id: number) => {

    try {
      const response = await fetch(`http://localhost:8080/planing/covoiturage/desactivate/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        setCreatedAt("")
        setUpdateAt("")
        setShowForm(false);
        setSelectedEvent(null)
        setTitle('');
        setStartDate('');
        setStartTime('');
        setEndDate('');
        setEndTime('');
        setDeparture('')
        setArrival('')
        setNbPlace(null)
        setTarif(null)
      } else {
        console.error('Erreur lors de la suppression de l\'enregistrement');
      }
    } catch (error) {
      console.error(error);
    }

    //setEventsMonth(eventsMonth.filter(ev => ev.id !== id));

  };
  // definition des couleurs des évènements
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
  ];

  return (
    <div className="flex-1 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl text-center text-primary font-bold mb-6">◈-PLAN-◈</h1>

        <div className="space-y-8">
          {Object.keys(groupedEvents)
            .sort((a, b) => parseInt(a) - parseInt(b))
            .map((year) => (
              <div key={year}>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  {parseInt(year) === selectedYear ? (
                    <button
                      onClick={() => setSelectedYear(parseInt(year))}
                      className="text-blue-500 hover:text-blue-600 hover:underline"
                    >
                      {year}
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedYear(parseInt(year))}
                      className="text-gray-600 hover:text-blue-500 hover:underline"
                    >
                      {year}
                    </button>
                  )}
                </h2>

                {Object.keys(groupedEvents[parseInt(year)]).map((month) => (
                  <div key={month} className="space-y-4">
                    <h3 className="text-xl m-7 text-green-600 font-bold">
                      ➳◅  {dayjs(`${year}-${parseInt(month) + 1}-01`).format('MMMM')}  ➳◅
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                      {groupedEvents[parseInt(year)][parseInt(month)].map((event) => (
                        <div
                          key={event.planingId}
                          className="bg-planing border cursor-pointer shadow-md rounded-lg p-4 hover:m-5 hover:shadow-xl hover:shadow-planing hover:bg-third transition-colors duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventClick(event);
                          }}
                        >
                          <h4 className="text-2xl text-center  font-bold mb-2 text-white">{event.title}</h4>
                          <div className="flex flex-col items-center justify-center mb-4">
                            <span className="text-lg text-white">
                              Debut : {dayjs(event.startDateTime).format('DD/MM/YYYY HH:mm')}
                            </span>
                            <span className="text-lg text-white">
                              Fin : {dayjs(event.endDateTime).format('DD/MM/YYYY HH:mm')}
                            </span>
                            <span className="text-lg text-white">
                              Lieu de depart : {event.departure}
                            </span>
                            <span className="text-lg text-white">
                              Lieu d'arrivée : {event.arrival}
                            </span>
                            <span className="text-lg text-white">
                              Nombre de place : {event.nbPlace}
                            </span>
                            <span className="text-lg text-white">
                              Tarif : {event.tarif} FCFA
                            </span>
                            <span className="text-lg text-white">
                              crée le : {event.createdAt}
                            </span>
                            <span className="text-lg text-white">
                              modifier le : {event.updatedAt}
                            </span>
                          </div>
                          {((event.initialNbPlace-event.nbPlace) > 0) &&
                            <div className='flex justify-center items-center bg-pink-500 p-3'>
                            <span>
                              Nombre de place restant : <span className='font-bold'>{event.nbPlace-event.initialNbPlace}</span>
                            </span>
                            <span>
                              Somme Total : <span className='font-bold'>{(event.nbPlace-event.initialNbPlace)*event.tarif}</span> FCFA
                            </span>
                          </div>
                          }
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
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
    </div>
  );
};

export default CalendarPage;