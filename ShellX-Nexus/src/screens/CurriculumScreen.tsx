import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Check, 
  AlertTriangle, 
  Folder, 
  FolderOpen, 
  FileText, 
  Trash2, 
  ChevronRight, 
  ChevronDown,
  Layers
} from 'lucide-react';
import { 
  HeadlineText, 
  MonoText, 
  TextInput, 
  PrimaryButton, 
  SecondaryButton, 
  LabelCapsText, 
  IconButton 
} from '../components/atoms';
import type { LessonModule, Chapter, Lesson, TaskValidation, MCQQuestion } from '../types';
import { INITIAL_MODULES } from './mockCurriculumData';
import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import { db } from '../config/firebase';

type SelectedItem = 
  | { type: 'module'; id: string }
  | { type: 'chapter'; id: string; moduleId: string }
  | { type: 'lesson'; id: string; chapterId: string; moduleId: string }
  | null;

const initialLes = INITIAL_MODULES[0].chapters[2].lessons[0]; // Default: First Terminal Steps

export const CurriculumScreen: React.FC = () => {
  const [modules, setModules] = useState<LessonModule[]>([]);
  const [isLoadingCurriculum, setIsLoadingCurriculum] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);
  
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});
  
  const [modTitle, setModTitle] = useState('');
  
  const [chTitle, setChTitle] = useState('');
  const [chDesc, setChDesc] = useState('');
  
  const [lesTitle, setLesTitle] = useState(initialLes.title);
  const [lesDesc, setLesDesc] = useState(initialLes.description);
  const [lesInstructions, setLesInstructions] = useState(initialLes.instructions);
  const [lesMinutes, setLesMinutes] = useState(initialLes.estimatedMinutes);
  const [lesType, setLesType] = useState<Lesson['type']>(initialLes.type);
  const [lesTasks, setLesTasks] = useState<TaskValidation[]>(initialLes.tasks);
  const [lesQuestions, setLesQuestions] = useState<MCQQuestion[]>([]);

  const handleAddQuestion = () => {
    const newQuestion: MCQQuestion = {
      question: 'Question text here?',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      answer: 'Option A',
      explanation: 'Explanation here.'
    };
    setLesQuestions(prev => [...prev, newQuestion]);
  };

  const handleUpdateQuestion = (idx: number, updated: Partial<MCQQuestion>) => {
    setLesQuestions(prev => prev.map((q, i) => i === idx ? { ...q, ...updated } : q));
  };

  const handleUpdateOption = (qIdx: number, oIdx: number, value: string) => {
    setLesQuestions(prev => prev.map((q, i) => {
      if (i !== qIdx) return q;
      const nextOpts = [...q.options];
      nextOpts[oIdx] = value;
      // If the answer was the old option text, update it to the new option text automatically
      const oldOptText = q.options[oIdx];
      const isAnswerMatched = q.answer === oldOptText;
      return { 
        ...q, 
        options: nextOpts,
        answer: isAnswerMatched ? value : q.answer
      };
    }));
  };

  const handleDeleteQuestion = (idx: number) => {
    setLesQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  // Fetch curriculum on mount
  const fetchCurriculum = useCallback(async () => {
    try {
      const lessonsCol = collection(db, 'lessons');
      const modulesSnap = await getDocs(lessonsCol);
      
      const loadedModules: LessonModule[] = [];
      
      for (const modDoc of modulesSnap.docs) {
        const modData = modDoc.data();
        const moduleId = modDoc.id;
        
        // Fetch chapters subcollection
        const chaptersCol = collection(db, `lessons/${moduleId}/chapters`);
        const chaptersSnap = await getDocs(chaptersCol);
        
        const chapters: Chapter[] = [];
        
        for (const chDoc of chaptersSnap.docs) {
          const chData = chDoc.data();
          const chapterId = chDoc.id;
          
          // Fetch lessons subcollection
          const lessonsSubCol = collection(db, `lessons/${moduleId}/chapters/${chapterId}/lessons`);
          const lessonsSnap = await getDocs(lessonsSubCol);
          
          const lessons: Lesson[] = lessonsSnap.docs.map(lDoc => {
            const lData = lDoc.data();
            return {
              id: lDoc.id,
              chapterId,
              title: lData.title || '',
              description: lData.description || '',
              instructions: lData.instructions || '',
              type: lData.type || 'theory_only',
              estimatedMinutes: lData.estimatedMinutes || 5,
              order: lData.order || 0,
              tasks: lData.tasks || [],
              starterFiles: (lData.starterFiles || []).filter((f: { name?: unknown; content?: unknown }) => f && typeof f.name === 'string' && typeof f.content === 'string'),
              questions: lData.questions || [],
            };
          }).sort((a, b) => a.order - b.order);
          
          chapters.push({
            id: chapterId,
            moduleId,
            title: chData.title || '',
            description: chData.description || '',
            order: chData.order || 0,
            lessons,
          });
        }
        
        chapters.sort((a, b) => a.order - b.order);
        
        loadedModules.push({
          id: moduleId,
          title: modData.title || '',
          order: modData.order || 0,
          chapters,
        });
      }
      
      loadedModules.sort((a, b) => a.order - b.order);
      
      // Fallback to mock data if Firestore has zero modules provisioned
      if (loadedModules.length === 0) {
        setModules(INITIAL_MODULES);
      } else {
        setModules(loadedModules);
      }
    } catch (error) {
      console.error('Error fetching curriculum from Firestore:', error);
      // Safeguard: Fallback to mock data so UI doesn't crash on load failure
      setModules(INITIAL_MODULES);
    } finally {
      setIsLoadingCurriculum(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCurriculum();
  }, [fetchCurriculum]);

  // Sync state to inputs when selectedItem changes
  const selectItem = (item: SelectedItem) => {
    setSelectedItem(item);
    if (!item) return;
    
    if (item.type === 'module') {
      const mod = modules.find(m => m.id === item.id);
      if (mod) setModTitle(mod.title);
    } else if (item.type === 'chapter') {
      const mod = modules.find(m => m.id === item.moduleId);
      const ch = mod?.chapters.find(c => c.id === item.id);
      if (ch) {
        setChTitle(ch.title);
        setChDesc(ch.description);
      }
    } else if (item.type === 'lesson') {
      const mod = modules.find(m => m.id === item.moduleId);
      const ch = mod?.chapters.find(c => c.id === item.chapterId);
      const les = ch?.lessons.find(l => l.id === item.id);
      if (les) {
        setLesTitle(les.title);
        setLesDesc(les.description);
        setLesInstructions(les.instructions);
        setLesMinutes(les.estimatedMinutes);
        setLesType(les.type);
        setLesTasks(les.tasks);
        setLesQuestions(les.questions || []);
      }
    }
  };

  // Toggle accordions
  const toggleModule = (id: string) => {
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleChapter = (id: string) => {
    setExpandedChapters(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // State saving logic (local staging)
  const handleSaveModule = () => {
    if (!selectedItem || selectedItem.type !== 'module') return;
    setModules(prev => prev.map(m => m.id === selectedItem.id ? { ...m, title: modTitle } : m));
    alert('[STAGING] Module updated locally. Click PUBLISH to push changes to Firestore.');
  };

  const handleSaveChapter = () => {
    if (!selectedItem || selectedItem.type !== 'chapter') return;
    setModules(prev => prev.map(m => {
      if (m.id !== selectedItem.moduleId) return m;
      return {
        ...m,
        chapters: m.chapters.map(c => c.id === selectedItem.id ? { ...c, title: chTitle, description: chDesc } : c)
      };
    }));
    alert('[STAGING] Chapter updated locally. Click PUBLISH to push changes to Firestore.');
  };

  const handleSaveLesson = () => {
    if (!selectedItem || selectedItem.type !== 'lesson') return;
    setModules(prev => prev.map(m => {
      if (m.id !== selectedItem.moduleId) return m;
      return {
        ...m,
        chapters: m.chapters.map(c => {
          if (c.id !== selectedItem.chapterId) return c;
          return {
            ...c,
            lessons: c.lessons.map(l => l.id === selectedItem.id ? {
              ...l,
              title: lesTitle,
              description: lesDesc,
              instructions: lesInstructions,
              estimatedMinutes: lesMinutes,
              type: lesType,
              tasks: lesTasks,
              questions: lesQuestions
            } : l)
          };
        })
      };
    }));
    alert('[STAGING] Lesson updated locally. Click PUBLISH to push changes to Firestore.');
  };

  // Add Item Actions
  const handleAddModule = () => {
    const newId = `mod-${Date.now()}`;
    const newMod: LessonModule = {
      id: newId,
      title: `Module ${modules.length + 1}: New Syllabus Module`,
      order: modules.length + 1,
      chapters: []
    };
    const updated = [...modules, newMod];
    setModules(updated);
    setSelectedItem({ type: 'module', id: newId });
    setModTitle(newMod.title);
  };

  const handleAddChapter = (moduleId: string) => {
    const mod = modules.find(m => m.id === moduleId);
    if (!mod) return;
    const newId = `ch-${Date.now()}`;
    const newCh: Chapter = {
      id: newId,
      moduleId,
      title: `Chapter ${mod.chapters.length + 1}.1 — New Topic`,
      description: 'Add description here.',
      order: mod.chapters.length + 1,
      lessons: []
    };
    
    setModules(prev => prev.map(m => m.id === moduleId ? { ...m, chapters: [...m.chapters, newCh] } : m));
    setExpandedModules(prev => ({ ...prev, [moduleId]: true }));
    setSelectedItem({ type: 'chapter', id: newId, moduleId });
    setChTitle(newCh.title);
    setChDesc(newCh.description);
  };

  const handleAddLesson = (moduleId: string, chapterId: string) => {
    const mod = modules.find(m => m.id === moduleId);
    const ch = mod?.chapters.find(c => c.id === chapterId);
    const len = ch ? ch.lessons.length : 0;
    const newId = `les-${Date.now()}`;
    const newLes: Lesson = {
      id: newId,
      chapterId,
      title: `New Lesson ${len + 1}`,
      description: 'Short task outline.',
      instructions: '# New Lesson\n\nExplain task requirements here.',
      type: 'theory_only',
      estimatedMinutes: 5,
      order: len + 1,
      tasks: [],
      questions: []
    };
    
    setModules(prev => prev.map(m => {
      if (m.id !== moduleId) return m;
      return {
        ...m,
        chapters: m.chapters.map(c => c.id === chapterId ? { ...c, lessons: [...c.lessons, newLes] } : c)
      };
    }));
    setExpandedChapters(prev => ({ ...prev, [chapterId]: true }));
    setSelectedItem({ type: 'lesson', id: newId, chapterId, moduleId });
    setLesTitle(newLes.title);
    setLesDesc(newLes.description);
    setLesInstructions(newLes.instructions);
    setLesMinutes(newLes.estimatedMinutes);
    setLesType(newLes.type);
    setLesTasks(newLes.tasks);
    setLesQuestions([]);
  };

  // Task Actions inside Lessons
  const handleAddTask = () => {
    const newTask: TaskValidation = {
      id: `task-${Date.now()}`,
      instruction: 'Run command to verify XYZ.',
      validationType: 'command_check',
      validationScript: 'whoami',
      expectedOutput: 'student'
    };
    setLesTasks(prev => [...prev, newTask]);
  };

  const handleUpdateTask = (idx: number, updated: Partial<TaskValidation>) => {
    setLesTasks(prev => prev.map((t, i) => i === idx ? { ...t, ...updated } : t));
  };

  const handleDeleteTask = (idx: number) => {
    setLesTasks(prev => prev.filter((_, i) => i !== idx));
  };

  // Tree Node Delete handlers
  const handleDeleteNode = (item: SelectedItem) => {
    if (!item) return;
    if (!window.confirm(`Are you sure you want to delete this ${item.type}?`)) return;
    
    if (item.type === 'module') {
      setModules(prev => prev.filter(m => m.id !== item.id));
      selectItem(null);
    } else if (item.type === 'chapter') {
      setModules(prev => prev.map(m => m.id === item.moduleId ? { ...m, chapters: m.chapters.filter(c => c.id !== item.id) } : m));
      selectItem(null);
    } else if (item.type === 'lesson') {
      setModules(prev => prev.map(m => {
        if (m.id !== item.moduleId) return m;
        return {
          ...m,
          chapters: m.chapters.map(c => c.id === item.chapterId ? { ...c, lessons: c.lessons.filter(l => l.id !== item.id) } : c)
        };
      }));
      selectItem(null);
    }
  };

  // Transaction Write Batches (Max 500 operations per Firebase limit)
  const executeBatchedWrites = async (
    operations: {
      ref: import('firebase/firestore').DocumentReference;
      data: unknown;
      type: 'set' | 'delete';
    }[]
  ) => {
    let batch = writeBatch(db);
    let count = 0;
    
    for (const op of operations) {
      if (op.type === 'set') {
        batch.set(op.ref, op.data as import('firebase/firestore').WithFieldValue<import('firebase/firestore').DocumentData>, { merge: true });
      } else if (op.type === 'delete') {
        batch.delete(op.ref);
      }
      
      count++;
      if (count === 400) {
        await batch.commit();
        batch = writeBatch(db);
        count = 0;
      }
    }
    
    if (count > 0) {
      await batch.commit();
    }
  };

  // Write changes to Firebase Firestore (both web hierarchy and mobile flat representations)
  const handlePublishAll = async () => {
    setIsPublishing(true);
    try {
      const operations: {
        ref: import('firebase/firestore').DocumentReference;
        data: unknown;
        type: 'set' | 'delete';
      }[] = [];
      
      // 1. Fetch current DB structure IDs to schedule removals
      const dbModulesSnap = await getDocs(collection(db, 'lessons'));
      const dbModuleIds = dbModulesSnap.docs.map(d => d.id);
      const currentModuleIds = new Set(modules.map(m => m.id));
      
      for (const dbModId of dbModuleIds) {
        if (!currentModuleIds.has(dbModId)) {
          // Module deleted
          operations.push({ ref: doc(db, 'lessons', dbModId), data: null, type: 'delete' });
          
          const chSnap = await getDocs(collection(db, `lessons/${dbModId}/chapters`));
          for (const chD of chSnap.docs) {
            operations.push({ ref: doc(db, `lessons/${dbModId}/chapters`, chD.id), data: null, type: 'delete' });
            const lesSnap = await getDocs(collection(db, `lessons/${dbModId}/chapters/${chD.id}/lessons`));
            for (const lesD of lesSnap.docs) {
              operations.push({ ref: doc(db, `lessons/${dbModId}/chapters/${chD.id}/lessons`, lesD.id), data: null, type: 'delete' });
            }
          }
          const cardsSnap = await getDocs(collection(db, `lessons/${dbModId}/lessonCards`));
          for (const cardD of cardsSnap.docs) {
            operations.push({ ref: doc(db, `lessons/${dbModId}/lessonCards`, cardD.id), data: null, type: 'delete' });
          }
        } else {
          // Module exists, check chapters
          const mod = modules.find(m => m.id === dbModId)!;
          const currentChapterIds = new Set(mod.chapters.map(c => c.id));
          const dbChaptersSnap = await getDocs(collection(db, `lessons/${dbModId}/chapters`));
          
          for (const dbChDoc of dbChaptersSnap.docs) {
            if (!currentChapterIds.has(dbChDoc.id)) {
              operations.push({ ref: doc(db, `lessons/${dbModId}/chapters`, dbChDoc.id), data: null, type: 'delete' });
              
              const lesSnap = await getDocs(collection(db, `lessons/${dbModId}/chapters/${dbChDoc.id}/lessons`));
              for (const lesD of lesSnap.docs) {
                operations.push({ ref: doc(db, `lessons/${dbModId}/chapters/${dbChDoc.id}/lessons`, lesD.id), data: null, type: 'delete' });
              }
            } else {
              // Chapter exists, check lessons
              const ch = mod.chapters.find(c => c.id === dbChDoc.id)!;
              const currentLessonIds = new Set(ch.lessons.map(l => l.id));
              const dbLessonsSnap = await getDocs(collection(db, `lessons/${dbModId}/chapters/${dbChDoc.id}/lessons`));
              
              for (const dbLesDoc of dbLessonsSnap.docs) {
                if (!currentLessonIds.has(dbLesDoc.id)) {
                  operations.push({ ref: doc(db, `lessons/${dbModId}/chapters/${dbChDoc.id}/lessons`, dbLesDoc.id), data: null, type: 'delete' });
                }
              }
            }
          }
          
          // Clean up deleted mobile lessonCards
          const currentMobileLessonIds = new Set(mod.chapters.flatMap(c => c.lessons.map(l => l.id)));
          const dbCardsSnap = await getDocs(collection(db, `lessons/${dbModId}/lessonCards`));
          for (const dbCardDoc of dbCardsSnap.docs) {
            if (!currentMobileLessonIds.has(dbCardDoc.id)) {
              operations.push({ ref: doc(db, `lessons/${dbModId}/lessonCards`, dbCardDoc.id), data: null, type: 'delete' });
            }
          }
        }
      }

      // 2. Queue write operations for the active curriculum tree state
      for (const mod of modules) {
        operations.push({
          ref: doc(db, 'lessons', mod.id),
          data: { title: mod.title, order: mod.order },
          type: 'set'
        });

        const flatLessons: (Lesson & { chapterTitle: string; chapterId: string })[] = [];
        const sortedChapters = [...mod.chapters].sort((a, b) => a.order - b.order);
        
        for (const ch of sortedChapters) {
          operations.push({
            ref: doc(db, `lessons/${mod.id}/chapters`, ch.id),
            data: { title: ch.title, description: ch.description, order: ch.order },
            type: 'set'
          });

          const sortedLessons = [...ch.lessons].sort((a, b) => a.order - b.order);
          for (const les of sortedLessons) {
            flatLessons.push({
              ...les,
              chapterTitle: ch.title,
              chapterId: ch.id,
            });
            
            // Set dynamic hierarchical web lesson document
            operations.push({
              ref: doc(db, `lessons/${mod.id}/chapters/${ch.id}/lessons`, les.id),
              data: {
                title: les.title,
                description: les.description,
                instructions: les.instructions,
                type: les.type,
                estimatedMinutes: les.estimatedMinutes,
                order: les.order,
                tasks: les.tasks,
                starterFiles: les.starterFiles || [],
                questions: les.questions || []
              },
              type: 'set'
            });
          }
        }

        // Set flat card documents for mobile React Native compatibility, matching prerequisites sequentially
        for (let i = 0; i < flatLessons.length; i++) {
          const lesson = flatLessons[i];
          const prereqId = i > 0 ? flatLessons[i - 1].id : null;
          
          let valCmd = '';
          let valExp = '';
          
          if (lesson.tasks && lesson.tasks.length > 0) {
            if (lesson.tasks.length === 1) {
              valCmd = lesson.tasks[0].validationScript;
              valExp = lesson.tasks[0].expectedOutput || '';
            } else {
              // Concatenate multi-step checks into a compound bash validation wrapper
              const checks = lesson.tasks.map(t => {
                if (t.expectedOutput) {
                  const escapedExpected = t.expectedOutput.replace(/"/g, '\\"').toLowerCase();
                  const escapedScript = t.validationScript.replace(/"/g, '\\"');
                  return `[ "$(${escapedScript} | tr '[:upper:]' '[:lower:]')" = "${escapedExpected}" ]`;
                } else {
                  return `(${t.validationScript})`;
                }
              });
              valCmd = checks.join(' && ') + ' && echo "SHELLX_OK"';
              valExp = 'SHELLX_OK';
            }
          }

          const cardData: {
            title: string;
            description: string;
            commandCount: number;
            estimatedMinutes: number;
            validationCommand: string;
            validationExpected: string;
            instructions: string;
            order: number;
            starterFiles: import('../types').StarterFile[];
            prerequisiteId?: string | null;
            type: string;
            questions?: import('../types').MCQQuestion[];
            chapterTitle?: string;
            chapterId?: string;
          } = {
            title: lesson.title,
            description: lesson.description,
            commandCount: lesson.tasks.length,
            estimatedMinutes: lesson.estimatedMinutes,
            validationCommand: valCmd,
            validationExpected: valExp,
            instructions: ((lesson.type === 'terminal_challenge' || lesson.type === 'editor_challenge') && lesson.tasks && lesson.tasks.length > 0)
              ? `${lesson.instructions}\n\n${lesson.tasks.map((t, idx) => `**Task #${idx + 1}**\n${t.instruction}`).join('\n\n')}`
              : lesson.instructions,
            order: i + 1,
            starterFiles: lesson.starterFiles || [],
            type: lesson.type,
            questions: lesson.questions || [],
            chapterTitle: lesson.chapterTitle,
            chapterId: lesson.chapterId
          };
          
          if (prereqId) {
            cardData.prerequisiteId = prereqId;
          }

          operations.push({
            ref: doc(db, `lessons/${mod.id}/lessonCards`, lesson.id),
            data: cardData,
            type: 'set'
          });
        }
      }

      // 3. Commit transactions
      await executeBatchedWrites(operations);
      alert('Production Curriculum successfully published to Firebase Firestore.');
      setIsLoadingCurriculum(true);
      await fetchCurriculum();
    } catch (error) {
      console.error('Error publishing curriculum to Firestore:', error);
      alert('Failed to publish changes: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsPublishing(false);
    }
  };

  // Styles
  const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-lg)',
  };

  const layoutRowStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--spacing-md)',
    alignItems: 'stretch',
  };

  const treeCardStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-background-elevated)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-md)',
    width: '320px',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-md)',
  };

  const formCardStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-background-elevated)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-md)',
    flex: 1,
    minWidth: '450px',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-md)',
  };

  const activeListItemStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 10px',
    borderRadius: 'var(--radius-default)',
    backgroundColor: active ? 'rgba(79, 223, 148, 0.04)' : 'transparent',
    border: active ? '1px solid var(--color-border-success)' : '1px solid transparent',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.15s',
  });

  return (
    <div style={contentStyle}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
        <div>
          <HeadlineText level={1} style={{ marginBottom: '4px' }}>
            Course Structure CMS
          </HeadlineText>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            Configure Modules, outline Chapters, write Lessons, and compile multi-step terminal verification engines.
          </p>
        </div>
        <div>
          <SecondaryButton 
            onClick={handlePublishAll}
            disabled={isPublishing || isLoadingCurriculum}
            style={{ 
              minHeight: '36px', 
              borderColor: 'var(--color-border-success)', 
              color: 'var(--color-semantic-success)',
              padding: '6px 12px',
              opacity: (isPublishing || isLoadingCurriculum) ? 0.5 : 1,
              cursor: (isPublishing || isLoadingCurriculum) ? 'not-allowed' : 'pointer'
            }}
          >
            <Check size={14} style={{ marginRight: '6px' }} />
            <span>{isPublishing ? 'PUBLISHING...' : 'PUBLISH ALL CHANGES'}</span>
          </SecondaryButton>
        </div>
      </div>

      <div style={layoutRowStyle}>
        {/* Left: Syllabus Tree Panel */}
        <div style={treeCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <LabelCapsText size="11px" color="var(--color-text-secondary)">
              Syllabus Outline Tree
            </LabelCapsText>
            <IconButton 
              icon={<Plus size={14} />} 
              onClick={handleAddModule}
              style={{ width: '28px', height: '28px' }} 
              title="Add New Module"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', maxHeight: '650px', paddingRight: '4px' }}>
            {isLoadingCurriculum ? (
              <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
                <MonoText size="12px">[ LOADING CURRICULUM... ]</MonoText>
              </div>
            ) : modules.map((mod) => {
              const isModExpanded = !!expandedModules[mod.id];
              const isModSelected = selectedItem?.type === 'module' && selectedItem.id === mod.id;
              
              return (
                <div key={mod.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderBottom: '1px solid rgba(255,255,255,0.01)', paddingBottom: '6px' }}>
                  {/* Module Title Accordion Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div 
                      onClick={() => toggleModule(mod.id)} 
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', flex: 1 }}
                    >
                      {isModExpanded ? <ChevronDown size={14} color="var(--color-text-tertiary)" /> : <ChevronRight size={14} color="var(--color-text-tertiary)" />}
                      <FolderOpen size={14} color="var(--color-syntax-blue)" />
                      <MonoText 
                        size="12px" 
                        weight={isModSelected ? 'bold' : '600'} 
                        color={isModSelected ? 'var(--color-primary-default)' : 'var(--color-text-primary)'}
                        onClick={(e) => {
                          e.stopPropagation();
                          selectItem({ type: 'module', id: mod.id });
                        }}
                      >
                        {mod.title.length > 25 ? `${mod.title.slice(0, 25)}...` : mod.title}
                      </MonoText>
                    </div>
                    <IconButton 
                      icon={<Plus size={12} />} 
                      onClick={() => handleAddChapter(mod.id)}
                      style={{ width: '22px', height: '22px', border: 'none' }}
                      title="Add Chapter to Module"
                    />
                  </div>

                  {/* Chapters Nested */}
                  {isModExpanded && (
                    <div style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '2px' }}>
                      {mod.chapters.map((ch) => {
                        const isChExpanded = !!expandedChapters[ch.id];
                        const isChSelected = selectedItem?.type === 'chapter' && selectedItem.id === ch.id;

                        return (
                          <div key={ch.id} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <div 
                                onClick={() => toggleChapter(ch.id)}
                                style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', flex: 1 }}
                              >
                                {isChExpanded ? <ChevronDown size={12} color="var(--color-text-tertiary)" /> : <ChevronRight size={12} color="var(--color-text-tertiary)" />}
                                <Folder size={12} color="var(--color-syntax-orange)" />
                                <MonoText 
                                  size="11px" 
                                  weight={isChSelected ? 'bold' : '500'} 
                                  color={isChSelected ? 'var(--color-syntax-orange)' : 'var(--color-text-secondary)'}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    selectItem({ type: 'chapter', id: ch.id, moduleId: mod.id });
                                  }}
                                >
                                  {ch.title.split('—')[1]?.trim() || ch.title}
                                </MonoText>
                              </div>
                              <IconButton 
                                icon={<Plus size={10} />} 
                                onClick={() => handleAddLesson(mod.id, ch.id)}
                                style={{ width: '18px', height: '18px', border: 'none' }}
                                title="Add Lesson to Chapter"
                              />
                            </div>

                            {/* Lessons Nested */}
                            {isChExpanded && (
                              <div style={{ paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
                                {ch.lessons.map((les) => {
                                  const isLesSelected = selectedItem?.type === 'lesson' && selectedItem.id === les.id;
                                  return (
                                    <div 
                                      key={les.id}
                                      style={activeListItemStyle(isLesSelected)}
                                      onClick={() => selectItem({ type: 'lesson', id: les.id, chapterId: ch.id, moduleId: mod.id })}
                                    >
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <FileText size={11} color="var(--color-text-tertiary)" />
                                        <MonoText size="11px" color={isLesSelected ? 'var(--color-semantic-success)' : 'var(--color-text-tertiary)'}>
                                          {les.title}
                                        </MonoText>
                                      </div>
                                    </div>
                                  );
                                })}
                                {ch.lessons.length === 0 && (
                                  <div style={{ padding: '4px 10px', fontSize: '9px', fontFamily: 'monospace', color: 'var(--color-text-tertiary)' }}>
                                    [ No lessons loaded ]
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {mod.chapters.length === 0 && (
                        <div style={{ paddingLeft: '16px', fontSize: '9px', fontFamily: 'monospace', color: 'var(--color-text-tertiary)' }}>
                          [ No chapters created ]
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Form Editor */}
        <div style={formCardStyle}>
          {selectedItem ? (
            <>
              {/* HEADER DETAILS TYPE */}
              <div style={{ borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: 'var(--spacing-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers size={14} color="var(--color-primary-default)" />
                  <LabelCapsText size="11px" color="var(--color-text-secondary)">
                    Editing Node: {selectedItem.type.toUpperCase()} Card
                  </LabelCapsText>
                </div>
                <SecondaryButton 
                  onClick={() => handleDeleteNode(selectedItem)}
                  style={{ minHeight: '28px', padding: '2px 8px', borderColor: 'var(--color-semantic-error)', color: 'var(--color-semantic-error)', fontSize: '10px' }}
                >
                  <Trash2 size={10} style={{ marginRight: '4px' }} />
                  <span>DELETE NODE</span>
                </SecondaryButton>
              </div>

              {/* MODULE FORM */}
              {selectedItem.type === 'module' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                  <TextInput 
                     label="Module Headline Title" 
                    value={modTitle} 
                    onChange={(e) => setModTitle(e.target.value)} 
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                    <PrimaryButton onClick={handleSaveModule} style={{ minHeight: '38px', fontSize: '12px' }}>
                      STAGE MODULE TITLE
                    </PrimaryButton>
                  </div>
                </div>
              )}

              {/* CHAPTER FORM */}
              {selectedItem.type === 'chapter' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                  <TextInput 
                    label="Chapter Header Title" 
                    value={chTitle} 
                    onChange={(e) => setChTitle(e.target.value)} 
                  />
                  <TextInput 
                    label="Chapter Short Description" 
                    value={chDesc} 
                    onChange={(e) => setChDesc(e.target.value)} 
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                    <PrimaryButton onClick={handleSaveChapter} style={{ minHeight: '38px', fontSize: '12px' }}>
                      STAGE CHAPTER DETAILS
                    </PrimaryButton>
                  </div>
                </div>
              )}

              {/* LESSON & VERIFICATION FORM */}
              {selectedItem.type === 'lesson' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', overflowY: 'auto', maxHeight: '600px', paddingRight: '4px' }}>
                  <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                    <div style={{ flex: 2 }}>
                      <TextInput 
                        label="Lesson Title" 
                        value={lesTitle} 
                        onChange={(e) => setLesTitle(e.target.value)} 
                      />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                      <label style={{ fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', color: 'var(--color-text-secondary)', fontWeight: '600' }}>
                        Quest Type
                      </label>
                      <select 
                        value={lesType} 
                        onChange={(e) => setLesType(e.target.value as Lesson['type'])}
                        style={{
                          minHeight: '44px',
                          backgroundColor: 'var(--color-background-input)',
                          border: '1px solid var(--color-border-subtle)',
                          borderRadius: 'var(--radius-default)',
                          color: 'var(--color-text-primary)',
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: '13px',
                          padding: '0 8px',
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="theory_only">THEORY / SLIDES</option>
                        <option value="terminal_challenge">TERMINAL CHALLENGE</option>
                        <option value="editor_challenge">FILE EDITOR TASK</option>
                        <option value="exercise">EXERCISE (MCQ)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                    <div style={{ flex: 1.5 }}>
                      <TextInput 
                        label="Lesson Description Outline" 
                        value={lesDesc} 
                        onChange={(e) => setLesDesc(e.target.value)} 
                      />
                    </div>
                    <div style={{ flex: 0.5 }}>
                      <TextInput 
                        label="Est. Minutes" 
                        type="number" 
                        value={lesMinutes.toString()} 
                        onChange={(e) => setLesMinutes(parseInt(e.target.value) || 2)} 
                      />
                    </div>
                  </div>

                  {/* Markdown Instructions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                    <label style={{ fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', color: 'var(--color-text-secondary)', fontWeight: '600' }}>
                      Instructions (Markdown)
                    </label>
                    <textarea 
                      value={lesInstructions} 
                      onChange={(e) => setLesInstructions(e.target.value)}
                      style={{
                        minHeight: '110px',
                        backgroundColor: 'var(--color-background-input)',
                        border: '1px solid var(--color-border-subtle)',
                        borderRadius: 'var(--radius-default)',
                        color: 'var(--color-text-primary)',
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '13px',
                        padding: '12px',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                  </div>

                  {/* Task steps builder */}
                  {(lesType === 'terminal_challenge' || lesType === 'editor_challenge') && (
                    <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <AlertTriangle size={14} color="var(--color-semantic-warning)" />
                          <LabelCapsText size="10px" color="var(--color-semantic-warning)">
                            Step-By-Step Validation Engine
                          </LabelCapsText>
                        </div>
                        <IconButton 
                          icon={<Plus size={12} />} 
                          onClick={handleAddTask}
                          style={{ width: '28px', height: '28px' }}
                          title="Add Validation Step"
                        />
                      </div>

                      {/* Tasks List mapped */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        {lesTasks.map((task, index) => (
                          <div 
                            key={task.id} 
                            style={{ 
                              padding: 'var(--spacing-md)', 
                              backgroundColor: '#000000', 
                              border: '1px dashed var(--color-border-strong)', 
                              borderRadius: 'var(--radius-default)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 'var(--spacing-sm)'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <MonoText size="11px" weight="bold" color="var(--color-syntax-orange)">
                                Task #{index + 1}
                              </MonoText>
                              <IconButton 
                                icon={<Trash2 size={12} />} 
                                onClick={() => handleDeleteTask(index)}
                                style={{ width: '22px', height: '22px', border: 'none', color: 'var(--color-semantic-error)' }}
                                title="Remove Task step"
                              />
                            </div>

                            <TextInput 
                              label="Instruction Text" 
                              value={task.instruction} 
                              onChange={(e) => handleUpdateTask(index, { instruction: e.target.value })} 
                            />

                            <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                              <div style={{ flex: 1.2 }}>
                                <TextInput 
                                  label="Verification Script" 
                                  value={task.validationScript} 
                                  onChange={(e) => handleUpdateTask(index, { validationScript: e.target.value })} 
                                />
                              </div>
                              <div style={{ flex: 0.8 }}>
                                <TextInput 
                                  label="Expected Console Value" 
                                  value={task.expectedOutput || ''} 
                                  onChange={(e) => handleUpdateTask(index, { expectedOutput: e.target.value })} 
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        {lesTasks.length === 0 && (
                          <div style={{ padding: 'var(--spacing-md)', border: '1px dashed var(--color-border-subtle)', borderRadius: 'var(--radius-default)', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
                            [ NO VALIDATION STEPS DEFINED. ADD AN EXERCISE STEP ABOVE ]
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* MCQ quiz builder */}
                  {lesType === 'exercise' && (
                    <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: 'var(--spacing-md)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Layers size={14} color="var(--color-syntax-orange)" />
                          <LabelCapsText size="10px" color="var(--color-syntax-orange)">
                            Multiple Choice Questions (Quiz)
                          </LabelCapsText>
                        </div>
                        <IconButton 
                          icon={<Plus size={12} />} 
                          onClick={handleAddQuestion}
                          style={{ width: '28px', height: '28px' }}
                          title="Add MCQ Question"
                        />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        {lesQuestions.map((q, qIdx) => (
                          <div 
                            key={qIdx} 
                            style={{ 
                              padding: 'var(--spacing-md)', 
                              backgroundColor: '#000000', 
                              border: '1px dashed var(--color-border-strong)', 
                              borderRadius: 'var(--radius-default)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 'var(--spacing-sm)'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <MonoText size="11px" weight="bold" color="var(--color-syntax-orange)">
                                Question #{qIdx + 1}
                              </MonoText>
                              <IconButton 
                                icon={<Trash2 size={12} />} 
                                onClick={() => handleDeleteQuestion(qIdx)}
                                style={{ width: '22px', height: '22px', border: 'none', color: 'var(--color-semantic-error)' }}
                                title="Remove Question"
                              />
                            </div>

                            <TextInput 
                              label="Question Prompt" 
                              value={q.question} 
                              onChange={(e) => handleUpdateQuestion(qIdx, { question: e.target.value })} 
                            />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm)' }}>
                              {q.options.map((opt, oIdx) => (
                                <TextInput 
                                  key={oIdx}
                                  label={`Option ${String.fromCharCode(65 + oIdx)}`} 
                                  value={opt} 
                                  onChange={(e) => handleUpdateOption(qIdx, oIdx, e.target.value)} 
                                />
                              ))}
                            </div>

                            <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                              <div style={{ flex: 1 }}>
                                <label style={{ fontSize: '11px', fontFamily: 'monospace', textTransform: 'uppercase', color: 'var(--color-text-secondary)', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                                  Correct Answer
                                </label>
                                <select
                                  value={q.answer}
                                  onChange={(e) => handleUpdateQuestion(qIdx, { answer: e.target.value })}
                                  style={{
                                    width: '100%',
                                    height: '36px',
                                    backgroundColor: 'var(--color-background-input)',
                                    border: '1px solid var(--color-border-subtle)',
                                    borderRadius: 'var(--radius-default)',
                                    color: 'var(--color-text-primary)',
                                    fontFamily: '"JetBrains Mono", monospace',
                                    fontSize: '13px',
                                    padding: '0 8px',
                                    outline: 'none',
                                    cursor: 'pointer'
                                  }}
                                >
                                  {q.options.map((opt, oIdx) => (
                                    <option key={oIdx} value={opt}>{opt}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <TextInput 
                              label="Explanation (Optional)" 
                              value={q.explanation} 
                              onChange={(e) => handleUpdateQuestion(qIdx, { explanation: e.target.value })} 
                            />
                          </div>
                        ))}
                        {lesQuestions.length === 0 && (
                          <div style={{ padding: 'var(--spacing-md)', border: '1px dashed var(--color-border-subtle)', borderRadius: 'var(--radius-default)', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
                            [ NO QUIZ QUESTIONS DEFINED. ADD A QUESTION ABOVE ]
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Save button */}
                  <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'flex-end', marginTop: 'var(--spacing-md)', borderTop: '1px solid var(--color-border-subtle)', paddingTop: 'var(--spacing-sm)' }}>
                    <PrimaryButton onClick={handleSaveLesson} style={{ minHeight: '38px', fontSize: '12px' }}>
                      STAGE CARD DETAILS
                    </PrimaryButton>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center', color: 'var(--color-text-tertiary)' }}>
              <Layers size={32} style={{ marginBottom: '8px' }} />
              <LabelCapsText size="11px">[ SELECT A NODE FROM TREE TO START EDITING ]</LabelCapsText>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
