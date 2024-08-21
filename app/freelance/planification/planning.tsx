import { useState, useMemo, useContext, useEffect, KeyboardEvent, FormEvent } from 'react';
import dayjs from 'dayjs';
import { GlobalContext } from '../context/GlobalContext';
import { getMonth } from '../utils/util';
import { Event } from '../interfaces/types';
import { CritereBuy, PercentLevel } from '../interfaces/types';
import { formError } from '../interfaces/types';
import CommonFom from '../forms/CommonFom';
import Alert from '../alerts/alert';


const CalendarPage: React.FC = () => {

  const { MonthID, setMonthID } = useContext(GlobalContext);
  const { monthIndex, setMonthIndex } = useContext(GlobalContext);

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


  const [currentMonth, setCurrentMonth] = useState(getMonth());
  const [currentMonthIndex, setCurrentMonthIndex] = useState(dayjs().month());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const driverId = "907b3dca-a29a-4b3e-961c-7d44c5e3d7d2"

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
    setStartDate(dayjs(event.startDateTime).format('YYYY/MM/DD HH:mm'));
    setEndDate(dayjs(event.endDateTime).format('YYYY/MM/DD HH:mm'));
    setCriterebuy(event.criterebuy)
    setPrixtotal(event.prixtotal)
    setPrixdecritere(event.prixdecritere)
    setShowForm(true);
  };

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
            setUpdatedAt(dayjs().format("YYYY-MM-DD HH:mm"))
            setCreatedAt(dayjs().format("YYYY-MM-DD HH:mm"))
          
            const val: number = MonthID
            setMonthID(val + 1);
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
                  driverId: driverId,
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
  const handleDelete = (id: number) => {
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
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
  ];

  useEffect(() => {
    if (prixdecritere && startDate && endDate && percent != null) {
      if (criterebuy === CritereBuy.HEURE) {
        const total = ((dayjs(endDate).diff(startDate) / 3600000) * prixdecritere).toFixed(2);
        setPrixtotal(parseFloat(total))
        if (prixtotal) {
          setPrixtotalreduit(parseFloat((prixtotal - prixtotal * (percent / 100)).toFixed(2)));
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
  }, [prixdecritere, startDate, endDate, criterebuy, prixtotal, percent, prixtotalreduit]);





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
                    <h3 className="text-xl m-7 text-green-600 font-bold ">
                      ➳◅  {dayjs(`${year}-${parseInt(month) + 1}-01`).format('MMMM')}  ➳◅
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                      {groupedEvents[parseInt(year)][parseInt(month)].map((event) => (
                        <div
                          key={event.PlaningId}
                          className="bg-planing border cursor-pointer shadow-md rounded-lg p-4 hover:shadow-planing hover:shadow-xl hover:bg-third transition-colors duration-300"
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
                              Critere : {event.criterebuy}
                            </span>
                            <span className="text-lg text-white">
                             Tarif sur critere : {event.prixdecritere} FCFA
                            </span>
                            <span className="text-lg text-white">
                               reduction de : : {event.percent} %
                            </span>
                            <span className="text-lg text-white">
                              Tarif total : {event.prixtotal} FCFA
                            </span>
                            <span className="text-lg text-white">
                              Total réduit : {event.prixtotalreduit} FCFA
                            </span>
                            <span className="text-lg text-white">
                              Crée le: : {event.createdAt} 
                            </span>
                            <span className="text-lg text-white">
                              Modifié le: : {event.updatedAt} 
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
    </div>
  );
};

export default CalendarPage;