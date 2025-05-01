export function FormatDate(dateStr) {
    const date = new Date(dateStr);
    const day = date.getDate();
  
    const getOrdinal = (n) => {
      if (n > 3 && n < 21) return 'th';
      switch (n % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
  
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
  
    return `${day}${getOrdinal(day)} ${month} ${year}`;
  }
  