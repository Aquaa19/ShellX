import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, ListRenderItem } from 'react-native';
import { Theme } from '../tokens';
import { IconButton, MaterialIcon, ConnectionBadge, TerminalText, SecondaryActionButton, MonoText } from '../atoms';
import { 
  AppBackground, 
  AppHeader,
  LessonsHeader,
  LessonModuleSection,
  LessonCardGrid,
  LessonCard,
  ShellXLogoText,
  LessonPracticeModal,
  ShellXSpinner,
  StartJourneyModal
} from '../components';
import { useLessonsContext, useTerminalConnection } from '../context';
import type { LessonData, LessonModule } from '../types';

export const LessonsScreen: React.FC = () => {
  const { modules, isLoading, selectLesson, refreshLessons } = useLessonsContext();
  const { connectionState } = useTerminalConnection();
  const [modalVisible, setModalVisible] = useState(false);
  const [startModalVisible, setStartModalVisible] = useState(false);

  const handleStartJourney = async () => {
    if (modules.length > 0 && modules[0].lessons.length > 0) {
      const firstLesson = modules[0].lessons[0];
      setStartModalVisible(false);
      await selectLesson(firstLesson);
      setModalVisible(true);
    }
  };



  // Calculate dynamic overall progress based on loaded modules
  const allLessons = modules.flatMap((m) => m.lessons);
  const completedLessons = allLessons.filter((l) => l.state === 'complete').length;
  const hasStarted = allLessons.some((l) => l.state === 'inProgress' || l.state === 'complete');
  const overallProgress = allLessons.length > 0 ? completedLessons / allLessons.length : 0;

  const renderModule: ListRenderItem<LessonModule> = ({ item }) => {
    const groups: { chapterTitle?: string; chapterId?: string; lessons: LessonData[] }[] = [];
    item.lessons.forEach((lesson) => {
      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.chapterTitle === lesson.chapterTitle) {
        lastGroup.lessons.push(lesson);
      } else {
        groups.push({
          chapterTitle: lesson.chapterTitle,
          chapterId: lesson.chapterId,
          lessons: [lesson],
        });
      }
    });

    return (
      <LessonModuleSection moduleTitle={item.title}>
        {groups.map((group, groupIdx) => (
          <View key={group.chapterId || `group-${groupIdx}`} style={styles.groupContainer}>
            {group.chapterTitle ? (
              <View style={[
                styles.chapterHeader,
                groupIdx === 0 && { marginTop: Theme.spacing.xs }
              ]}>
                <MonoText
                  size={Theme.fontSize.bodySM}
                  weight="bold"
                  style={styles.chapterTitleText}
                >
                  {group.chapterTitle}
                </MonoText>
              </View>
            ) : null}
            <LessonCardGrid>
              {group.lessons.map((lesson: LessonData) => (
                <LessonCard
                  key={lesson.id}
                  title={lesson.title}
                  state={lesson.state}
                  progress={lesson.progress}
                  commandsCount={lesson.commandCount}
                  estimatedMinutes={lesson.estimatedMinutes}
                  onPress={async () => {
                    await selectLesson(lesson);
                    setModalVisible(true);
                  }}
                />
              ))}
            </LessonCardGrid>
          </View>
        ))}
      </LessonModuleSection>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centeredContainer}>
          <ShellXSpinner label="Loading Lessons" />
        </View>
      );
    }

    if (modules.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <TerminalText style={styles.emptyText}>
            No lessons available.
          </TerminalText>
          <SecondaryActionButton 
            label="REFRESH" 
            onPress={refreshLessons} 
            style={styles.refreshButton}
          />
        </View>
      );
    }

    return (
      <FlatList
        data={modules}
        keyExtractor={(item) => item.id}
        renderItem={renderModule}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={
          <LessonsHeader 
            title="Linux Command Line" 
            subtitle="Master the fundamentals of the CUI." 
            overallProgress={overallProgress} 
            showStartButton={!hasStarted}
            onStartPress={() => setStartModalVisible(true)}
            style={styles.listHeader}
          />
        }
      />
    );
  };

  return (
    <AppBackground>
      <SafeAreaView style={styles.safeArea}>
        <AppHeader
          title=""
          leftSlot={<ShellXLogoText text="ShellX_Lessons" size={Theme.fontSize.titleLG} />}
          rightSlot={
            <View style={styles.headerRight}>
              <ConnectionBadge state={connectionState} style={styles.badge} />
              <IconButton
                icon={<MaterialIcon name="search" size={24} color={Theme.colors.text.primary} />}
                onPress={() => {}}
              />
            </View>
          }
        />
        
        {renderContent()}

        {/* Lesson Practice Modal */}
        <LessonPracticeModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />

        {/* Start Journey Briefing Modal */}
        <StartJourneyModal
          visible={startModalVisible}
          onClose={() => setStartModalVisible(false)}
          onStart={handleStartJourney}
        />
      </SafeAreaView>
    </AppBackground>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Theme.spacing.xxl,
  },
  groupContainer: {
    marginBottom: Theme.spacing.md,
  },
  chapterHeader: {
    borderLeftWidth: 3,
    borderLeftColor: '#ffb95f',
    paddingLeft: Theme.spacing.sm,
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    justifyContent: 'center',
  },
  chapterTitleText: {
    color: '#ffb95f',
    letterSpacing: 1,
  },
  listHeader: {
    marginBottom: Theme.spacing.lg,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    marginRight: Theme.spacing.sm,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.xl,
  },
  emptyText: {
    marginBottom: Theme.spacing.lg,
    fontSize: Theme.fontSize.bodyMD,
    textAlign: 'center',
  },
  refreshButton: {
    minWidth: 120,
  },
});