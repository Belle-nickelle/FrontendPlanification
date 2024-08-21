import React, { useState, useContext, useMemo, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Event1 from '../Event';
import EventForm from '../forms/eventform';
import Image from 'next/image';
import { GlobalContext } from '../context/GlobalContext';
import { Event } from '../interfaces/types';
import { formError, CritereBuy } from '../interfaces/types';



const Calendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
    const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
    const [showEventForm1, setShowEventForm1] = useState<boolean>(false);

    const { eventsMonth, setEventsMonth } = useContext(GlobalContext);
    const { events, setEvents } = useContext(GlobalContext);


    const [createdAt, setCreatedAt] = useState("")
    const [updatedAt, setUpdateAt] = useState("")
    const [state, setState] = useState("AVAILABLE")
    const travelerId = "36c4179e-935b-43d2-bed1-568953684cde"

    const [criterebuy, setCriterebuy] = useState<CritereBuy | null>(null)
    const [prixdecritere, setPrixdecritere] = useState<number | null>(null)
    const [prixtotal, setPrixtotal] = useState<number | null>(null)

    const [title, setTitle] = useState('');
    const [start, setStart] = useState<Dayjs | null>(null);
    const [end, setEnd] = useState<Dayjs | null>(null);
    //const { MonthID, setMonthID } = useContext(GlobalContext);
    const [departure, setDeparture] = useState<string>('')
    const [arrival, setArrival] = useState<string>('')
    const [errors, setErrors] = useState<formError>({
        endDate: '',
        startDate: '',
        request: ''
    })
    const [showAlert, setShowAlert] = useState(false);


    const handleClose = () => {
        setShowAlert(false);
        setErrors({
            endDate: '',
            startDate: '',
            request: ''
        })
    };



    /*
    //édition d'évènement
    const editEvent = (id: number, updatedEvent: Event) => {
        setEventsMonth(eventsMonth.map(event => (event.id === id ? { ...updatedEvent, id } : event)));
        setEventToEdit(null);
        setShowEventForm1(false);
    };
    */

    const deleteEvent = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:8080/anouncement/with-car/desactivate/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                setTitle('');
                setStart(null);
                setEnd(null);
                setDeparture('');
                setArrival('');
                setShowEventForm1(false)
                setEventToEdit(null)
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

        //setEventsMonth(eventsMonth.filter(event => event.id !== id));
    };

    const handleEdit = (event: Event) => {
        setEventToEdit(event);
        setShowEventForm1(true);
    };

    const handleClearEdit = () => {
        setEventToEdit(null);
        setShowEventForm1(false);
    };

    const prevDay = () => {
        setCurrentDate(currentDate.subtract(1, 'day'));
    };

    const nextDay = () => {
        setCurrentDate(currentDate.add(1, 'day'));
    };

    const getEventDaysBetween = (event: Event): string[] => {
        const start: Dayjs = dayjs(event.startDateTime);
        const end: Dayjs = dayjs(event.endDateTime);

        if (start.isSame(end, 'day')) {
            return [start.format('YYYY-MM-DD')];
        }

        return [];
    };

    const getSingleDayEvents = () => {
        const singleDayEvents: Event[] = [];

        eventsMonth.forEach((event) => {
            const eventDays = getEventDaysBetween(event);
            if (eventDays.length === 1) {
                singleDayEvents.push(event);
            }
        });

        return singleDayEvents;
    };


    const singleDayEvents = useMemo(() => getSingleDayEvents(), [eventsMonth]);

    const singleDayEventsToEventType = (): Event[] => {
        return singleDayEvents.map((event) => ({
            AnounceId: event.AnounceId,
            title: event.title,
            startDateTime: event.startDateTime,
            endDateTime: event.endDateTime,
            createdAt: event.createdAt,
            updatedAt: event.updatedAt,
            departure: event.departure,
            arrival: event.arrival,
            state: event.state,
            criterebuy: event.criterebuy,
            prixdecritere: event.prixdecritere,
            prixtotal: event.prixtotal
        }));
    };



    const singleDayEventTypes = useMemo(() => singleDayEventsToEventType(), [singleDayEvents]);

    setEvents(singleDayEventTypes)

    const filteredEvents = events.filter(event =>
        dayjs(event.startDateTime).isSame(currentDate, 'day')
    );


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (start && end && title && departure && arrival) {

            const startDateTime = currentDate.set('hour', start.hour()).set('minute', start.minute()).format('YYYY-MM-DD HH:mm');
            const endDateTime = currentDate.set('hour', end.hour()).set('minute', end.minute()).format('YYYY-MM-DD HH:mm');

            const startDate1 = dayjs(startDateTime);
            const endDate1 = dayjs(endDateTime);
            const True_currentDate = dayjs().startOf('day');
            const start1 = currentDate.startOf('day')


            if (eventToEdit?.AnounceId) {
                if (startDate1.isBefore(endDate1)) {
                    if (True_currentDate.isBefore(start1) || True_currentDate.isSame(start1)) {

                        /*
                        const newEvent: Event = {
                            id: eventToEdit?.id,
                            title: title,
                            startDateTime: currentDate.set('hour', start.hour()).set('minute', start.minute()).format('YYYY-MM-DD HH:mm'),
                            endDateTime: currentDate.set('hour', end.hour()).set('minute', end.minute()).format('YYYY-MM-DD HH:mm'),
                            departure: departure,
                            arrival: arrival,
                        };
                        editEvent(eventToEdit?.id, newEvent);
                        */
                        setUpdateAt(dayjs().format("YYYY/MM/DD HH"))
                        setCreatedAt(eventToEdit.createdAt)

                        try {
                            const response = await fetch(`http://localhost:8080/anouncement/with-car/update/${eventToEdit.AnounceId}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    travelerId,
                                    title,
                                    startDateTime,
                                    endDateTime,
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
                                setStart(null);
                                setEnd(null);
                                setDeparture('');
                                setArrival('');
                                setShowEventForm1(false)
                                setEventToEdit(null)
                                setCreatedAt("")
                                setUpdateAt("")
                                setTitle('');

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
                            startDate: "La de debut doit etre après la date d'aujourd'hui ou etre la meme date",
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
                    if (True_currentDate.isBefore(start1) || True_currentDate.isSame(start1)) {

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
                                    startDateTime,
                                    endDateTime,
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
                                setStart(null);
                                setEnd(null);
                                setDeparture('');
                                setArrival('');
                            
                                setCreatedAt("")
                                setUpdateAt("")
                                setTitle('');

                                setCriterebuy(null)
                                setPrixdecritere(null)
                                setPrixtotal(null)
                                setShowEventForm1(false)
                                setEventToEdit(null)
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
                            startDate: "La de debut doit etre après la date d'aujourd'hui ou etre la meme date",
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
        if (eventToEdit) {
            setTitle(eventToEdit.title);
            setStart(dayjs(eventToEdit.startDateTime));
            setEnd(dayjs(eventToEdit.endDateTime));
            setDeparture(eventToEdit.departure)
            setArrival(eventToEdit.arrival)
            setPrixdecritere(eventToEdit.prixdecritere)
            setPrixtotal(eventToEdit.prixtotal)
            setCriterebuy(eventToEdit.criterebuy)
        } else {
            setTitle('');
            setStart(null);
            setEnd(null);
            setDeparture('');
            setArrival('');
        
            setCreatedAt("")
            setUpdateAt("")
            setTitle('');

            setCriterebuy(null)
            setPrixdecritere(null)
            setPrixtotal(null)
        }
    }, [eventToEdit]);
    useEffect(() => {
        if (prixdecritere && start && end) {
            const startDateTime = currentDate.set('hour', start.hour()).set('minute', start.minute()).format('YYYY-MM-DD HH:mm');
            const endDateTime = currentDate.set('hour', end.hour()).set('minute', end.minute()).format('YYYY-MM-DD HH:mm');

            if (criterebuy === CritereBuy.HEURE) {
                const total = ((dayjs(endDateTime).diff(startDateTime) / 3600000) * prixdecritere).toFixed(2);
                setPrixtotal(parseFloat(total))
            } else if (criterebuy === CritereBuy.JOUR) {
                const total = (((dayjs(endDateTime).diff(startDateTime) / 3600000) / 24) * prixdecritere).toFixed(2);
                setPrixtotal(parseFloat(total))
            } else if (criterebuy === CritereBuy.FORFAITAIRE) {
                setPrixtotal(prixdecritere);
            }

        }
    }, [prixdecritere, start, end, criterebuy]);

    return (
        <div className="flex-1 p-4">
            <div className="flex justify-between items-center mb-4">
                <button onClick={prevDay} className="px-4 py-2 bg-secondary text-white rounded">
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

                <h2 className="text-2xl font-bold">{currentDate.format('DD MMMM YYYY')}</h2>

                <button onClick={nextDay} className="px-4 py-2 bg-secondary text-white rounded">
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
            {showEventForm1 && (
                <div className="fixed inset-0 flex items-center justify-center z-20">
                    <div className="bg-blue-400 p-1 rounded shadow-lg w-full max-w-md">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            onClick={handleClearEdit}

                        >
                            &times;
                        </button>
                        <EventForm
                            eventToEdit={eventToEdit}
                            clearEdit={handleClearEdit}
                            handleSubmit={handleSubmit}

                            title={title}
                            start={start}
                            end={end}
                            departure={departure}
                            arrival={arrival}
                            setTitle={(setTitle)}
                            setStart={setStart}
                            setEnd={setEnd}
                            setDeparture={setDeparture}
                            setArrival={setArrival}

                           criterebuy={criterebuy}
                           prixdecritere={prixdecritere}
                           prixtotal={prixtotal}
                           setCriterebuy={setCriterebuy}
                           setPrixdecritere={setPrixdecritere}
                        />
                    </div>
                </div>
            )}
            <div>
                {showAlert && (
                    <div className="fixed z-50 inset-0 overflow-y-auto">
                        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                            </div>
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                                &#8203;
                            </span>
                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div>
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                        <svg
                                            className="h-6 w-6 text-red-600"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-5">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">{errors.endDate}</h3>
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">{errors.startDate}</h3>
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">{errors.request}</h3>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                                        onClick={handleClose}
                                    >
                                        fermer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            <div className="flex flex-col">
                {Array.from({ length: 24 }, (_, hour) => (
                    <div key={hour} className="flex border-b">
                        <div className="w-16 text-right pr-2 py-2">
                            {dayjs().hour(hour).minute(0).format('HH [h] mm')}
                        </div>
                        <div className="flex-1 relative py-2">
                            {filteredEvents
                                .filter(event => {
                                    const eventStart = dayjs(event.startDateTime);
                                    const eventEnd = dayjs(event.endDateTime);
                                    return (
                                        eventStart.hour() === hour ||
                                        (eventStart.hour() < hour && eventEnd.hour() > hour)
                                    );
                                })
                                .map((event, index) => (
                                    <div key={index} className="absolute w-full" style={{ top: `${dayjs(event.startDateTime).minute()}px` }}>
                                        <Event1 event={event} onEdit={handleEdit} onDelete={deleteEvent} />
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>

            <div>
                <button
                    className="fixed bottom-4 mr-0 right-1 bg-primary text-white h-14 flex items-center justify-center hover:shadow-2xl hover:shadow-planing"
                    onClick={() => setShowEventForm1(true)}
                ><span className="cursor-pointer text-white mx-2">
                        AJOUTER UNE DISPONIBILITE
                    </span>
                </button>
            </div>
        </div>
    );
};

export default Calendar;