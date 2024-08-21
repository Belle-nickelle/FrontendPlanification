import React from 'react';
import { useContext } from 'react';
import Image from 'next/image';
import { GlobalContext } from './context/GlobalContext';

export default function EventModel() {
const  {setShowEventModel} = useContext(GlobalContext)
  return (
    <div className='h-screen w-full fixed left-0 top-0 flex justify-center items-center'>
        <form className='bg-blue-500 rounded-lg shadow-2xl w-1/4'>
            <header className='bg-orange-500 px-4 py-2 flex justify-between items-center'>
                <span>
                <Image
                    src="/images/equal.svg"
                    alt="Image Google"
                    width={30}
                    height={30}
                    priority
                />
                </span>
                <button
                onClick={() => setShowEventModel(false)}
                >
                <span>
                <Image
                    src="/images/close.svg"
                    alt="Image Google"
                    width={30}
                    height={30}
                    priority
                />
                </span>
                </button>
            </header>
            <div className='p-3 bg-gray'>
                <div className='grid grid-cols-1/5 items-end gap-y-7'>
                    <div></div>
                    <input type="text" />
                </div>
            </div>
        </form>
    </div>
  );
}
