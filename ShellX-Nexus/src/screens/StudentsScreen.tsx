import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { HeadlineText, MonoText, TextInput, PrimaryButton, LabelCapsText } from '../components/atoms';
import type { Student } from '../types';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

export const StudentsScreen: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [lessonMap, setLessonMap] = useState<Record<string, string>>({});
  const [totalLessons, setTotalLessons] = useState(12);

  // 1. Fetch curriculum once to map lesson IDs to titles and sum total lessons
  useEffect(() => {
    const loadCurriculumMetadata = async () => {
      try {
        const modulesCol = collection(db, 'lessons');
        const modulesSnap = await getDocs(modulesCol);
        
        let total = 0;
        const nameMap: Record<string, string> = {};
        
        for (const modDoc of modulesSnap.docs) {
          const moduleId = modDoc.id;
          const chaptersCol = collection(db, `lessons/${moduleId}/chapters`);
          const chaptersSnap = await getDocs(chaptersCol);
          
          for (const chDoc of chaptersSnap.docs) {
            const chapterId = chDoc.id;
            const lessonsCol = collection(db, `lessons/${moduleId}/chapters/${chapterId}/lessons`);
            const lessonsSnap = await getDocs(lessonsCol);
            
            for (const lesDoc of lessonsSnap.docs) {
              const data = lesDoc.data() as { title?: string };
              nameMap[lesDoc.id] = data.title || '';
              total++;
            }
          }
        }
        
        if (total > 0) {
          setTotalLessons(total);
          setLessonMap(nameMap);
        }
      } catch (err) {
        console.error('Error loading curriculum metadata for student mapping:', err);
      }
    };
    
    loadCurriculumMetadata();
  }, []);

  // 2. Subscribe to userProgress collection
  useEffect(() => {
    const userProgressCol = collection(db, 'userProgress');
    
    const unsubscribe = onSnapshot(userProgressCol, async (snapshot) => {
      setIsLoadingStudents(true);
      try {
        const studentsList: Student[] = [];
        
        for (const userDoc of snapshot.docs) {
          const uid = userDoc.id;
          const userData = userDoc.data() as { 
            name?: string; 
            email?: string; 
            status?: 'active' | 'inactive'; 
            joinedDate?: string; 
          };
          
          // Fetch subcollection progress for this user
          const modulesCol = collection(db, `userProgress/${uid}/modules`);
          const modulesSnap = await getDocs(modulesCol);
          
          let completedCount = 0;
          let activeLessonId = '';
          
          for (const modDoc of modulesSnap.docs) {
            const mData = modDoc.data() as { 
              completedLessonIds?: string[]; 
              inProgressLessonId?: string; 
            };
            const completedIds = mData.completedLessonIds || [];
            completedCount += completedIds.length;
            
            if (mData.inProgressLessonId) {
              activeLessonId = mData.inProgressLessonId;
            }
          }
          
          const currentLesson = lessonMap[activeLessonId] || activeLessonId || 'No active lesson';
          
          studentsList.push({
            uid,
            name: userData.name || `Student (${uid.slice(0, 5)})`,
            email: userData.email || 'student@shellx.com',
            status: userData.status || 'active',
            currentLesson,
            joinedDate: userData.joinedDate || '2026-06-01',
            completedLessonsCount: completedCount,
            totalLessonsCount: totalLessons,
          });
        }
        
        studentsList.sort((a, b) => a.name.localeCompare(b.name));
        setStudents(studentsList);
      } catch (err) {
        console.error('Error compiling student progress list:', err);
      } finally {
        setIsLoadingStudents(false);
      }
    }, (error) => {
      console.error('Error subscribing to userProgress snapshot:', error);
      setIsLoadingStudents(false);
    });
    
    return () => unsubscribe();
  }, [lessonMap, totalLessons]);

  const filteredStudents = students.filter((st) => {
    const matchesSearch = st.name.toLowerCase().includes(search.toLowerCase()) || 
                          st.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || st.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const contentStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-lg)',
  };

  const filterRowStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--spacing-md)',
    alignItems: 'flex-end',
    backgroundColor: 'var(--color-background-elevated)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-md)',
  };

  const tableContainerStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-background-elevated)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  };

  const thStyle: React.CSSProperties = {
    borderBottom: '1px solid var(--color-border-subtle)',
    padding: '16px var(--spacing-md)',
  };

  const tdStyle: React.CSSProperties = {
    borderBottom: '1px solid var(--color-border-subtle)',
    padding: '14px var(--spacing-md)',
    fontSize: '13px',
  };

  const statusBadgeStyle = (status: 'active' | 'inactive'): React.CSSProperties => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '3px 8px',
    borderRadius: 'var(--radius-full)',
    fontSize: '10px',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    backgroundColor: status === 'active' ? 'rgba(79, 223, 148, 0.05)' : 'rgba(239, 68, 68, 0.05)',
    color: status === 'active' ? 'var(--color-semantic-success)' : 'var(--color-semantic-error)',
    border: `1px solid ${status === 'active' ? 'var(--color-border-success)' : 'var(--color-border-error)'}`,
  });

  return (
    <div style={contentStyle}>
      <div>
        <HeadlineText level={1} style={{ marginBottom: '4px' }}>
          Student Directory
        </HeadlineText>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)' }}>
          Monitor enrollments, verify active sessions, and inspect client workspaces.
        </p>
      </div>

      {/* Filter Row */}
      <div style={filterRowStyle}>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <TextInput
            label="Search Student"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
          <label style={{
            fontSize: '11px',
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            fontWeight: '600',
            textTransform: 'uppercase',
            color: 'var(--color-text-secondary)',
          }}>
            Status Filter
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            style={{
              minHeight: '44px',
              backgroundColor: 'var(--color-background-input)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-default)',
              color: 'var(--color-text-primary)',
              fontFamily: '"JetBrains Mono", ui-monospace, monospace',
              fontSize: '13px',
              padding: '0 12px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">ALL STUDENTS</option>
            <option value="active">ACTIVE SESSION</option>
            <option value="inactive">INACTIVE</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div style={tableContainerStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}><LabelCapsText>Name</LabelCapsText></th>
              <th style={thStyle}><LabelCapsText>Email</LabelCapsText></th>
              <th style={thStyle}><LabelCapsText>Status</LabelCapsText></th>
              <th style={thStyle}><LabelCapsText>Current Lesson</LabelCapsText></th>
              <th style={thStyle}><LabelCapsText>Joined Date</LabelCapsText></th>
              <th style={thStyle}><LabelCapsText>Progress</LabelCapsText></th>
              <th style={thStyle}><LabelCapsText>Actions</LabelCapsText></th>
            </tr>
          </thead>
          <tbody>
            {isLoadingStudents ? (
              <tr>
                <td colSpan={7} style={{ ...tdStyle, textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-tertiary)' }}>
                  <MonoText size="12px">[ LOADING STUDENT DIRECTORY... ]</MonoText>
                </td>
              </tr>
            ) : (
              filteredStudents.map((st) => (
                <tr key={st.uid}>
                  <td style={tdStyle}><MonoText size="13px" weight="bold">{st.name}</MonoText></td>
                  <td style={tdStyle}><MonoText size="13px" color="var(--color-text-secondary)">{st.email}</MonoText></td>
                  <td style={tdStyle}>
                    <span style={statusBadgeStyle(st.status)}>
                      {st.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={tdStyle}><MonoText size="12px" color="var(--color-syntax-orange)">{st.currentLesson}</MonoText></td>
                  <td style={tdStyle}><MonoText size="12px" color="var(--color-text-tertiary)">{st.joinedDate}</MonoText></td>
                  <td style={tdStyle}>
                    <MonoText size="12px" color="var(--color-syntax-green)">
                      {st.completedLessonsCount} / {st.totalLessonsCount}
                    </MonoText>
                  </td>
                  <td style={tdStyle}>
                    <PrimaryButton
                      onClick={() => navigate(`/students/${st.uid}`)}
                      style={{
                        minHeight: '36px',
                        padding: '4px 10px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Eye size={14} />
                      <span>INSPECT</span>
                    </PrimaryButton>
                  </td>
                </tr>
              ))
            )}
            {!isLoadingStudents && filteredStudents.length === 0 && (
              <tr>
                <td colSpan={7} style={{ ...tdStyle, textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-tertiary)' }}>
                  [ NO ENROLLMENT DATA FOUND ]
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
