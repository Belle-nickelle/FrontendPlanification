
import React, { useContext, useState, useEffect, KeyboardEvent } from 'react';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import Image from 'next/image';
import { GlobalContext } from '../context/GlobalContext';
import { Dayjs } from 'dayjs';
import { Event } from '../interfaces/types';
import { formError } from '../interfaces/types';
import Alert from '../alerts/alert';
import CommonFom from '../forms/CommonFom';



dayjs.extend(localizedFormat);

const WeeklyCalendar: React.FC = () => {

    const { eventsMonth, setEventsMonth } = useContext(GlobalContext);

    const { MonthID, setMonthID } = useContext(GlobalContext);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>(dayjs().startOf('week').format('YYYY-MM-DD'));
    const [weekOffset, setWeekOffset] = useState<number>(0);
    const [createdAt, setCreatedAt] = useState("")
    const [updateAt, setUpdateAt] = useState("")
    const vehicleId = "1234"
    const driverId = "907b3dca-a29a-4b3e-961c-7d44c5e3d7d2"
    const [TarifTotal, setTarifTotal] = useState<number | null>(null)

    const [state, setState] = useState("AVAILABLE")


    const [title, setTitle] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [tarif, setTarif] = useState<number | null>(null)
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const [departure, setDeparture] = useState<string>('')
    const [arrival, setArrival] = useState<string>('')
    const [nbPlace, setNbPlace] = useState<number | null>(null)
    const [initialNbPlace, setInitialNbPlace] = useState<number | null>(null)

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

    const daysOfWeek = Array.from({ length: 7 }, (_, i) => dayjs().startOf('week').add(i + weekOffset * 7, 'day'));

    const handleAvailabilityClick = (event: Event) => {
        setSelectedEvent(event);
        setTitle(event.title)
        setStartDate(dayjs(event.startDateTime).format('YYYY-MM-DD'));
        setStartTime(dayjs(event.startDateTime).format('HH:mm'));
        setEndDate(dayjs(event.endDateTime).format('YYYY-MM-DD'));
        setEndTime(dayjs(event.endDateTime).format('HH:mm'));
        setDeparture(event.departure)
        setArrival(event.arrival)
        setNbPlace(event.nbPlace)
        setTarif(event.tarif)
        setShowForm(true);
        setCreatedAt(event.createdAt)
        setUpdateAt(event.updatedAt)
        setInitialNbPlace(event.initialNbPlace)
    };

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

      const handleKeyPress = (e: KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter') {
          handleFormSubmit();
        }
      };

    const handleFormSubmit = async () => {
        if (startDate && endDate && startTime && endTime && title && departure && arrival && nbPlace && tarif) {
            const startDateTime = `${startDate}T${startTime}`;
            const endDateTime = `${endDate}T${endTime}`;

            const startDate1 = dayjs(startDateTime);
            const endDate1 = dayjs(endDateTime);
            const currentDate = dayjs().startOf('day')
            const start = dayjs(startDate).startOf('day')

            if (selectedEvent) {
                if (startDate1.isBefore(endDate1)) {

                    if (currentDate.isBefore(start) || currentDate.isSame(start)) {

                        setUpdateAt(dayjs().format("YYYY/MM/DD HH"))
                        setCreatedAt(selectedEvent.createdAt)
                        const updatedAt = updateAt

                        //setEventsMonth(eventsMonth.map(av => av.id === selectedEvent.id ? { ...av, title, startDateTime, endDateTime, departure, arrival, nbPlace, tarif } : av));

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
                        setCreatedAt(dayjs().format("YYYY/MM/DD HH"))
                        const updatedAt = updateAt

                        /*
                        const val = MonthID;
                        setMonthID(val + 1)
                        setEventsMonth([...eventsMonth, { id: MonthID, title, startDateTime, endDateTime, departure, arrival, nbPlace, tarif }]);
                        */
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
            setTarifTotal(tarif * nbPlace)
        }
    }, [tarif, nbPlace, TarifTotal]);

    const handleDelete = async (id: number) => {
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
                setTarif(null)
                setInitialNbPlace(null)
                setNbPlace(null)
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


        // setEventsMonth(eventsMonth.filter(av => av.id !== id));

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
                    </button></div>
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
                        TarifTotal={TarifTotal}
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

            export default WeeklyCalendar;
