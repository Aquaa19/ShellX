import type { LessonState } from '../components/lessons/LessonStatusIcon';

export interface LessonData {
  id: string;
  title: string;
  commandCount: number;
  estimatedMinutes: number;
  state: LessonState;
  progress: number; // 0 to 1
  moduleIcon?: string;
}

export const MOCK_LESSONS: LessonData[] = [
  // Module 1: Shell Basics
  {
    id: 'l1',
    title: 'Introduction to the Terminal',
    commandCount: 3,
    estimatedMinutes: 5,
    state: 'complete',
    progress: 1.0,
  },
  {
    id: 'l2',
    title: 'Navigating Directories (cd, ls, pwd)',
    commandCount: 8,
    estimatedMinutes: 10,
    state: 'complete',
    progress: 1.0,
  },
  {
    id: 'l3',
    title: 'Creating and Removing Directories',
    commandCount: 5,
    estimatedMinutes: 8,
    state: 'inProgress',
    progress: 0.6,
  },
  {
    id: 'l4',
    title: 'Understanding Path Variables',
    commandCount: 4,
    estimatedMinutes: 7,
    state: 'locked',
    progress: 0.0,
  },
  // Module 2: File Operations
  {
    id: 'l5',
    title: 'Creating Files (touch, echo)',
    commandCount: 6,
    estimatedMinutes: 10,
    state: 'locked',
    progress: 0.0,
  },
  {
    id: 'l6',
    title: 'Reading Files (cat, less, tail)',
    commandCount: 9,
    estimatedMinutes: 12,
    state: 'locked',
    progress: 0.0,
  },
  {
    id: 'l7',
    title: 'Moving and Copying (mv, cp)',
    commandCount: 7,
    estimatedMinutes: 10,
    state: 'locked',
    progress: 0.0,
  },
  {
    id: 'l8',
    title: 'Removing Files (rm, rm -r)',
    commandCount: 4,
    estimatedMinutes: 5,
    state: 'locked',
    progress: 0.0,
  },
];