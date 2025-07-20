# Simple Event Calendar

A basic event calendar made with React that any student can understand and modify.

## Features

- 📅 Monthly calendar view
- ➕ Add events by clicking on dates
- ✏️ Edit events by clicking on them
- 🗑️ Delete events with confirmation
- 🔄 Recurring events (daily, weekly, monthly, custom)
- 🎯 Drag and drop to reschedule
- ⚠️ Conflict detection and warnings
- 🔍 Search events by title/description
- 🏷️ Filter by category
- 💾 Auto-save to localStorage
- 📱 Mobile responsive

## Setup

1. Clone and install:
npm install
2. Start development server:
npm run dev

3. Open http://localhost:5173

## How it works

- **Add Event**: Click any date to open the form
- **Edit Event**: Click on an event to edit it
- **Delete Event**: Hover over an event and click the × button
- **Drag & Drop**: Drag events to different dates
- **Search**: Use the search bar to find events
- **Categories**: Filter events by work, personal, study, or other

## Code Structure

- `Calendar.jsx` - Main calendar component
- `EventForm.jsx` - Add/edit event form
- `EventItem.jsx` - Individual event display
- `SearchBar.jsx` - Search and filter component
- `dateUtils.js` - Date helper functions
- `storageUtils.js` - localStorage functions

Simple code that students can easily understand and modify!
