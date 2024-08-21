import { FC, KeyboardEvent } from 'react';
import { Event } from '../interfaces/types';
import { CritereBuy } from '../interfaces/types';

interface EventFormProps {
  departure: string | "";
  setDeparture: (departure: string) => void;
  arrival: string | "";
  setArrival: (arrival: string) => void;
  prixdecritere: number | null;
  setPrixdecritere: (p: number | null) => void
  startDate: string
  setStartDate: (p: string) => void
  endDate: string
  setEndDate: (p: string) => void
  prixtotal: number | null;
  setPrixtotal: (p: number | null) => void
  criterebuy: CritereBuy | null;
  setCriterebuy: (p: CritereBuy | null) => void

  handleFormSubmit: (e: KeyboardEvent<HTMLFormElement>) => void;
  handleDelete: (eventId: number) => void
  handleCancel: () => void
  handleKeyPress: (e: KeyboardEvent<HTMLFormElement>) => void
  selectedEvent: Event | null
}

const CommonFom: FC<EventFormProps> = ({ setEndDate, endDate, handleCancel, handleDelete, setStartDate, startDate, selectedEvent, handleFormSubmit, departure, handleKeyPress, setCriterebuy, setPrixdecritere, prixtotal, prixdecritere, criterebuy, setArrival, setDeparture, arrival }) => {
  return (
    <div>
      <form onSubmit={handleFormSubmit} onKeyPress={handleKeyPress}>
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-blue-100 p-8 rounded-3xl border-[1px] border-secondary shadow-2xl shadow-primary w-full max-w-4xl">
            <h2 className="text-3xl font-bold mb-6 text-planining text-center">{selectedEvent ? 'Modifier' : 'Ajouter'} un voyage</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="block">
                <span className="text-primary text-lg font-bold">Lieu de départ</span>
                <input
                  type="text"
                  required
                  value={departure}
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
                  value={arrival}
                  placeholder='ajouter un lieu ici'
                  onChange={(e) => setArrival(e.target.value)}
                  className="mt-1 text-xl text-center block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="text-primary text-lg font-bold">Tarif correspondant en <span className='text-orange-500 font-bold'>FCFA</span></span>
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
                <span className="text-primary text-lg font-bold">Date de début</span>
                <input
                  type="datetime-local"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1 text-xl text-center block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>
              <label className="block">
                <span className="text-primary text-lg font-bold">Tarif total en <span className='text-orange-500 font-bold'>FCFA</span></span>
                <input
                  type="number"
                  value={prixtotal ?? ""}
                  readOnly
                  placeholder="le tarif total s'affiche ici"
                  className="mt-1 text-xl text-center block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>

              <label className="block">
                <span className="text-primary text-lg font-bold">Date de fin</span>
                <input
                  required
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1 text-xl text-center block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                type='submit'
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition"
              >
                {selectedEvent ? 'Modifier' : 'Valider'}
              </button>
              {selectedEvent && (
                <button
                  onClick={() => handleDelete(selectedEvent.planingId)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600 transition"
                >
                  Supprimer
                </button>
              )}
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded-md shadow hover:bg-gray-600 transition"
              >
                quitter
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}


export default CommonFom