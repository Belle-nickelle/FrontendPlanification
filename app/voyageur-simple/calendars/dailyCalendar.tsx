import React, { useState, useContext, useMemo, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Event1 from '../Event';
import EventForm from '../forms/eventform';
import Image from 'next/image';
import { GlobalContext } from '../context/GlobalContext';
import { Event } from '../interfaces/types';
import { ConfortLevel, CritereBuy } from '../interfaces/types';
import { formError } from '../interfaces/types';
import Alert from '../alerts/alert';


const Calendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs());
    const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
    const [showEventForm1, setShowEventForm1] = useState<boolean>(false);

    const { eventsMonth, setEventsMonth } = useContext(GlobalContext);
    const { events, setEvents } = useContext(GlobalContext);

    const [title, setTitle] = useState<string>('');
    const [createdAt, setCreatedAt] = useState("");
    const [updatedAt, setUpdatedAt] = useState("")
    const [state, setState] = useState("")
    const [departure, setDeparture] = useState<string>('')
    const [arrival, setArrival] = useState<string>('')
    const [criterebuy, setCriterebuy] = useState<CritereBuy | null>(null)
    const [prixdecritere, setPrixdecritere] = useState<number | null>(null)
    const [prixtotal, setPrixtotal] = useState<number | null>(null)
    const [confort, setConfort] = useState<ConfortLevel | null>(null);

    const [start, setStart] = useState<Dayjs | null>(null);
    const [end, setEnd] = useState<Dayjs | null>(null);
    const { MonthID, setMonthID } = useContext(GlobalContext);
    const clientId = "36c4179e-935b-43d2-bed1-568953684cde"

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



    //édition d'évènement
    const editEvent = (id: number, updatedEvent: Event) => {
        setEventsMonth(eventsMonth.map(event => (event.announcementId === id ? { ...updatedEvent, id } : event)));
        setEventToEdit(null);
        setShowEventForm1(false);
    };

    const deleteEvent = (id: number) => {
        setEventsMonth(eventsMonth.filter(event => event.announcementId !== id));
    };

    const deleteEvent1 = async (id: any) => {
        try {
            const response = await fetch(`http://localhost:8080/anouncement/simple/delete/${id}`, {
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
                setConfort(null)
                setConfort(null)
                setCreatedAt("")
                setUpdatedAt("")
                setDeparture('')
                setArrival('')
                setConfort(null)
                setCriterebuy(null)
                setPrixdecritere(null)
                setPrixtotal(null)
                setShowEventForm1(false)
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
            announcementId: event.announcementId,
            clientId : clientId,
            title: event.title,
            startDateTime: event.startDateTime,
            endDateTime: event.endDateTime,
            createdAt: event.createdAt,
            updatedAt: event.updatedAt,
            state: event.state,
            departure: event.departure,
            arrival: event.arrival,
            criterebuy: event.criterebuy,
            prixdecritere: event.prixdecritere,
            prixtotal: event.prixtotal,
            confort: event.confort,
        }));
    };



    const singleDayEventTypes = useMemo(() => singleDayEventsToEventType(), [singleDayEvents]);

    setEvents(singleDayEventTypes)

    const filteredEvents = events.filter(event =>
        dayjs(event.startDateTime).isSame(currentDate, 'day')
    );


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (criterebuy && prixdecritere && prixtotal && arrival && departure && confort && start && end) {

            const startDateTime = currentDate.set('hour', start.hour()).set('minute', start.minute()).format('YYYY-MM-DD HH:mm');
            const endDateTime = currentDate.set('hour', end.hour()).set('minute', end.minute()).format('YYYY-MM-DD HH:mm');

            const startDate1 = dayjs(startDateTime);
            const endDate1 = dayjs(endDateTime);
            const True_currentDate = dayjs().startOf('day');
            const start1 = currentDate.startOf('day')
            setTitle(`${departure}- ${arrival}`)

            if (eventToEdit?.announcementId) {
                if (startDate1.isBefore(endDate1)) {
                    if (True_currentDate.isBefore(start1) || True_currentDate.isSame(start1)) {

                        setUpdatedAt(dayjs().format("YYYY-MM-DD HH:mm"))
                        setCreatedAt(eventToEdit.createdAt)

                        const newEvent: Event = {
                            announcementId: eventToEdit?.announcementId,
                            title: title, 
                            clientId : clientId,
                            startDateTime: currentDate.set('hour', start.hour()).set('minute', start.minute()).format('YYYY-MM-DD HH:mm'),
                            endDateTime: currentDate.set('hour', end.hour()).set('minute', end.minute()).format('YYYY-MM-DD HH:mm'),
                            createdAt: createdAt,
                            updatedAt: updatedAt,
                            state: state,
                            departure: departure,
                            arrival: arrival,
                            criterebuy: criterebuy,
                            prixdecritere: prixdecritere,
                            prixtotal: prixtotal,
                            confort: confort,
                        };
                        editEvent(eventToEdit?.announcementId, newEvent);
                        
                        try {
                            const response = await fetch(`http://localhost:8080/anouncement/simple/update/${eventToEdit.announcementId}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    title: title,
                                    startDateTime: currentDate.set('hour', start.hour()).set('minute', start.minute()).format('YYYY-MM-DD HH:mm'),
                                    endDateTime: currentDate.set('hour', end.hour()).set('minute', end.minute()).format('YYYY-MM-DD HH:mm'),
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
                                setTitle('');
                                setStart(null);
                                setEnd(null);
                                setDeparture('');
                                setArrival('');
                                setConfort(null)
                                setConfort(null)
                                setCreatedAt("")
                                setUpdatedAt("")
                                setDeparture('')
                                setArrival('')
                                setConfort(null)
                                setCriterebuy(null)
                                setPrixdecritere(null)
                                setPrixtotal(null)
                                setShowEventForm1(false)
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


                        setTitle('');
                        setStart(null);
                        setEnd(null);
                        setDeparture('');
                        setArrival('');
                        setConfort(null)
                        setConfort(null)
                        setCreatedAt("")
                        setUpdatedAt("")
                        setDeparture('')
                        setArrival('')
                        setConfort(null)
                        setCriterebuy(null)
                        setPrixdecritere(null)
                        setPrixtotal(null)
                        setShowEventForm1(false)
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

                        setUpdatedAt(dayjs().format("YYYY-MM-DD HH:mm"))
                        setCreatedAt(dayjs().format("YYYY-MM-DD HH:mm"))


                        const val: number = MonthID
                        setMonthID(val + 1);
                        setEventsMonth([...eventsMonth, {
                            announcementId: MonthID,
                            clientId : clientId,
                            title: title,
                            startDateTime: startDateTime,
                            endDateTime: endDateTime,
                            createdAt: createdAt,
                            updatedAt: updatedAt,
                            state: state,
                            departure: departure,
                            arrival: arrival,
                            criterebuy: criterebuy,
                            prixdecritere: prixdecritere,
                            prixtotal: prixtotal,
                            confort: confort
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
                                    startDateTime: startDateTime,
                                    endDateTime: endDateTime,
                                    createdAt: createdAt,
                                    updatedAt: updatedAt,
                                    state: state,
                                    departure: departure,
                                    arrival: arrival,
                                    criterebuy: criterebuy,
                                    prixdecritere: prixdecritere,
                                    prixtotal: prixtotal,
                                    confort: confort
                                }),
                            });

                            if (response.ok) {
                                setTitle('');
                                setStart(null);
                                setEnd(null);
                                setDeparture('');
                                setArrival('');
                                setConfort(null)
                                setConfort(null)
                                setCreatedAt("")
                                setUpdatedAt("")
                                setDeparture('')
                                setArrival('')
                                setConfort(null)
                                setCriterebuy(null)
                                setPrixdecritere(null)
                                setPrixtotal(null)
                                setShowEventForm1(false)
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


                        setTitle('');
                        setStart(null);
                        setEnd(null);
                        setDeparture('');
                        setArrival('');
                        setConfort(null)
                        setConfort(null)
                        setCreatedAt("")
                        setUpdatedAt("")
                        setDeparture('')
                        setArrival('')
                        setConfort(null)
                        setCriterebuy(null)
                        setPrixdecritere(null)
                        setPrixtotal(null)
                        setShowEventForm1(false)

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
            setCriterebuy(eventToEdit.criterebuy)
            setConfort(eventToEdit.confort)
        } else {
            setTitle('');
            setStart(null);
            setEnd(null);
            setDeparture('');
            setArrival('');
            setConfort(null)
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
                    <span className="cursor-pointer mx-2">
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
                            confort={confort}

                            setTitle={(setTitle)}
                            setStart={setStart}
                            setEnd={setEnd}
                            setDeparture={setDeparture}
                            setArrival={setArrival}
                            setConfort={setConfort}

                            state={state}
                            updatedAt={updatedAt}
                            createdAt={createdAt}
                            criterebuy={criterebuy}
                            prixdecritere={prixdecritere}
                            prixtotal={prixtotal}

                            setState={setState}
                            setCreatedAt={setCreatedAt}
                            setUpdatedAt={setUpdatedAt}
                            setCriterebuy={setCriterebuy}
                            setPrixdecritere={setPrixdecritere}
                            setPrixtotal={setPrixtotal}
                        />
                    </div>
                </div>
            )}
            <div>
                {showAlert &&
                    <Alert
                        handleClose={handleClose}
                        errors={errors}
                    />
                }
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
                    className="fixed bottom-4 right-4 bg-primary text-white h-14 flex items-center justify-center hover:shadow-2xl hover:shadow-planing"
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