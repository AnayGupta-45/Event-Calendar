import React from "react";
import { formatTime } from "../utils/dateUtils";

function EventItem({ event, onDoubleClick }) {
  const handleDoubleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onDoubleClick();
  };

  const bgColor = event.color || "#3b82f6";

  return (
    <div
      className="text-white px-2 py-1 my-1 rounded border border-gray-300 text-xs cursor-pointer transition-all duration-150 shadow-sm truncate select-none"
      onDoubleClick={handleDoubleClick}
      style={{
        backgroundColor: bgColor,
        fontFamily: "'Comic Sans MS', cursive",
        boxShadow: "2px 2px 0 #d1d5db",
      }}
    >
      <div className="truncate">
        {event.title}
        {event.time && (
          <span className="ml-1 opacity-80 text-xs">
            {formatTime(new Date(`${event.date}T${event.time}`))}
          </span>
        )}
        {event.recurrence !== "none" && (
          <span className="ml-1 opacity-80">🔁</span>
        )}
      </div>
    </div>
  );
}

export default EventItem;
