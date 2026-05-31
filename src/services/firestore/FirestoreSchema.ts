import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

export interface LessonCardDocument {
  id:                 string;
  moduleId:           string;
  title:              string;
  description:        string;
  commandCount:       number;
  estimatedMinutes:   number;
  validationCommand:  string;
  validationExpected: string;
  instructions:       string;
  order:              number;
  prerequisiteId?:    string; // lessonId that must be complete first
}

export interface UserModuleProgressDocument {
  moduleId:              string;
  completedLessonIds:    string[];
  inProgressLessonId?:   string;
  lastUpdated:           FirebaseFirestoreTypes.Timestamp;
}

export interface UserLessonCheckDocument {
  lessonId:     string;
  passed:       boolean;
  attempts:     number;
  lastOutput:   string;
  completedAt?: FirebaseFirestoreTypes.Timestamp;
}

export const FirestorePaths = {
  lessonCard: (moduleId: string, lessonId: string) =>
    `lessons/${moduleId}/lessonCards/${lessonId}`,
  moduleCards: (moduleId: string) =>
    `lessons/${moduleId}/lessonCards`,
  userModuleProgress: (uid: string, moduleId: string) =>
    `userProgress/${uid}/modules/${moduleId}`,
  userLessonCheck: (uid: string, lessonId: string) =>
    `userProgress/${uid}/lessonChecks/${lessonId}`,
};
