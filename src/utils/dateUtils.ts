export const formatTimeDisplay = (timeStr: string): string => {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayHours = h % 12 || 12;
  return `${displayHours}:${String(m).padStart(2, '0')} ${period}`;
};

export const formatDateDisplay = (dateStr: string): string => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

export const formatFullDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

export const getRelativeDueText = (dateStr: string, timeStr: string): { text: string; isOverdue: boolean; isToday: boolean } => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const [h, min] = timeStr.split(':').map(Number);
  const target = new Date(y, m - 1, d, h, min, 0);
  const now = new Date();

  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const isToday = dateStr === todayStr;

  const diffMs = target.getTime() - now.getTime();
  const isOverdue = diffMs < 0;
  const absDiff = Math.abs(diffMs);

  const diffMins = Math.floor(absDiff / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (isOverdue) {
    if (diffDays > 0) return { text: `Overdue by ${diffDays}d`, isOverdue: true, isToday };
    if (diffHours > 0) return { text: `Overdue by ${diffHours}h`, isOverdue: true, isToday };
    return { text: `Overdue by ${Math.max(1, diffMins)}m`, isOverdue: true, isToday };
  }

  if (isToday) {
    if (diffHours > 0) return { text: `Today, in ${diffHours}h ${diffMins % 60}m`, isOverdue: false, isToday: true };
    return { text: `Today, in ${Math.max(1, diffMins)}m`, isOverdue: false, isToday: true };
  }

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

  if (dateStr === tomorrowStr) {
    return { text: `Tomorrow at ${formatTimeDisplay(timeStr)}`, isOverdue: false, isToday: false };
  }

  if (diffDays < 7) {
    const weekday = target.toLocaleDateString('en-US', { weekday: 'short' });
    return { text: `${weekday} at ${formatTimeDisplay(timeStr)}`, isOverdue: false, isToday: false };
  }

  return { text: `${formatDateDisplay(dateStr)}`, isOverdue: false, isToday: false };
};

export const getCountdown = (dateStr: string, timeStr: string): string => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const [h, min] = timeStr.split(':').map(Number);
  const target = new Date(y, m - 1, d, h, min, 0);
  const now = new Date();

  const diffMs = target.getTime() - now.getTime();
  if (diffMs <= 0) return 'Deadline reached';

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);

  if (days > 0) return `${days}d ${hours}h ${minutes}m left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
};

export const getGreeting = (name: string): string => {
  const hour = new Date().getHours();
  let timeGreeting = 'Good morning';
  if (hour >= 12 && hour < 17) {
    timeGreeting = 'Good afternoon';
  } else if (hour >= 17) {
    timeGreeting = 'Good evening';
  }
  return `${timeGreeting}, ${name.split(' ')[0] || 'Rahul'} 👋`;
};

export const STUDENT_QUOTES = [
  'Consistency beats intensity every single semester.',
  'Small daily efforts lead to big semester results.',
  'Your future self will thank you for studying today.',
  'Organized minds make great engineering breakthroughs.',
  'Focus on progress, not perfection.',
  'Finish assignments early and enjoy the weekend stress-free.',
];

export const getRandomQuote = (): string => {
  const index = Math.floor(Math.random() * STUDENT_QUOTES.length);
  return STUDENT_QUOTES[index];
};
