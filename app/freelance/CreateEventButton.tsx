import React, { useContext } from 'react';


export default function CreateEventButton() {
  return (
    <div
     className='border p-2 rounded-full flex items-center shadow-md hover:shadow-2xl'
    >
       <h6 className='font-bold text-primary text-center'>les jours occupés en couleur autre que bleu</h6>
    </div>
  );
}
