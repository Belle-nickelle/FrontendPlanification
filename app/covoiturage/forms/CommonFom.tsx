import { FC, KeyboardEvent } from 'react';
import { Event } from '../interfaces/types';

interface EventFormProps {
  departure: string | ""; 
  title : string | ""
  setTitle : (t : string)=>void
  setDeparture: (departure: string) => void;
  arrival: string | "";
  setArrival: (arrival: string) => void;
  startDate: string
  setStartDate: (p: string) => void
  endDate: string
  setEndDate: (p: string) => void
  tarif : number | null
  setTarif : (t : number | null) => void
  nbPlace : number | null 
  setNbPlace : (n : number | null) => void 
  setInitialNbPlace : (n : number | null) => void
  TarifTotal : number | null
  

  handleFormSubmit: (e: KeyboardEvent<HTMLFormElement>) => void;
  handleDelete: (eventId: number) => void
  handleCancel: () => void
  handleKeyPress: (e: KeyboardEvent<HTMLFormElement>) => void
  selectedEvent: Event | null
}

const CommonFom: FC<EventFormProps> = ({TarifTotal, setTarif, setInitialNbPlace,setNbPlace, tarif, nbPlace, title,setTitle, setEndDate, endDate, handleCancel, handleDelete, setStartDate, startDate, selectedEvent, handleFormSubmit, departure, handleKeyPress, setArrival, setDeparture, arrival }) => {
  return (
    <div>
     <form className='border border-blue-500 p-4 rounded h-[400px] overflow-auto' onSubmit={handleFormSubmit} onKeyPress={handleKeyPress}>
            <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
              <div className="bg-blue-100 p-8 rounded-3xl border-[1px] border-secondary shadow-2xl shadow-primary w-full max-w-4xl">
                <h2 className="text-3xl font-bold mb-6 text-planining text-center">{selectedEvent ? 'Modifier' : 'Ajouter'} une disponibilité</h2>
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
                      value={departure}
                      placeholder='entrer un lieu'
                      onChange={(e) => setDeparture(e.target.value)}
                      className="mt-1 text-xl text-center block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </label>

                  <label className="block">
                    <span className="text-primary text-lg font-bold">Date de début</span>
                    <input
                      type="datetime-local"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="mt-1 text-xl text-gray-700 text-center block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </label>


                  <label className="block">
                    <span className="text-primary text-lg font-bold">Lieu d'arrivée</span>
                    <input
                      type="text"
                      required
                      value={arrival}
                      placeholder='entrer un lieu'
                      onChange={(e) => setArrival(e.target.value)}
                      className="mt-1 text-xl text-center block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </label>
                  <label className="block">
                    <span className="text-primary text-lg font-bold">Date de fin</span>
                    <input
                      type="datetime-local"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="mt-1 text-gray-700 text-xl text-center block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </label>

                  <label className="block">
                    <span className="text-primary text-lg font-bold">Tarif correspondant</span>
                    <input
                      type="number"
                      required
                      value={tarif ?? ""}
                      placeholder='entrer un tarif'
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
                      placeholder='entrer un nombre de place'
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
                    className="bg-gray-600 text-white px-4 py-2 rounded-md shadow hover:bg-gray-500 transition"
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