import { FC, useState, useEffect, useContext, useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { GlobalContext } from '../context/GlobalContext';
import { Event, CritereBuy } from '../interfaces/types';

interface EventFormProps {
    eventToEdit: Event | null;
    clearEdit: () => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    title: string;
    start: Dayjs | null;
    end: Dayjs | null;
    departure: string | null;
    arrival: string | null;
    setTitle: (title: string) => void;
    setStart: (start: Dayjs | null) => void;
    setEnd: (end: Dayjs | null) => void;
    setDeparture: (departure: string) => void;
    setArrival: (arrival: string) => void;
    prixdecritere: number | null;
    prixtotal: number | null;
    criterebuy: CritereBuy | null;
    setPrixdecritere: (p: number | null) => void
    setCriterebuy: (p: CritereBuy | null) => void
}


const EventForm: FC<EventFormProps> = ({ criterebuy, setCriterebuy, prixdecritere, setPrixdecritere, prixtotal, setArrival, setDeparture, setStart, setEnd, setTitle, handleSubmit, eventToEdit, clearEdit, title, start, end, departure, arrival }) => {

    const { eventsMonth, setEventsMonth } = useContext(GlobalContext);





    return (
        <form onSubmit={handleSubmit}>
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                <div className="bg-blue-100 p-8 rounded-3xl border-[1px] border-secondary shadow-2xl shadow-primary w-full max-w-4xl">
                    <h2 className="text-3xl font-bold mb-6 text-planining text-center">{eventToEdit ? 'Modifier' : 'Ajouter'} un voyage</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="block">
                            <span className="text-primary text-lg font-bold">Lieu de départ</span>
                            <input
                                type="text"
                                required
                                value={departure ?? ""}
                                placeholder='ajouter un lieu ici'
                                onChange={(e) => setDeparture(e.target.value)}
                                className="mt-1 text-xl text-center block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </label>
                        <label className="block">
                            <span className="text-primary text-lg font-bold">Critere de paiement : </span>
                            <select
                                required
                                value={criterebuy ?? ""}
                                onChange={(e) => setCriterebuy(e.target.value as CritereBuy)}
                                className="mt-1  text-xl text-center block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            >
                                <option value="" disabled>-- un critere de paiement --</option>
                                {Object.values(CritereBuy).map((crit) => (
                                    <option key={crit} value={crit}>
                                        {crit}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="block">
                            <span className="text-primary text-lg font-bold">Lieu d'arrivée</span>
                            <input
                                type="text"
                                required
                                value={arrival ?? ""}
                                placeholder='ajouter un lieu ici'
                                onChange={(e) => setArrival(e.target.value)}
                                className="mt-1 text-xl text-center block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </label>
                        <label className="block">
                            <span className="text-primary text-lg font-bold">Tarif correspondant </span>
                            <input
                                type="number"
                                required
                                value={prixdecritere ?? ""}
                                placeholder='entrer un tarif horaire'
                                onChange={(e) => { setPrixdecritere(parseInt(e.target.value)) }
                                }
                                className="mt-1 text-xl text-center block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </label>
                        <label className="block">
                            <span className="text-primary text-lg font-bold">Heure de Début</span>
                            <input
                                type="time"
                                value={start?.format('HH:mm')}
                                onChange={(e) => {
                                    const [hours, minutes] = e.target.value.split(':');
                                    const newStart = dayjs()
                                        .hour(parseInt(hours))
                                        .minute(parseInt(minutes));
                                    setStart(newStart);
                                    if (end && newStart.isAfter(end)) {
                                        setEnd(newStart);
                                    }
                                }}
                                required
                                className="mt-1 text-xl text-center block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </label>
                        <label className="block">
                            <span className="text-primary text-lg font-bold">Tarif total</span>
                            <input
                                type="number"
                                value={prixtotal ?? ""}
                                readOnly
                                placeholder="le tarif total s'affiche ici"
                                className="mt-1 text-xl text-center block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </label>
                        <label className="block">
                            <span className="text-primary text-lg font-bold">Heure De Fin</span>
                            <input
                                required
                                type="time"
                                value={end?.format('HH:mm')}
                                onChange={(e) => {
                                    const [hours, minutes] = e.target.value.split(':');
                                    const newEnd = dayjs()
                                        .hour(parseInt(hours))
                                        .minute(parseInt(minutes));
                                    setEnd(newEnd);
                                    if (start && newEnd.isBefore(start)) {
                                        setStart(newEnd);
                                    }
                                }}
                                className="mt-1 text-xl text-center block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </label>
                    </div>
                    <div className="mt-6 flex justify-end space-x-4">
                        <button
                            type='submit'
                            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition"
                        >
                            {eventToEdit ? 'Modifier' : 'Valider'}
                        </button>

                        <button
                            onClick={clearEdit}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md shadow hover:bg-gray-600 transition"
                        >
                            quitter
                        </button>
                    </div>
                </div>
            </div>
        </form>

    );
};

export default EventForm;