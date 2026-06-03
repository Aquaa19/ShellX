import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Ban, ShieldAlert, CheckCircle, Clock } from 'lucide-react';
import { HeadlineText, MonoText, PrimaryButton, SecondaryButton, LabelCapsText } from '../components/atoms';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { LessonModule, Chapter, Lesson } from '../types';

export const StudentDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [studentInfo, setStudentInfo] = useState<{
    uid: string;
    name: string;
    email: string;
    status: 'active' | 'inactive';
    joinedDate: string;
  } | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [modulesProgress, setModulesProgress] = useState<{
    name: string;
    status: 'complete' | 'in-progress' | 'locked';
    lessons: { id: string; title: string; completed: boolean }[];
  }[]>([]);
  
  const [checkTimeline, setCheckTimeline] = useState<{
    lessonId: string;
    lessonTitle: string;
    passed: boolean;
    attempts: number;
    lastOutput: string;
    completedAt?: string;
  }[]>([]);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const [mirrorLogs, setMirrorLogs] = useState<string[]>([]);
  const [isMirrorConnected, setIsMirrorConnected] = useState(false);
  const [reconnectTrigger, setReconnectTrigger] = useState(0);

  // Auto-scroll terminal window to bottom when new logs arrive
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollTop = terminalEndRef.current.scrollHeight;
    }
  }, [mirrorLogs]);

  // Live PTY Mirror stream connection (Option A: connect on mount)
  useEffect(() => {
    if (!id) return;
    const wsUrl = import.meta.env.VITE_PTY_WS_URL || (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host;
    const wsBase = wsUrl.replace(/\/$/, '');
    let socket: WebSocket;

    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMirrorLogs([
        '[ SYSTEM: Requesting live container socket bridge... ]',
        `[ SYSTEM: Handshaking with node PTY at ${wsBase}/mirror/${id} ]`
      ]);
      socket = new WebSocket(`${wsBase}/mirror/${id}`);
      
      socket.onopen = () => {
        setIsMirrorConnected(true);
        setMirrorLogs(prev => [...prev, '[ SYSTEM: Live PTY Mirror Connected. (Read-Only) ]']);
      };

      socket.onmessage = (event) => {
        const text = event.data;
        if (typeof text === 'string') {
          const incoming = text.split(/\r?\n/).filter(line => line.length > 0);
          setMirrorLogs(prev => {
            const next = [...prev, ...incoming];
            return next.length > 100 ? next.slice(-100) : next;
          });
        }
      };

      socket.onerror = () => {
        setIsMirrorConnected(false);
        setMirrorLogs(prev => [...prev, '[ ERROR: WebSocket connection failed or refused. ]']);
      };

      socket.onclose = () => {
        setIsMirrorConnected(false);
        setMirrorLogs(prev => [...prev, '[ SYSTEM: Live PTY Mirror Session Terminated. ]']);
      };
    } catch (e) {
      console.error(e);
      setMirrorLogs(prev => [...prev, '[ ERROR: Failed to instantiate connection. ]']);
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [id, reconnectTrigger]);

  const loadStudentData = useCallback(async () => {
    if (!id) return;
    try {
      // 1. Fetch student base info
      const studentDocRef = doc(db, 'userProgress', id);
      const studentDocSnap = await getDoc(studentDocRef);
      
      if (studentDocSnap.exists()) {
        const data = studentDocSnap.data() as {
          name?: string;
          email?: string;
          status?: 'active' | 'inactive';
          joinedDate?: string;
        };
        setStudentInfo({
          uid: id,
          name: data.name || `Student (${id.slice(0, 5)})`,
          email: data.email || 'student@shellx.com',
          status: data.status || 'active',
          joinedDate: data.joinedDate || '2026-06-01',
        });
      } else {
        setStudentInfo({
          uid: id,
          name: `Student (${id.slice(0, 5)})`,
          email: 'student@shellx.com',
          status: 'active',
          joinedDate: '2026-06-01',
        });
      }

      // 2. Fetch the modules curriculum tree to cross-reference
      const modulesCol = collection(db, 'lessons');
      const modulesSnap = await getDocs(modulesCol);
      const tempModules: LessonModule[] = [];
      
      for (const modDoc of modulesSnap.docs) {
        const mId = modDoc.id;
        const mData = modDoc.data() as { title?: string; order?: number };
        
        const chaptersCol = collection(db, `lessons/${mId}/chapters`);
        const chaptersSnap = await getDocs(chaptersCol);
        const chapters: Chapter[] = [];
        
        for (const chDoc of chaptersSnap.docs) {
          const cId = chDoc.id;
          const cData = chDoc.data() as { title?: string; description?: string; order?: number };
          
          const lessonsCol = collection(db, `lessons/${mId}/chapters/${cId}/lessons`);
          const lessonsSnap = await getDocs(lessonsCol);
          const lessons: Lesson[] = lessonsSnap.docs.map(lDoc => {
            const lData = lDoc.data() as {
              title?: string;
              description?: string;
              instructions?: string;
              type?: Lesson['type'];
              estimatedMinutes?: number;
              order?: number;
              tasks?: Lesson['tasks'];
              starterFiles?: Lesson['starterFiles'];
            };
            return {
              id: lDoc.id,
              chapterId: cId,
              title: lData.title || '',
              description: lData.description || '',
              instructions: lData.instructions || '',
              type: lData.type || 'theory_only',
              estimatedMinutes: lData.estimatedMinutes || 5,
              order: lData.order || 0,
              tasks: lData.tasks || [],
              starterFiles: lData.starterFiles || [],
            };
          }).sort((a, b) => a.order - b.order);
          
          chapters.push({
            id: cId,
            moduleId: mId,
            title: cData.title || '',
            description: cData.description || '',
            order: cData.order || 0,
            lessons,
          });
        }
        chapters.sort((a, b) => a.order - b.order);
        
        tempModules.push({
          id: mId,
          title: mData.title || '',
          order: mData.order || 0,
          chapters,
        });
      }
      tempModules.sort((a, b) => a.order - b.order);

      // 3. Fetch user's modules progress subcollection
      const userModulesCol = collection(db, `userProgress/${id}/modules`);
      const userModulesSnap = await getDocs(userModulesCol);
      const userProgressMap: Record<string, { completedLessonIds: string[]; inProgressLessonId?: string }> = {};
      
      userModulesSnap.docs.forEach(uDoc => {
        const data = uDoc.data() as { completedLessonIds?: string[]; inProgressLessonId?: string };
        userProgressMap[uDoc.id] = {
          completedLessonIds: data.completedLessonIds || [],
          inProgressLessonId: data.inProgressLessonId,
        };
      });

      // 4. Compile Progress Matrix by matching tree structures
      const matrix = tempModules.map(mod => {
        const prog = userProgressMap[mod.id];
        const completedIds = prog?.completedLessonIds || [];
        const inProgressId = prog?.inProgressLessonId;
        
        const allLessons = mod.chapters.flatMap(ch => ch.lessons);
        
        let status: 'complete' | 'in-progress' | 'locked' = 'locked';
        if (allLessons.length > 0) {
          const completedAll = allLessons.every(l => completedIds.includes(l.id));
          const completedSome = allLessons.some(l => completedIds.includes(l.id)) || inProgressId;
          
          if (completedAll) {
            status = 'complete';
          } else if (completedSome) {
            status = 'in-progress';
          }
        }
        
        return {
          name: mod.title,
          status,
          lessons: allLessons.map(l => ({
            id: l.id,
            title: l.title,
            completed: completedIds.includes(l.id),
          })),
        };
      });
      setModulesProgress(matrix);

      // 5. Fetch user lesson checks subcollection for the Timeline
      const lessonChecksCol = collection(db, `userProgress/${id}/lessonChecks`);
      const lessonChecksSnap = await getDocs(lessonChecksCol);
      
      const lessonMap: Record<string, string> = {};
      tempModules.forEach(mod => {
        mod.chapters.forEach(ch => {
          ch.lessons.forEach(l => {
            lessonMap[l.id] = l.title;
          });
        });
      });
      
      const timelineData = lessonChecksSnap.docs.map(lcDoc => {
        const data = lcDoc.data() as {
          passed?: boolean;
          attempts?: number;
          lastOutput?: string;
          completedAt?: { toDate: () => Date };
        };
        const completedAtTimestamp = data.completedAt;
        let completedAtStr = 'N/A';
        if (completedAtTimestamp && typeof completedAtTimestamp.toDate === 'function') {
          completedAtStr = completedAtTimestamp.toDate().toLocaleString();
        }
        
        return {
          lessonId: lcDoc.id,
          lessonTitle: lessonMap[lcDoc.id] || lcDoc.id,
          passed: data.passed || false,
          attempts: data.attempts || 1,
          lastOutput: data.lastOutput || '',
          completedAt: completedAtStr,
        };
      });
      
      setCheckTimeline(timelineData);
    } catch (error) {
      console.error('Error loading student profile details:', error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadStudentData();
  }, [loadStudentData]);

  const handleAction = async (actionName: string, path: string) => {
    if (!id) return;
    if (!window.confirm(`Are you sure you want to run: ${actionName}?`)) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_GATEWAY_API_URL}/api/student/${id}/${path}`, {
        method: 'POST'
      });
      if (res.ok) {
        alert(`Action Success: ${actionName}`);
      } else {
        throw new Error(`Failed with status: ${res.status}`);
      }
    } catch (error) {
      const err = error as { message?: string };
      alert(`Action Error: ${err.message || 'Connection failed'}`);
    }
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-lg)',
  };

  const infoRowStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--spacing-md)',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--color-background-elevated)',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-md)',
    flex: 1,
    minWidth: '280px',
  };

  const terminalContainerStyle: React.CSSProperties = {
    backgroundColor: '#000000',
    border: '1px solid var(--color-border-subtle)',
    borderRadius: 'var(--radius-default)',
    padding: 'var(--spacing-md)',
    fontFamily: 'monospace',
    height: '180px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  };

  if (isLoading) {
    return (
      <div style={containerStyle}>
        <div>
          <SecondaryButton
            onClick={() => navigate('/students')}
            style={{ minHeight: '36px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px' }}
          >
            <ArrowLeft size={14} />
            <span>BACK TO DIRECTORY</span>
          </SecondaryButton>
        </div>
        <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--color-text-secondary)' }}>
          <MonoText size="14px">[ LOADING PROFILE AND SYSTEM METRICS... ]</MonoText>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Back button */}
      <div>
        <SecondaryButton
          onClick={() => navigate('/students')}
          style={{ minHeight: '36px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px' }}
        >
          <ArrowLeft size={14} />
          <span>BACK TO DIRECTORY</span>
        </SecondaryButton>
      </div>

      <div>
        <HeadlineText level={1} style={{ marginBottom: '4px' }}>
          Profiler: {studentInfo?.name}
        </HeadlineText>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)' }}>
          Detailed security logging, environment control, and progress checkpoints for student {studentInfo?.email}.
        </p>
      </div>

      <div style={infoRowStyle}>
        {/* Progress Matrix */}
        <div style={cardStyle}>
          <LabelCapsText size="11px" color="var(--color-text-secondary)">
            Curriculum Checklist
          </LabelCapsText>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {modulesProgress.map((mod, idx) => (
              <div key={idx} style={{ borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: 'var(--spacing-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <MonoText size="13px" weight="bold" color="var(--color-syntax-blue)">{mod.name}</MonoText>
                  {mod.status === 'complete' ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-semantic-success)' }}>
                      <CheckCircle size={14} />
                      <LabelCapsText size="8px" color="var(--color-semantic-success)">PASSED</LabelCapsText>
                    </span>
                  ) : mod.status === 'in-progress' ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-semantic-warning)' }}>
                      <Clock size={14} />
                      <LabelCapsText size="8px" color="var(--color-semantic-warning)">PENDING</LabelCapsText>
                    </span>
                  ) : (
                    <LabelCapsText size="8px" color="var(--color-text-tertiary)">LOCKED</LabelCapsText>
                  )}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {mod.lessons.map((les, lidx) => (
                    <span 
                      key={lidx} 
                      style={{ 
                        fontSize: '10px', 
                        fontFamily: 'monospace',
                        padding: '2px 6px', 
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: les.completed ? 'rgba(79, 223, 148, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid var(--color-border-subtle)',
                        color: les.completed ? 'var(--color-semantic-success)' : 'var(--color-text-secondary)'
                      }}
                    >
                      {les.title}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Terminal Mirror Console */}
        <div style={{ ...cardStyle, flex: 1.5 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <LabelCapsText size="11px" color="var(--color-text-secondary)">
              Live Client Socket Mirror (Read-Only)
            </LabelCapsText>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ 
                width: '6px', 
                height: '6px', 
                backgroundColor: isMirrorConnected ? 'var(--color-semantic-success)' : 'var(--color-semantic-error)', 
                borderRadius: '50%' 
              }} />
              <LabelCapsText size="9px" color={isMirrorConnected ? 'var(--color-semantic-success)' : 'var(--color-semantic-error)'}>
                {isMirrorConnected ? 'Active PTY' : 'PTY Offline'}
              </LabelCapsText>
            </span>
          </div>

          <div ref={terminalEndRef} style={terminalContainerStyle}>
            {mirrorLogs.map((log, index) => {
              let color = 'var(--color-text-secondary)';
              if (log.startsWith('[ ERROR:')) {
                color = 'var(--color-semantic-error)';
              } else if (log.startsWith('[ SYSTEM:')) {
                color = 'var(--color-syntax-orange)';
              } else if (log.includes('error') || log.includes('failed')) {
                color = 'var(--color-semantic-error)';
              }
              return (
                <MonoText 
                  key={index} 
                  size="11px" 
                  color={color}
                  style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
                >
                  {log}
                </MonoText>
              );
            })}
            {isMirrorConnected && (
              <MonoText size="11px" color="var(--color-text-tertiary)">
                mirroring PTY stream... <span style={{ width: '8px', height: '14px', backgroundColor: 'var(--color-semantic-success)', display: 'inline-block', verticalAlign: 'middle' }} />
              </MonoText>
            )}
          </div>

          <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
            <PrimaryButton 
              onClick={() => setReconnectTrigger(p => p + 1)}
              disabled={isMirrorConnected}
              style={{ minHeight: '36px', fontSize: '11px', flex: 1 }}
            >
              ATTACH SOCKET
            </PrimaryButton>
            <SecondaryButton 
              onClick={() => handleAction('Kill shell session', 'kill')}
              style={{ minHeight: '36px', fontSize: '11px', borderColor: 'var(--color-semantic-warning)', color: 'var(--color-semantic-warning)', flex: 1 }}
            >
              TERMINATE SHELL
            </SecondaryButton>
          </div>
        </div>
      </div>

      <div style={infoRowStyle}>
        {/* Command Timeline Log */}
        <div style={{ ...cardStyle, flex: 2 }}>
          <LabelCapsText size="11px" color="var(--color-text-secondary)">
            PTY Verification Check Timeline
          </LabelCapsText>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {checkTimeline.map((log, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderBottom: '1px dashed rgba(255,255,255,0.02)', paddingBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                  <MonoText size="11px" color="var(--color-text-tertiary)">[{log.completedAt}]</MonoText>
                  <MonoText 
                    size="11px" 
                    color={log.passed ? 'var(--color-semantic-success)' : 'var(--color-semantic-error)'}
                    weight="bold"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      padding: '2px 8px',
                      borderRadius: '2px'
                    }}
                  >
                    {log.lessonTitle}
                  </MonoText>
                  <span style={{ flex: 1 }} />
                  <MonoText size="10px" color="var(--color-text-tertiary)">attempts: {log.attempts} | status: {log.passed ? 'PASSED' : 'FAILED'}</MonoText>
                </div>
                {log.lastOutput && (
                  <div style={{ padding: '8px', backgroundColor: '#050505', borderRadius: '4px', border: '1px solid #111' }}>
                    <MonoText size="10px" color="var(--color-text-tertiary)" style={{ whiteSpace: 'pre-wrap' }}>
                      {log.lastOutput}
                    </MonoText>
                  </div>
                )}
              </div>
            ))}
            {checkTimeline.length === 0 && (
              <div style={{ padding: 'var(--spacing-md)', textAlign: 'center', color: 'var(--color-text-tertiary)' }}>
                [ NO VERIFICATION CHECKS RECORDED FOR THIS USER ]
              </div>
            )}
          </div>
        </div>

        {/* Administration Actions Panel */}
        <div style={cardStyle}>
          <LabelCapsText size="11px" color="var(--color-text-secondary)">
            Environment & Controls
          </LabelCapsText>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            <SecondaryButton 
              onClick={() => handleAction('Wipe home folder', 'wipe')}
              style={{ minHeight: '40px', width: '100%', justifyContent: 'flex-start', gap: '10px' }}
            >
              <RefreshCw size={14} />
              <span>Wipe Home Sandbox</span>
            </SecondaryButton>

            <SecondaryButton 
              onClick={() => handleAction('Reset storage quota', 'quota/reset')}
              style={{ minHeight: '40px', width: '100%', justifyContent: 'flex-start', gap: '10px' }}
            >
              <ShieldAlert size={14} />
              <span>Reset Disk Quota</span>
            </SecondaryButton>

            <SecondaryButton 
              onClick={() => handleAction('Ban student account', 'suspend')}
              style={{ minHeight: '40px', width: '100%', justifyContent: 'flex-start', gap: '10px', borderColor: 'var(--color-semantic-error)', color: 'var(--color-semantic-error)' }}
            >
              <Ban size={14} />
              <span>Suspend Account</span>
            </SecondaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};
