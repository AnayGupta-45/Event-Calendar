import React from 'react';
import { formatTime } from '../utils/dateUtils';

function EventSelectionModal({ isOpen, onClose, events, onSelectEvent, selectedDate }) {
  if (!isOpen) return null;

  const dateString = selectedDate?.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="action-modal">
      <div className="action-modal-content">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          ✏️ Select Event to Update
        </h3>
        
        <div className="bg-gradient-to-r from-green-50 to-purple-50 p-3 rounded-lg mb-4">
          <p className="text-sm text-gray-700 font-medium text-center">
            {dateString}
          </p>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {events.map(event => (
            <button
              key={event.id}
              onClick={() => onSelectEvent(event)}
              className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gradient-to-r hover:from-green-50 hover:to-purple-50 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: event.color || '#10b981' }}
                  ></div>
                  <div>
                    <div className="font-medium text-gray-800">{event.title}</div>
                    {event.time && (
                      <div className="text-xs text-gray-500 mt-1">
                        ⏰ {formatTime(new Date(`${event.date}T${event.time}`))}
                      </div>
                    )}
                    {event.description && (
                      <div className="text-xs text-gray-600 mt-1 truncate">
                        {event.description}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {event.category}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full btn-ghost"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventSelectionModal;
