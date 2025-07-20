import React, { useState, useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { 
  getCalendarDays, 
  goToNextMonth, 
  goToPrevMonth, 
  formatMonth,
  formatDate,
  isSameDate
} from '../utils/dateUtils';
import { saveEvents, loadEvents } from '../utils/storageUtils';
import EventForm from './EventForm';
import EventItem from './EventItem';
import SearchBar from './SearchBar';

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showUpdateOptions, setShowUpdateOptions] = useState(false);
  const [dayEventsToUpdate, setDayEventsToUpdate] = useState([]);

  useEffect(() => {
    const savedEvents = loadEvents();
    setEvents(savedEvents);
  }, []);

  useEffect(() => {
    saveEvents(events);
  }, [events]);

  const calendarDays = useMemo(() => getCalendarDays(currentDate), [currentDate]);

  const visibleEvents = useMemo(() => {
    let allEvents = [];
    
    events.forEach(event => {
      if (event.recurrence === 'none') {
        allEvents.push(event);
      } else {
        const recurring = generateRecurringEvents(event, calendarDays[0].date, calendarDays[calendarDays.length - 1].date);
        allEvents.push(...recurring);
      }
    });

    if (searchTerm) {
      allEvents = allEvents.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      allEvents = allEvents.filter(event => event.category === selectedCategory);
    }

    return allEvents;
  }, [events, calendarDays, searchTerm, selectedCategory]);

  function generateRecurringEvents(event, startDate, endDate) {
    const recurring = [];
    const eventDate = new Date(event.date);
    let currentDate = new Date(eventDate);

    while (currentDate <= endDate && recurring.length < 50) {
      if (currentDate >= startDate) {
        recurring.push({
          ...event,
          id: `${event.id}-${formatDate(currentDate)}`,
          date: formatDate(currentDate),
          isRecurring: true
        });
      }

      if (event.recurrence === 'daily') {
        currentDate.setDate(currentDate.getDate() + 1);
      } else if (event.recurrence === 'weekly') {
        currentDate.setDate(currentDate.getDate() + 7);
      } else if (event.recurrence === 'monthly') {
        currentDate.setMonth(currentDate.getMonth() + 1);
      } else if (event.recurrence === 'custom') {
        const interval = event.customRecurrence?.interval || 1;
        const type = event.customRecurrence?.type || 'weeks';
        
        if (type === 'days') {
          currentDate.setDate(currentDate.getDate() + interval);
        } else if (type === 'weeks') {
          currentDate.setDate(currentDate.getDate() + (interval * 7));
        } else if (type === 'months') {
          currentDate.setMonth(currentDate.getMonth() + interval);
        }
      }
    }

    return recurring;
  }

  function getEventsForDate(date) {
    return visibleEvents.filter(event => event.date === formatDate(date));
  }

  function handleDayClick(date) {
    const dayEvents = getEventsForDate(date);
    setSelectedDate(date);
    
    if (dayEvents.length > 0) {
      setDayEventsToUpdate(dayEvents);
      setShowUpdateOptions(true);
    } else {
      setEditingEvent(null);
      setShowEventForm(true);
    }
  }

  function handleAddNew() {
    setShowUpdateOptions(false);
    setEditingEvent(null);
    setShowEventForm(true);
  }

  function handleUpdateExisting(event) {
    setShowUpdateOptions(false);
    const originalEvent = events.find(e => e.id === event.id || e.id === event.id.split('-')[0]);
    setEditingEvent(originalEvent);
    setShowEventForm(true);
  }

  function handleEventClick(event) {
    const originalEvent = events.find(e => e.id === event.id || e.id === event.id.split('-')[0]);
    setEditingEvent(originalEvent);
    setSelectedDate(new Date(originalEvent.date));
    setShowEventForm(true);
  }

  function handleSaveEvent(eventData) {
    if (editingEvent) {
      setEvents(prev => prev.map(e => e.id === editingEvent.id ? eventData : e));
    } else {
      setEvents(prev => [...prev, eventData]);
    }
    closeAllModals();
  }

  function handleDeleteEvent(eventId) {
    const originalId = eventId.includes('-') ? eventId.split('-')[0] : eventId;
    setEvents(prev => prev.filter(e => e.id !== originalId));
  }

  function closeAllModals() {
    setShowEventForm(false);
    setShowUpdateOptions(false);
    setEditingEvent(null);
    setSelectedDate(null);
  }

  function handleDragEnd(result) {
    if (!result.destination) return;

    const eventId = result.draggableId;
    const newDateString = result.destination.droppableId;
    const originalId = eventId.includes('-') ? eventId.split('-')[0] : eventId;
    
    const newDate = new Date(newDateString);
    const draggedEvent = events.find(e => e.id === originalId);
    
    if (draggedEvent && draggedEvent.time) {
      const conflictingEvents = getEventsForDate(newDate).filter(e => 
        e.time === draggedEvent.time && e.id !== originalId
      );
      
      if (conflictingEvents.length > 0) {
        const proceed = window.confirm(
          `This will conflict with "${conflictingEvents[0].title}". Continue anyway?`
        );
        if (!proceed) return;
      }
    }

    setEvents(prev => prev.map(e => 
      e.id === originalId 
        ? { ...e, date: newDateString }
        : e
    ));
  }

  return (
    <div className="calendar-container">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            My Calendar
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentDate(new Date())}
              className="btn-primary"
            >
              Today
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentDate(goToPrevMonth(currentDate))}
                className="btn-secondary"
              >
                ←
              </button>
              <h2 className="px-4 py-2 font-semibold">
                {formatMonth(currentDate)}
              </h2>
              <button
                onClick={() => setCurrentDate(goToNextMonth(currentDate))}
                className="btn-secondary"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      <SearchBar
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-7 bg-green-500">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-3 text-center font-medium text-white">
              {day}
            </div>
          ))}
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="calendar-grid">
            {calendarDays.map(day => {
              const dayEvents = getEventsForDate(day.date);
              
              return (
                <Droppable key={day.dateString} droppableId={day.dateString}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`
                        day-cell
                        ${day.isToday ? 'today' : ''}
                        ${!day.isCurrentMonth ? 'other-month' : ''}
                        ${snapshot.isDraggingOver ? 'drag-over' : ''}
                      `}
                      onClick={() => handleDayClick(day.date)}
                    >
                      <div className="font-medium mb-2">
                        {day.date.getDate()}
                      </div>

                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map((event, index) => (
                          <Draggable
                            key={event.id}
                            draggableId={event.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={snapshot.isDragging ? 'dragging' : ''}
                              >
                                <EventItem
                                  event={event}
                                  onClick={() => handleEventClick(event)}
                                  onDelete={handleDeleteEvent}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>

                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              );
            })}
          </div>
        </DragDropContext>
      </div>

      {showUpdateOptions && (
        <div className="modal">
          <div className="modal-content">
            <h3 className="text-lg font-bold mb-4">Choose Action</h3>
            <p className="text-gray-600 mb-4">
              This day has {dayEventsToUpdate.length} event(s). What would you like to do?
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleAddNew}
                className="w-full btn-primary"
              >
                Add New Event
              </button>
              
              <div className="text-sm font-medium text-gray-700 mb-2">Or update existing:</div>
              {dayEventsToUpdate.map(event => (
                <button
                  key={event.id}
                  onClick={() => handleUpdateExisting(event)}
                  className="w-full p-2 text-left border rounded hover:bg-gray-50"
                >
                  {event.title} {event.time && `- ${event.time}`}
                </button>
              ))}
              
              <button
                onClick={() => setShowUpdateOptions(false)}
                className="w-full btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showEventForm && (
        <EventForm
          event={editingEvent}
          selectedDate={selectedDate}
          onSave={handleSaveEvent}
          onCancel={closeAllModals}
        />
      )}
    </div>
  );
}

export default Calendar;
