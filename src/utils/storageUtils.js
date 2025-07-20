const STORAGE_KEY = 'calendar-events';

export function saveEvents(events) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (error) {
    console.log('Error saving events:', error);
  }
}

export function loadEvents() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.log('Error loading events:', error);
    return [];
  }
}
