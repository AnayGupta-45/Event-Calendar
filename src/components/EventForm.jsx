import React, { useState, useEffect } from "react";
import { formatDate } from "../utils/dateUtils";

function EventForm({ event, selectedDate, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    time: "",
    description: "",
    category: "personal",
    color: "#3b82f6",
    recurrence: "none",
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        time: event.time || "",
        description: event.description || "",
        category: event.category || "personal",
        color: event.color || "#3b82f6",
        recurrence: event.recurrence || "none",
      });
    }
  }, [event]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return alert("Enter a title");

    const eventData = {
      id: event?.id || Date.now().toString(),
      ...formData,
      date: selectedDate ? formatDate(selectedDate) : event?.date,
    };

    onSave(eventData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const presetColors = [
    { label: "Blue", value: "#3b82f6" },
    { label: "Green", value: "#10b981" },
    { label: "Red", value: "#ef4444" },
    { label: "Purple", value: "#8b5cf6" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-5 rounded-lg w-full max-w-sm shadow border-2 border-blue-200">
        <h2
          className="text-xl font-bold mb-3 text-blue-700 text-center"
          style={{ fontFamily: "'Comic Sans MS', cursive" }}
        >
          {event ? "Edit Event" : "New Event"}
        </h2>

        {selectedDate && (
          <div className="text-sm mb-3 text-gray-700 text-center">
            Date: <strong>{selectedDate.toLocaleDateString()}</strong>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-400 rounded px-3 py-2 focus:outline-none"
            placeholder="Event Title"
            required
          />

          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full border border-gray-400 rounded px-3 py-2 focus:outline-none"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-400 rounded px-3 py-2 focus:outline-none"
            placeholder="Description"
            rows="2"
          />

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-gray-400 rounded px-3 py-2 focus:outline-none"
          >
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="study">Study</option>
            <option value="other">Other</option>
          </select>

          <div className="flex gap-2 items-center">
            {presetColors.map((color) => (
              <label key={color.value} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="color"
                  value={color.value}
                  checked={formData.color === color.value}
                  onChange={handleChange}
                />
                <span
                  className="w-4 h-4 rounded-full inline-block border border-gray-400"
                  style={{ backgroundColor: color.value }}
                ></span>
              </label>
            ))}
          </div>

          <select
            name="recurrence"
            value={formData.recurrence}
            onChange={handleChange}
            className="w-full border border-gray-400 rounded px-3 py-2 focus:outline-none"
          >
            <option value="none">No Repeat</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded border border-gray-400 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-200 text-blue-900 rounded border border-blue-400 hover:bg-blue-300"
            >
              {event ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventForm;
