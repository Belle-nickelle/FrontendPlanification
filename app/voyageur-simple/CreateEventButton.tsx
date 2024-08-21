import React, { useContext } from 'react';
import Image from 'next/image';
import { GlobalContext } from './context/GlobalContext';

export default function CreateEventButton() {
  const  {setShowEventModel} = useContext(GlobalContext)
  return (
    <div
     className='border p-2 rounded-full flex items-center shadow-md hover:shadow-2xl'
    >
       <h6 className='font-bold text-primary text-center'>les jours occupés autre que bleu </h6>
    </div>
  );
}
