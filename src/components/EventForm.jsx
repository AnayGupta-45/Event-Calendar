import React, { useState, useEffect } from 'react';
import { formatDate } from '../utils/dateUtils';

function EventForm({ event, selectedDate, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    time: '',
    description: '',
    category: 'personal',
    color: '',
    recurrence: 'none',
    customRecurrence: { interval: 1, type: 'weeks' }
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        time: event.time || '',
        description: event.description || '',
        category: event.category || 'personal',
        color: event.color || '',
        recurrence: event.recurrence || 'none',
        customRecurrence: event.customRecurrence || { interval: 1, type: 'weeks' }
      });
    }
  }, [event]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Please enter an event title');
      return;
    }

    const eventData = {
      id: event?.id || Date.now().toString(),
      ...formData,
      date: selectedDate ? formatDate(selectedDate) : event?.date
    };

    onSave(eventData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCustomRecurrenceChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      customRecurrence: {
        ...prev.customRecurrence,
        [field]: value
      }
    }));
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2 className="text-xl font-bold mb-4">
          {event ? 'Edit Event' : 'Add New Event'}
        </h2>

        {selectedDate && (
          <div className="bg-green-50 p-3 rounded-lg mb-4">
            <p className="text-green-800">
              Date: {selectedDate.toLocaleDateString()}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Event Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter event title"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Time
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-input"
              rows="3"
              placeholder="Event description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-input"
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="study">Study</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Color
              </label>
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="form-input h-10 cursor-pointer"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Repeat
            </label>
            <select
              name="recurrence"
              value={formData.recurrence}
              onChange={handleChange}
              className="form-input"
            >
              <option value="none">No repeat</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {formData.recurrence === 'custom' && (
            <div className="mb-4 bg-gray-50 p-3 rounded-lg">
              <label className="block text-sm font-medium mb-2">
                Custom Repeat Pattern
              </label>
              <div className="flex gap-2">
                <span className="py-2">Every</span>
                <input
                  type="number"
                  min="1"
                  max="52"
                  value={formData.customRecurrence.interval}
                  onChange={(e) => handleCustomRecurrenceChange('interval', parseInt(e.target.value))}
                  className="w-16 px-2 py-1 border rounded"
                />
                <select
                  value={formData.customRecurrence.type}
                  onChange={(e) => handleCustomRecurrenceChange('type', e.target.value)}
                  className="px-2 py-1 border rounded"
                >
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {event ? 'Update Event' : 'Add Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventForm;
