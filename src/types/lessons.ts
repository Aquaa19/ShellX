export type LessonState = 'complete' | 'inProgress' | 'locked';

export interface StarterFile {
  name: string;
  content: string;
}

export interface LessonData {
  id:                 string;
  moduleId:           string;
  title:              string;
  description:        string;
  commandCount:       number;
  estimatedMinutes:   number;
  state:              LessonState;
  progress:           number;         // Range: 0 to 1
  validationCommand:  string;         // Shell command to execute to verify task completion
  validationExpected: string;         // Expected console output substring
  instructions:       string;         // Detailed markdown or plain text instruction content
  order:              number;         // Chronological order within module
  prerequisiteId?:    string;
  starterFiles?:      StarterFile[];
}

export interface LessonModule {
  id:       string;
  title:    string;
  order:    number;
  lessons:  LessonData[];
}
