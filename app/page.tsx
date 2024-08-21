'use client';

import React from 'react';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import 'dayjs/locale/fr';
dayjs.locale('fr');


export default function App() {

  const router = useRouter();


  const goToVAV = () => {
    router.push('/freelance');
  };

  const goToVS = () => {
    router.push('/voyageur-simple');
  };
  const goToCAV = () => {
    router.push('/covoiturage');
  };
  const goToCSV = () => {
    router.push('/voyageur-avec-vehicule');
  };

  return (
    <div id='background' className="h-screen flex flex-row items-center justify-center" style={{
      backgroundImage: `../public/images/backGroundImage.png`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      width: '100vw',
      height: '100vh',
    }}>
      <div className='flex flex-col items-center justify-center m-10'>
        <div className="w-full m-10 bg-gray-200 bg-opacity-50 p-5 rounded-lg">
          <button
            className="bg-black text-orange-400 p-5 w-full shadow-xl shadow-yellow-400 hover:bg-gray-700 hover:text-white text-xl font-medium rounded-e-full"
            onClick={goToVAV}
          >
            Freelance
          </button>
        </div>
        <div className="w-full m-10 bg-gray-200 bg-opacity-50 p-5 rounded-lg">
          <button
             className="bg-black text-orange-400 p-5 w-full shadow-xl shadow-yellow-400 hover:bg-gray-700 hover:text-white text-xl font-medium rounded-e-full"
             onClick={goToVS}
          >
            Voyageur simple
          </button>
        </div>
      </div>
      <div className='flex flex-col items-center justify-center m-10'>
      <div className="w-full m-10 bg-gray-200 bg-opacity-50 p-5 rounded-lg">
          <button
             className="bg-black text-orange-400 p-5 w-full shadow-xl shadow-yellow-400 hover:bg-gray-700 hover:text-white text-xl font-medium rounded-s-full"
             onClick={goToCAV}
          >
            Covoiturage
          </button>
        </div>
        <div className="w-full m-10 bg-gray-200 bg-opacity-50 p-5 rounded-lg">
          <button
             className="bg-black text-orange-400 p-5 w-full shadow-xl shadow-yellow-400 hover:bg-gray-700 hover:text-white text-xl font-medium rounded-s-full"
             onClick={goToCSV}
          >
            Voyageur Avec Véhicule
          </button>
        </div>
      </div>
    </div>
  );
}
