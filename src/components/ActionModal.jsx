import React from 'react';

function ActionModal({ isOpen, onClose, onAddNew, onUpdateExisting, existingEvents, selectedDate }) {
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
        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
          📅 What would you like to do?
        </h3>
        
        <div className="bg-gradient-to-r from-green-50 to-purple-50 p-3 rounded-lg mb-6">
          <p className="text-sm text-gray-700 text-center">
            <span className="font-medium">{dateString}</span>
          </p>
          {existingEvents.length > 0 && (
            <p className="text-xs text-gray-600 text-center mt-1">
              {existingEvents.length} event(s) on this day
            </p>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={onAddNew}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <span>✨</span>
            Add New Event
          </button>

          {existingEvents.length > 0 && (
            <button
              onClick={onUpdateExisting}
              className="w-full btn-secondary flex items-center justify-center gap-2"
            >
              <span>✏️</span>
              Update Existing Event
            </button>
          )}

          <button
            onClick={onClose}
            className="w-full btn-ghost"
          >
            Cancel
          </button>
        </div>

        {existingEvents.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Events on this day:</p>
            <div className="space-y-1">
              {existingEvents.slice(0, 3).map(event => (
                <div key={event.id} className="text-xs bg-gray-100 p-2 rounded flex items-center">
                  <span className="w-2 h-2 rounded-full mr-2" 
                        style={{ backgroundColor: event.color || '#10b981' }}></span>
                  <span className="font-medium">{event.title}</span>
                  {event.time && <span className="ml-auto text-gray-500">{event.time}</span>}
                </div>
              ))}
              {existingEvents.length > 3 && (
                <div className="text-xs text-gray-500 text-center">
                  +{existingEvents.length - 3} more events
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ActionModal;
