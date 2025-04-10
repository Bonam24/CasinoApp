export const getUserTimezone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  };
  
  export const formatMatchTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: getUserTimezone()
    });
  };
  
  export const formatMatchDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      timeZone: getUserTimezone()
    });
  };
  
  export const formatDateTime = (dateString) => {
    return `${formatMatchDate(dateString)} ${formatMatchTime(dateString)}`;
  };