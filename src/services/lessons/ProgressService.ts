import firestore from '@react-native-firebase/firestore';
import { FirestorePaths } from '../firestore/FirestoreSchema';

export const ProgressService = {
  markLessonInProgress: async (uid: string, moduleId: string, lessonId: string): Promise<boolean> => {
    try {
      const path = FirestorePaths.userModuleProgress(uid, moduleId);
      await firestore().doc(path).set({
        moduleId,
        inProgressLessonId: lessonId,
        lastUpdated: firestore.Timestamp.now(),
      }, { merge: true });
      return true;
    } catch (error) {
      console.warn('[ProgressService] Failed to mark lesson in progress:', error);
      return false;
    }
  },

  markLessonComplete: async (uid: string, moduleId: string, lessonId: string, output: string): Promise<boolean> => {
    try {
      const moduleProgressPath = FirestorePaths.userModuleProgress(uid, moduleId);
      const lessonCheckPath = FirestorePaths.userLessonCheck(uid, lessonId);

      await firestore().runTransaction(async (transaction) => {
        const moduleDocRef = firestore().doc(moduleProgressPath);
        const moduleDoc = await transaction.get(moduleDocRef);

        let completedLessonIds: string[] = [];
        let inProgressLessonId: string | undefined;

        if (moduleDoc.exists()) {
          const data = moduleDoc.data();
          completedLessonIds = data?.completedLessonIds || [];
          inProgressLessonId = data?.inProgressLessonId;
        }

        if (!completedLessonIds.includes(lessonId)) {
          completedLessonIds.push(lessonId);
        }

        if (inProgressLessonId === lessonId) {
          inProgressLessonId = undefined;
        }

        // 1. Write the updated module progress document
        transaction.set(moduleDocRef, {
          moduleId,
          completedLessonIds,
          inProgressLessonId: inProgressLessonId || null,
          lastUpdated: firestore.Timestamp.now(),
        }, { merge: true });

        // 2. Write the user lesson check completion document
        const checkDocRef = firestore().doc(lessonCheckPath);
        transaction.set(checkDocRef, {
          lessonId,
          passed: true,
          attempts: firestore.FieldValue.increment(1),
          lastOutput: output,
          completedAt: firestore.Timestamp.now(),
        }, { merge: true });
      });

      return true;
    } catch (error) {
      console.warn('[ProgressService] Failed to mark lesson complete transaction:', error);
      return false;
    }
  },

  recordLessonCheckAttempt: async (uid: string, lessonId: string, passed: boolean, output: string): Promise<void> => {
    try {
      const path = FirestorePaths.userLessonCheck(uid, lessonId);
      const updateData: any = {
        lessonId,
        passed,
        attempts: firestore.FieldValue.increment(1),
        lastOutput: output,
      };

      if (passed) {
        updateData.completedAt = firestore.Timestamp.now();
      }

      await firestore().doc(path).set(updateData, { merge: true });
    } catch (error) {
      console.warn('[ProgressService] Failed to record check attempt:', error);
    }
  }
};
