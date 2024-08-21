import { FC } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Event } from './interfaces/types';

interface EventProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: number) => void;
}

const Event1: FC<EventProps> = ({ event, onEdit, onDelete }) => {

  const start = dayjs(event.startDateTime).format("HH:mm");
  const end = dayjs(event.endDateTime).format("HH:mm");

  const duration = dayjs(event.endDateTime).diff(dayjs(event.startDateTime), 'minute');

  return (
    <div
      className="bg-blue-200 rounded-lg p-2 m-1 relative"
      style={{ height: `${duration}px` }}
    >
      <h4 className="font-bold">{event.title}</h4>
      <p className="text-sm">
        {start} - {end}
      </p>
      <div className="absolute top-0 right-0 flex space-x-1">
        <button
          onClick={() => onEdit(event)}
          className="text-xs text-blue-600"
        >
          Éditer
        </button>
        <button
          onClick={() => onDelete(event.AnounceId)}
          className="text-xs text-red-600"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
};

export default Event1;