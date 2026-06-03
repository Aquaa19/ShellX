export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface Student {
  uid: string;
  email: string;
  name: string;
  status: 'active' | 'inactive';
  currentLesson: string;
  joinedDate: string;
  completedLessonsCount: number;
  totalLessonsCount: number;
}

export interface CommandLog {
  id: string;
  username: string;
  command: string;
  exitCode: number;
  timestamp: string;
  lessonTitle: string;
}

export interface StarterFile {
  name: string;
  content: string;
}

export interface TaskValidation {
  id: string;
  instruction: string;
  validationType: 'command_check' | 'file_exists' | 'file_content';
  validationScript: string;
  expectedOutput?: string;
}

export interface Lesson {
  id: string;
  chapterId: string;
  title: string;
  description: string;
  instructions: string; // Markdown text
  type: 'theory_only' | 'terminal_challenge' | 'editor_challenge';
  estimatedMinutes: number;
  order: number;
  tasks: TaskValidation[];
  starterFiles?: StarterFile[];
}

export interface Chapter {
  id: string;
  moduleId: string;
  title: string;          // e.g., "Chapter 1.1 — What is Linux?"
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface LessonModule {
  id: string;
  title: string;          // e.g., "Module 1: Introduction to Linux & Terminal"
  order: number;
  chapters: Chapter[];
}

export interface GatewayNode {
  id: string;
  ip: string;
  hostname: string;
  cpuUsage: number;
  ramUsage: number;
  maxUsers: number;
  activeUsers: number;
  uptime: string;
  totalMem?: number;
  usedMem?: number;
}

export interface SecurityAlert {
  id: string;
  timestamp: string;
  command: string;
  flagType: 'sudo' | 'fork_bomb' | 'port_scan' | 'malicious_script';
  level: 'info' | 'warn' | 'critical';
  studentEmail: string;
}
