import { FC, useState, useEffect, useContext, useMemo } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { GlobalContext } from '../context/GlobalContext';
import { Event } from '../interfaces/types';

interface EventFormProps {
    eventToEdit: Event | null;
    clearEdit: () => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    title: string;
    start: Dayjs | null;
    end: Dayjs | null;
    departure: string | null;
    arrival: string | null;
    nbPlace: number | null;
    tarif: number | null;
    setTitle: (title: string) => void;
    setStart: (start: Dayjs | null) => void;
    setEnd: (end: Dayjs | null) => void;
    setDeparture: (departure: string) => void;
    setArrival: (arrival: string) => void;
    setNbPlace: (nbPlace: number) => void;
    setTarif: (tarif: number | null) => void;
    setInitialNbPlace: (np: number | null) => void;
    initialNbPlace: number | null
    TarifTotal: number | null
}

const EventForm: FC<EventFormProps> = ({ TarifTotal, setInitialNbPlace, setNbPlace, setTarif, setArrival, setDeparture, setStart, setEnd, setTitle, handleSubmit, eventToEdit, clearEdit, title, start, end, departure, arrival, nbPlace, tarif }) => {

    return (
        <form className='border border-blue-500 p-4 rounded h-[400px] overflow-auto' onSubmit={handleSubmit}>
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                <div className="bg-blue-100 p-8 rounded-3xl border-[1px] border-secondary shadow-2xl shadow-primary w-full max-w-4xl">
                    <h2 className="text-3xl font-bold mb-6 text-planining text-center">{eventToEdit ? 'Modifier' : 'Ajouter'} une disponibilité</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="block">
                            <span className="text-primary text-lg font-bold">Mot cle personnel</span>
                            <input
                                type="text"
                                required
                                value={title}
                                placeholder="entrer un mot cle personnel ici"
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-1 text-xl text-center  block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </label>
                        <label className="block">
                            <span className="text-primary text-lg font-bold">Lieu de départ</span>
                            <input
                                type="text"
                                required
                                value={departure ?? ""}
                                onChange={(e) => setDeparture(e.target.value)}
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
                            <span className="text-primary text-lg font-bold">Lieu d'arrivée</span>
                            <input
                                type="text"
                                required
                                value={arrival ?? ""}
                                onChange={(e) => setArrival(e.target.value)}
                                className="mt-1 text-xl text-center block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </label>

                        <label className="block">
                            <span className="text-primary text-lg font-bold">Heure De Fin</span>
                            <input
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
                                required
                                className="mt-1 text-xl text-center block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </label>
                        <label className="block">
                            <span className="text-primary text-lg font-bold">Tarif</span>
                            <input
                                type="number"
                                required
                                value={tarif ?? ""}
                                onChange={(e) => setTarif(parseInt(e.target.value))}
                                className="mt-1 text-xl text-center block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </label>

                        <label className="block">
                            <span className="text-primary text-lg font-bold">Nombre de places</span>
                            <input
                                type="number"
                                required
                                value={nbPlace ?? ""}
                                onChange={(e) => {
                                    setNbPlace(parseInt(e.target.value));
                                    setInitialNbPlace(parseInt(e.target.value));
                                }}
                                className="mt-1 text-xl text-center block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            />
                        </label>
                        <label className="block">
                            <span className="text-primary text-lg font-bold">Tarif Total</span>
                            <input
                                type="number"
                                required
                                value={TarifTotal ?? ""}
                                readOnly
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
                            className="bg-gray-600 text-white px-4 py-2 rounded-md shadow hover:bg-gray-500 transition"
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