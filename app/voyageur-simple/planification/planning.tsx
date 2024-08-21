import { useState, useMemo, useContext, useEffect, KeyboardEvent, FormEvent } from 'react';
import dayjs from 'dayjs';
import { GlobalContext } from '../context/GlobalContext';
import { getMonth } from '../utils/util';
import { Event, ConfortLevel, CritereBuy } from '../interfaces/types';
import { formError } from '../interfaces/types';
import Alert from '../alerts/alert';
import CommonFom from '../forms/CommonFom';


const CalendarPage: React.FC = () => {

  const { MonthID, setMonthID } = useContext(GlobalContext);
  const { monthIndex, setMonthIndex } = useContext(GlobalContext);

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
      const clientId = "36c4179e-935b-43d2-bed1-568953684cde"


  const [currentMonth, setCurrentMonth] = useState(getMonth());
  const [currentMonthIndex, setCurrentMonthIndex] = useState(dayjs().month());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);



  const [showForm, setShowForm] = useState<boolean>(false);

  const [selectedYear, setSelectedYear] = useState(dayjs().year());

  const { eventsMonth, setEventsMonth } = useContext(GlobalContext);
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

            setEventsMonth(eventsMonth.map(ev => ev.announcementId === selectedEvent.announcementId ? {
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

      } else {
        if (startDate1.isBefore(endDate1)) {
          if (currentDate.isBefore(start) || currentDate.isSame(start)) {
            
            setUpdatedAt(dayjs().format("YYYY-MM-DD HH:mm"))
            setCreatedAt(dayjs().format("YYYY-MM-DD HH:mm"))

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
      const response = await fetch(`http://localhost:8080/anouncement/simple/desactivate/${id}`, {
        method: 'PUT',
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
  const handleDelete = (id: number) => {
    const confirmation = window.confirm("Voulez-vous vraiment supprimer ?");
    if (confirmation) {
      setEventsMonth(eventsMonth.filter(ev => ev.announcementId !== id));
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

  useEffect(() => {
    if (departure && arrival) {
      setTitle(`${departure} - ${arrival}`);
    } else {
      setTitle('');
    }
  }, [departure, arrival]);

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
                          key={event.announcementId}
                          className="bg-planing border cursor-pointer shadow-md rounded-lg p-4 hover:bg-third hover:shadow-planing hover:shadow-xl transition-colors duration-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventClick(event);
                          }}
                        >
                          <h4 className="text-2xl text-center  font-bold mb-2 text-white">{event.title}</h4>
                          <div className="flex flex-col items-center justify-between mb-4">
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
                              Confort : {event.confort}
                            </span>
                            <span className="text-lg text-white">
                              Critere : {event.criterebuy}
                            </span>
                            <span className="text-lg text-white">
                              Tarif sur critere : {event.prixdecritere} Frs
                            </span>
                            <span className="text-lg text-white">
                              Prix Total : {event.prixtotal} Frs
                            </span>
                            <span className="text-lg text-white">
                              Crée le : {event.createdAt}
                            </span>
                            <span className="text-lg text-white">
                              Modifier le : {event.updatedAt}
                            </span>
                            
                          </div>
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
    </div>
  );
};

export default CalendarPage;