import React from 'react';
import { formatTime } from '../utils/dateUtils';

function EventItem({ event, onClick, onDelete }) {
  const colors = {
    work: '#3b82f6',
    personal: '#10b981', 
    study: '#f59e0b',
    other: '#8b5cf6'
  };

  const backgroundColor = event.color || colors[event.category] || '#10b981';

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${event.title}"?`)) {
      onDelete(event.id);
    }
  };

  return (
    <div 
      className="event-item group relative"
      style={{ backgroundColor }}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{event.title}</div>
          {event.time && (
            <div className="text-xs opacity-90">
              {formatTime(new Date(`${event.date}T${event.time}`))}
            </div>
          )}
          {event.recurrence !== 'none' && (
            <div className="text-xs opacity-75">
              🔁 {event.recurrence}
            </div>
          )}
        </div>
        
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 text-white hover:text-red-200 ml-1"
          title="Delete event"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default EventItem;
