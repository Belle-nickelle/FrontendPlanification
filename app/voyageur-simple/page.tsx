"use client"

import React from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
dayjs.locale('fr');
import Home from './main';
import ContextWrapper from './context/ContextWrapper';
import { useRouter } from 'next/navigation';
import Image from 'next/image';



export default function CAV() {
    const router = useRouter();

    const handleClick = () => {
        router.push("/");
    };

    return (
        <div className="h-screen flex flex-col">
            <ContextWrapper>
                <div>
                    <Home />
                </div>
            </ContextWrapper>
            <button
                onClick={handleClick}
                className="fixed bottom-4 left-4 bg-primary text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-700"
            ><span className="cursor-pointer text-blue-600 mx-2">
                    <Image
                        src="/images/out.svg"
                        alt="chevron"
                        width={25}
                        height={25}
                        priority
                    />
                </span>
            </button>
        </div>
    );
}

