import React from 'react';
import CreateEventButton from './CreateEventButton';
import SmallCalendar from './SmallClendar';

export default function SideBar() {
  return (
    <div>
      <aside className='border p-5 w-64'>
        <CreateEventButton/>
        <SmallCalendar/>
      </aside>
    </div>
  );
}
