import { Reminder } from '../types';

export const getInitialDemoReminders = (): Reminder[] => {
  const now = new Date();
  
  // Format YYYY-MM-DD
  const formatDate = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const todayStr = formatDate(now);

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowStr = formatDate(tomorrow);

  const inThreeDays = new Date(now);
  inThreeDays.setDate(now.getDate() + 3);
  const inThreeDaysStr = formatDate(inThreeDays);

  const inFiveDays = new Date(now);
  inFiveDays.setDate(now.getDate() + 5);
  const inFiveDaysStr = formatDate(inFiveDays);

  const inSevenDays = new Date(now);
  inSevenDays.setDate(now.getDate() + 7);
  const inSevenDaysStr = formatDate(inSevenDays);

  const inTenDays = new Date(now);
  inTenDays.setDate(now.getDate() + 10);
  const inTenDaysStr = formatDate(inTenDays);

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayStr = formatDate(yesterday);

  return [
    {
      id: 'demo-1',
      title: 'Submit DBMS Assignment 4',
      description: 'Complete SQL queries on normalization, indexing, and B-trees. Submit PDF on college portal.',
      category: 'assignment',
      date: tomorrowStr,
      time: '23:59',
      priority: 'high',
      location: 'CS Department Portal',
      notes: 'Group partner: Sneha. Verify schema diagram on page 3 before submitting.',
      repeatType: 'none',
      notificationTime: '1_day',
      completed: false,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-2',
      title: 'Java Internal Exam',
      description: 'Mid-term theory exam covering OOP principles, Collections Framework, Multithreading & Exceptions.',
      category: 'exam',
      date: inThreeDaysStr,
      time: '10:00',
      priority: 'high',
      location: 'Hall B - Room 302',
      notes: 'Bring student ID card and blue ballpoint pen. Calculator allowed for memory management math.',
      repeatType: 'none',
      notificationTime: '1_hour',
      completed: false,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-3',
      title: 'Semester Fee Payment',
      description: 'Pay 5th semester tuition and laboratory fees before late fine penalty kicks in.',
      category: 'fee',
      date: inFiveDaysStr,
      time: '17:00',
      priority: 'high',
      location: 'Accounts Section / NetBanking',
      notes: 'Reference challan code: FEE-2026-ENG-4912. Download receipt immediately.',
      repeatType: 'none',
      notificationTime: '1_day',
      completed: false,
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-4',
      title: 'Annual College Tech Fest "Innovate 2026"',
      description: 'Inauguration ceremony, robotics exhibition, and hackathon registration desk setup.',
      category: 'event',
      date: inSevenDaysStr,
      time: '09:00',
      priority: 'medium',
      location: 'Main Auditorium & Tech Quad',
      notes: 'Wearing volunteer badge is mandatory. Registration kit distribution at 8:30 AM.',
      repeatType: 'none',
      notificationTime: '30_min',
      completed: false,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-5',
      title: 'Capstone Project Review Phase 1',
      description: 'Present system architecture diagrams, database schema, and live demo of prototype.',
      category: 'project',
      date: inTenDaysStr,
      time: '14:00',
      priority: 'high',
      location: 'Seminar Room 4',
      notes: 'Prepare 10-slide deck. Professor Rao will evaluate sprint velocity.',
      repeatType: 'none',
      notificationTime: '1_day',
      completed: false,
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-6',
      title: 'Review Operating Systems Lab Notes',
      description: 'Revise semaphore synchronization and round-robin scheduling algorithms.',
      category: 'assignment',
      date: todayStr,
      time: '18:30',
      priority: 'medium',
      location: 'Central Library Floor 2',
      notes: 'Read chapter 5 from Silberschatz book.',
      repeatType: 'none',
      notificationTime: '30_min',
      completed: false,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-7',
      title: 'Faculty Mentor Sync Meeting',
      description: 'Discuss internship credit approval and recommendation letter for summer research.',
      category: 'meeting',
      date: todayStr,
      time: '15:30',
      priority: 'medium',
      location: 'Prof. Sharma Cabin (Block C - 104)',
      notes: 'Carry printed copy of offer letter and NOC form.',
      repeatType: 'none',
      notificationTime: '10_min',
      completed: true,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'demo-8',
      title: 'Return Library Reference Books',
      description: 'Renew or return Computer Networks (Tanenbaum) and Artificial Intelligence (Russell & Norvig).',
      category: 'personal',
      date: yesterdayStr,
      time: '16:00',
      priority: 'low',
      location: 'Circulation Desk',
      notes: 'Late fee is ₹5/day per volume.',
      repeatType: 'none',
      notificationTime: 'at_time',
      completed: false,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
};
