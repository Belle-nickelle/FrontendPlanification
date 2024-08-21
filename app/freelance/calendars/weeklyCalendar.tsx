
import React, { useContext, useState, KeyboardEvent, useEffect } from 'react';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import Image from 'next/image';
import { GlobalContext } from '../context/GlobalContext';
import { Dayjs } from 'dayjs';
import { Event } from '../interfaces/types';
import { formError } from '../interfaces/types';
import { CritereBuy, PercentLevel } from '../interfaces/types';
import CommonFom from '../forms/CommonFom';
import Alert from '../alerts/alert';


dayjs.extend(localizedFormat);

const WeeklyCalendar: React.FC = () => {

    const { eventsMonth, setEventsMonth } = useContext(GlobalContext);
    const { MonthID, setMonthID } = useContext(GlobalContext);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(dayjs().startOf('week').format('YYYY-MM-DD'));
    const [showForm, setShowForm] = useState<boolean>(false);
    const [weekOffset, setWeekOffset] = useState<number>(0);


    const [createdAt, setCreatedAt] = useState("");
    const [updatedAt, setUpdatedAt] = useState("")
    const [state, setState] = useState("")
    const [criterebuy, setCriterebuy] = useState<CritereBuy | null>(null)
    const [prixdecritere, setPrixdecritere] = useState<number | null>(null)
    const [prixtotal, setPrixtotal] = useState<number | null>(null)
    const [prixtotalreduit, setPrixtotalreduit] = useState<number | null>(null)
    const [percent, setPercent] = useState<number | null>(null)
    const [title, setTitle] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
     const driverId = "907b3dca-a29a-4b3e-961c-7d44c5e3d7d2"

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


    const daysOfWeek = Array.from({ length: 7 }, (_, i) => dayjs().startOf('week').add(i + weekOffset * 7, 'day'));

    const handleAvailabilityClick = (event: Event) => {
        setSelectedEvent(event);
        setTitle(event.title);
        setStartDate(dayjs(event.startDateTime).format('YYYY/MM/DD HH:mm'));
        setEndDate(dayjs(event.endDateTime).format('YYYY/MM/DD HH:mm'));
        setCriterebuy(event.criterebuy)
        setPrixtotal(event.prixtotal)
        setPrixdecritere(event.prixdecritere)
        setShowForm(true);

    };

    const handleKeyPress = (e: KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter') {
          handleFormSubmit();
        }
      };

    const handleFormSubmit = async () => {
        if (title && startDate && criterebuy && prixtotal && prixdecritere && endDate && percent != null && prixtotalreduit) {

            const startDate1 = dayjs(startDate as string);
            const endDate1 = dayjs(endDate as string);
            const currentDate = dayjs().startOf('day')
            const start = dayjs(startDate).startOf('day')

            if (selectedEvent) {
                if (startDate1.isBefore(endDate1)) {
                    if (currentDate.isBefore(start) || currentDate.isSame(start)) {
                        setEventsMonth(eventsMonth.map(av => av.PlaningId === selectedEvent.PlaningId ? {
                            ...av,
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

                        } : av));

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
                        const val = MonthID;
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
    

    const handleDelete = (id: number) => {
        setEventsMonth(eventsMonth.filter(av => av.PlaningId !== id));
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

    // definition des couleurs des évènements
    const colors = [
        'bg-red-500',
        'bg-blue-500',
        'bg-green-500',
        'bg-yellow-500',
        'bg-purple-500',
        'bg-pink-500',
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
         
             
            
            }
    
          } else if (criterebuy === CritereBuy.JOUR) {
            const total = (((dayjs(endDate).diff(startDate) / 3600000) / 24) * prixdecritere).toFixed(2);
            setPrixtotal(parseFloat(total))
            if (prixtotal) {
              if(percent){
                
              }
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
                    <button onClick={() => {
                        setWeekOffset(weekOffset - 1);
                        setSelectedDate(dayjs(selectedDate).subtract(7, 'days').format('YYYY-MM-DD'));
                    }} className="px-4 py-2 bg-secondary text-white rounded">
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
                    <h2 className="text-xl font-bold">{dayjs(selectedDate).format('DD MMMM YYYY')} - {dayjs(selectedDate).add(6, 'day').format('DD MMMM YYYY')}</h2>
                    <button
                        onClick={() => {
                            setWeekOffset(weekOffset + 1);
                            setSelectedDate(dayjs(selectedDate).add(7, 'days').format('YYYY-MM-DD'));
                        }}
                        className="px-4 py-2 bg-secondary text-white rounded"
                    >
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
                <div className="flex justify-around">
                    {daysOfWeek.map(day => (
                        <div key={day.format('YYYY-MM-DD')} className="border p-4 w-40">
                            <h3 className="font-bold">{day.format('dddd D MMM')}</h3>
                            <ul>
                                {getEventsForDate(day.format('YYYY-MM-DD')).map((event, index) => (
                                    <li
                                        key={index}
                                        className="p-2 mb-1 bg-blue-200 rounded"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAvailabilityClick(event);
                                        }}
                                    ><button
                                        className="flex items-center w-full  hover:bg-blue-300 group-hover:bg-blue-300"
                                    >
                                            <span className="mr-2.5 transition-flex duration-300 flex-0 group-hover:flex-1">
                                                {event.title}
                                            </span>
                                            <span>▶</span>
                                        </button></li>
                                ))}
                            </ul>
                        </div>
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

export default WeeklyCalendar;
