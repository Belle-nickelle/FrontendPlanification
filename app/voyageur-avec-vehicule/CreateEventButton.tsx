import React, { useContext } from 'react';
import Image from 'next/image';
import { GlobalContext } from './context/GlobalContext';

export default function CreateEventButton() {
  const  {setShowEventModel} = useContext(GlobalContext)
  return (
    <div
     className='border p-2 rounded-full flex items-center shadow-md hover:shadow-2xl'
    >
       <h6 className='font-bold text-blue-600'>les jours occupés en rose </h6>
    </div>
  );
}
