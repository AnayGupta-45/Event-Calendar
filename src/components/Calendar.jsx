import React, { useState, useEffect, useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  getCalendarDays,
  goToNextMonth,
  goToPrevMonth,
  formatMonth,
  formatDate,
} from "../utils/dateUtils";
import { saveEvents, loadEvents } from "../utils/storageUtils";
import EventForm from "./EventForm";
import EventItem from "./EventItem";
import SearchBar from "./SearchBar";

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [selectedDate, setSelectedDate] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [eventsOnSelectedDay, setEventsOnSelectedDay] = useState([]);

  useEffect(() => {
    setEvents(loadEvents());
  }, []);

  useEffect(() => {
    saveEvents(events);
  }, [events]);

  const calendarDays = useMemo(
    () => getCalendarDays(currentDate),
    [currentDate]
  );

  const visibleEvents = useMemo(() => {
    let allEvents = [];

    events.forEach((event) => {
      if (event.recurrence === "none") {
        allEvents.push(event);
      } else {
        allEvents.push(...getRecurringEvents(event));
      }
    });

    if (searchTerm) {
      allEvents = allEvents.filter((e) =>
        `${e.title} ${e.description}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      allEvents = allEvents.filter((e) => e.category === selectedCategory);
    }

    return allEvents;
  }, [events, calendarDays, searchTerm, selectedCategory]);

  function getRecurringEvents(event) {
    const result = [];
    let current = new Date(event.date);
    const end = calendarDays[calendarDays.length - 1].date;
    const start = calendarDays[0].date;

    while (current <= end && result.length < 50) {
      if (current >= start) {
        result.push({
          ...event,
          id: `${event.id}-${formatDate(current)}`,
          date: formatDate(current),
          isRecurring: true,
        });
      }

      const interval = event.customRecurrence?.interval || 1;
      switch (event.recurrence) {
        case "daily":
          current.setDate(current.getDate() + 1);
          break;
        case "weekly":
          current.setDate(current.getDate() + 7);
          break;
        case "monthly":
          current.setMonth(current.getMonth() + 1);
          break;
        case "custom":
          const type = event.customRecurrence?.type || "weeks";
          if (type === "days") current.setDate(current.getDate() + interval);
          if (type === "weeks")
            current.setDate(current.getDate() + 7 * interval);
          if (type === "months")
            current.setMonth(current.getMonth() + interval);
          break;
        default:
          break;
      }
    }

    return result;
  }

  function getEventsForDate(date) {
    return visibleEvents.filter((e) => e.date === formatDate(date));
  }

  function handleDayClick(date, hasEvents) {
    setSelectedDate(date);
    if (hasEvents) {
      setEventsOnSelectedDay(getEventsForDate(date));
      setShowOptions(true);
    } else {
      setEditingEvent(null);
      setShowForm(true);
    }
  }

  function handleAddNewEvent() {
    setShowOptions(false);
    setEditingEvent(null);
    setShowForm(true);
  }

  function handleEventEdit(event) {
    const baseId = event.id.split("-")[0];
    const original = events.find((e) => e.id === baseId || e.id === event.id);
    setEditingEvent(original);
    setShowOptions(false);
    setShowForm(true);
  }

  function handleEventDelete(id) {
    const baseId = id.split("-")[0];
    if (window.confirm("Delete this event?")) {
      setEvents((prev) => prev.filter((e) => e.id !== baseId));
    }
  }

  function handleSave(eventData) {
    if (editingEvent) {
      setEvents((prev) =>
        prev.map((e) => (e.id === editingEvent.id ? eventData : e))
      );
    } else {
      setEvents((prev) => [...prev, eventData]);
    }
    closeAllModals();
  }

  function closeAllModals() {
    setShowForm(false);
    setShowOptions(false);
    setEditingEvent(null);
    setSelectedDate(null);
  }

  function handleDragEnd(result) {
    if (!result.destination) return;

    const eventId = result.draggableId;
    const newDate = result.destination.droppableId;
    const baseId = eventId.split("-")[0];
    const event = events.find((e) => e.id === baseId);

    if (event?.time) {
      const conflicts = getEventsForDate(new Date(newDate)).filter(
        (e) => e.time === event.time && e.id !== baseId
      );
      if (
        conflicts.length > 0 &&
        !window.confirm(`Conflicts with "${conflicts[0].title}". Continue?`)
      ) {
        return;
      }
    }

    setEvents((prev) =>
      prev.map((e) => (e.id === baseId ? { ...e, date: newDate } : e))
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-5 bg-gray-50 min-h-screen">
      <header className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-2xl mb-4 text-center">
        <h1 className="text-3xl font-bold">📅 My Calendar</h1>
      </header>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-5 text-blue-800 text-sm text-center">
        👆 Click to add | ↔️ Drag to reschedule | 🖱️ Double-click to delete
      </div>

      <div className="flex justify-between items-center bg-white rounded-2xl p-5 shadow-sm mb-5">
        <button
          onClick={() => setCurrentDate(goToPrevMonth(currentDate))}
          className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600"
        >
          ‹ Prev
        </button>
        <h2 className="text-2xl font-bold">{formatMonth(currentDate)}</h2>
        <button
          onClick={() => setCurrentDate(goToNextMonth(currentDate))}
          className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600"
        >
          Next ›
        </button>
      </div>

      <SearchBar
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="p-4 text-center font-semibold text-gray-600 text-sm"
            >
              {day}
            </div>
          ))}
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-7">
            {calendarDays.map((day) => {
              const eventsToday = getEventsForDate(day.date);
              const hasEvents = eventsToday.length > 0;

              return (
                <Droppable key={day.dateString} droppableId={day.dateString}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`
                        min-h-[120px] p-2 border-r border-b relative
                        ${
                          day.isToday
                            ? "bg-blue-500 text-white"
                            : "bg-white hover:bg-gray-50"
                        }
                        ${!day.isCurrentMonth ? "bg-gray-50 text-gray-400" : ""}
                        ${
                          snapshot.isDraggingOver
                            ? "bg-blue-50 border-blue-400 border-2 border-dashed"
                            : ""
                        }
                      `}
                      onClick={(e) => {
                        if (
                          e.target === e.currentTarget ||
                          e.target.classList.contains("day-number")
                        ) {
                          handleDayClick(day.date, hasEvents);
                        }
                      }}
                    >
                      <div
                        className={`day-number font-medium mb-1 ${
                          day.isToday ? "text-white font-bold" : ""
                        }`}
                      >
                        {day.date.getDate()}
                      </div>

                      <div className="space-y-1">
                        {eventsToday.slice(0, 4).map((event, i) => (
                          <Draggable
                            key={event.id}
                            draggableId={event.id}
                            index={i}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={
                                  snapshot.isDragging
                                    ? "opacity-70 rotate-2 z-50"
                                    : ""
                                }
                              >
                                <EventItem
                                  event={event}
                                  onDoubleClick={() =>
                                    handleEventDelete(event.id)
                                  }
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {eventsToday.length > 4 && (
                          <div className="text-xs text-gray-500 text-center mt-1">
                            +{eventsToday.length - 4} more
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

      {showOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Choose Action</h3>
            <p className="text-gray-600 mb-4">
              {eventsOnSelectedDay.length} event(s) on this day. What would you
              like to do?
            </p>
            <button
              onClick={handleAddNewEvent}
              className="w-full bg-blue-500 text-white py-2 rounded-lg mb-3"
            >
              Add New
            </button>
            {eventsOnSelectedDay.map((event) => (
              <button
                key={event.id}
                onClick={() => handleEventEdit(event)}
                className="w-full text-left py-2 px-3 mb-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                {event.title} {event.time && ` - ${event.time}`}
              </button>
            ))}
            <button
              onClick={() => setShowOptions(false)}
              className="w-full bg-gray-400 text-white py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <EventForm
          event={editingEvent}
          selectedDate={selectedDate}
          onSave={handleSave}
          onCancel={closeAllModals}
        />
      )}
    </div>
  );
}

export default Calendar;
