import firestore from '@react-native-firebase/firestore';
import { LessonCardDocument, UserModuleProgressDocument, FirestorePaths } from '../firestore/FirestoreSchema';
import { LessonData, LessonModule, LessonState } from '../../types';

export const LessonService = {
  fetchLessonModules: async (uid: string): Promise<LessonModule[]> => {
    try {
      const modulesSnapshot = await firestore()
        .collection('lessons')
        .orderBy('order')
        .get();

      const modules: LessonModule[] = [];

      for (const moduleDoc of modulesSnapshot.docs) {
        const moduleData = moduleDoc.data();
        const moduleId = moduleDoc.id;
        const moduleTitle = moduleData.title || '';
        const moduleOrder = moduleData.order || 0;

        const cardsSnapshot = await firestore()
          .collection(FirestorePaths.moduleCards(moduleId))
          .orderBy('order')
          .get();

        const cards: LessonCardDocument[] = cardsSnapshot.docs.map((doc) => ({
          ...(doc.data() as LessonCardDocument),
          id: doc.id,
          moduleId,
        }));

        const progressDoc = await firestore()
          .doc(FirestorePaths.userModuleProgress(uid, moduleId))
          .get();

        const progressData = progressDoc.exists()
          ? (progressDoc.data() as UserModuleProgressDocument)
          : null;

        const completedLessonIds = progressData?.completedLessonIds || [];
        const inProgressLessonId = progressData?.inProgressLessonId;

        const lessons: LessonData[] = cards.map((card) => {
          let state: LessonState = 'locked';

          if (completedLessonIds.includes(card.id)) {
            state = 'complete';
          } else if (inProgressLessonId === card.id) {
            state = 'inProgress';
          } else {
            if (!card.prerequisiteId) {
              state = 'inProgress';
            } else {
              const isPrereqComplete = completedLessonIds.includes(card.prerequisiteId);
              state = isPrereqComplete ? 'inProgress' : 'locked';
            }
          }

          const progress = state === 'complete' ? 1 : 0;

          return {
            id: card.id,
            moduleId,
            title: card.title,
            description: card.description,
            commandCount: card.commandCount,
            estimatedMinutes: card.estimatedMinutes,
            state,
            progress,
            validationCommand: card.validationCommand,
            validationExpected: card.validationExpected,
            instructions: card.instructions,
            order: card.order,
            starterFiles: card.starterFiles,
            type: card.type || 'theory_only',
            questions: card.questions || [],
          };
        });

        modules.push({
          id: moduleId,
          title: moduleTitle,
          order: moduleOrder,
          lessons,
        });
      }

      return modules.sort((a, b) => a.order - b.order);
    } catch (error) {
      console.warn('[LessonService] Failed to fetch lesson modules:', error);
      return [];
    }
  },

  fetchLessonDetail: async (moduleId: string, lessonId: string): Promise<LessonCardDocument | null> => {
    try {
      const doc = await firestore().doc(FirestorePaths.lessonCard(moduleId, lessonId)).get();
      if (!doc.exists()) return null;
      return {
        ...(doc.data() as LessonCardDocument),
        id: doc.id,
        moduleId,
      };
    } catch (error) {
      console.warn('[LessonService] Failed to fetch lesson detail:', error);
      return null;
    }
  },

  subscribeToUserProgress: (
    uid: string,
    moduleId: string,
    callback: (doc: UserModuleProgressDocument | null) => void
  ): (() => void) => {
    try {
      return firestore()
        .doc(FirestorePaths.userModuleProgress(uid, moduleId))
        .onSnapshot((snapshot) => {
          if (snapshot.exists()) {
            callback(snapshot.data() as UserModuleProgressDocument);
          } else {
            callback(null);
          }
        }, (error) => {
          console.warn('[LessonService] Progress subscription failed:', error);
        });
    } catch (error) {
      console.warn('[LessonService] Failed to subscribe to progress snapshot:', error);
      return () => {};
    }
  }
};
