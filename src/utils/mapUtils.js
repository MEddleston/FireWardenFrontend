// utils/mapUtils.js

export function getRecentWardenEntries(allEntries, timeWindowHours = 24) {
    const now = new Date();
    const timeLimit = new Date(now.getTime() - timeWindowHours * 60 * 60 * 1000);
    const recentEntriesMap = new Map();
  
    allEntries.forEach((entry) => {
      const entryTime = new Date(entry.entry_time);
      if (entryTime >= timeLimit) {
        const existing = recentEntriesMap.get(entry.staff_number);
        if (!existing || new Date(existing.entry_time) < entryTime) {
          recentEntriesMap.set(entry.staff_number, entry);
        }
      }
    });
  
    return Array.from(recentEntriesMap.values());
  }
  
  export function getWardenCountByLocation(entries, locationName) {
    return entries.filter((entry) => entry.location === locationName);
  }
  