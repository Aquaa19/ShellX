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

      // ── Pass 1: fetch all module cards + per-module progress docs in parallel ──
      const rawModules = await Promise.all(
        modulesSnapshot.docs.map(async (moduleDoc) => {
          const moduleData = moduleDoc.data();
          const moduleId   = moduleDoc.id;

          const [cardsSnapshot, progressDoc] = await Promise.all([
            firestore()
              .collection(FirestorePaths.moduleCards(moduleId))
              .orderBy('order')
              .get(),
            firestore()
              .doc(FirestorePaths.userModuleProgress(uid, moduleId))
              .get(),
          ]);

          const cards: LessonCardDocument[] = cardsSnapshot.docs.map((doc) => ({
            ...(doc.data() as LessonCardDocument),
            id: doc.id,
            moduleId,
          }));

          const progressData = progressDoc.exists()
            ? (progressDoc.data() as UserModuleProgressDocument)
            : null;

          return {
            moduleId,
            moduleTitle: moduleData.title || '',
            moduleOrder: (moduleData.order as number) || 0,
            cards,
            progressData,
          };
        })
      );

      // ── Build global completed set & global in-progress ID ──
      const globalCompletedIds = new Set<string>();
      let   globalInProgressId: string | undefined;

      for (const rm of rawModules) {
        const ids = rm.progressData?.completedLessonIds || [];
        ids.forEach((id) => globalCompletedIds.add(id));
        if (rm.progressData?.inProgressLessonId) {
          globalInProgressId = rm.progressData.inProgressLessonId;
        }
      }

      const hasStartedJourney = globalCompletedIds.size > 0 || !!globalInProgressId;

      // ── Pass 2: compute LessonState for every card using global progress ──
      const modules: LessonModule[] = rawModules.map((rm) => {
        const lessons: LessonData[] = rm.cards.map((card) => {
          let state: LessonState = 'locked';

          if (globalCompletedIds.has(card.id)) {
            state = 'complete';
          } else if (globalInProgressId === card.id) {
            state = 'inProgress';
          } else if (!card.prerequisiteId) {
            // First lesson of a module (no prerequisite) — only unlock after journey starts
            state = hasStartedJourney ? 'inProgress' : 'locked';
          } else {
            // Prerequisite-gated lesson — unlock only when prerequisite is globally complete
            state = globalCompletedIds.has(card.prerequisiteId) ? 'inProgress' : 'locked';
          }

          const progress = state === 'complete' ? 1 : 0;

          return {
            id:                 card.id,
            moduleId:           rm.moduleId,
            title:              card.title,
            description:        card.description,
            commandCount:       card.commandCount,
            estimatedMinutes:   card.estimatedMinutes,
            state,
            progress,
            validationCommand:  card.validationCommand,
            validationExpected: card.validationExpected,
            instructions:       card.instructions,
            order:              card.order,
            starterFiles:       card.starterFiles,
            type:               card.type || 'theory_only',
            questions:          card.questions || [],
            prerequisiteId:     card.prerequisiteId,
            chapterTitle:       card.chapterTitle,
            chapterId:          card.chapterId,
          };
        });

        return {
          id:     rm.moduleId,
          title:  rm.moduleTitle,
          order:  rm.moduleOrder,
          lessons,
        };
      });

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
