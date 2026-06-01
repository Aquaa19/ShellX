import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, ListRenderItem } from 'react-native';
import { Theme } from '../tokens';
import { IconButton, MaterialIcon, ConnectionBadge, TerminalText, SecondaryActionButton } from '../atoms';
import { 
  AppBackground, 
  AppHeader,
  LessonsHeader,
  LessonModuleSection,
  LessonCardGrid,
  LessonCard,
  ShellXLogoText,
  LessonPracticeModal,
  ShellXSpinner
} from '../components';
import { useLessonsContext, useTerminalConnection } from '../context';
import type { LessonData, LessonModule } from '../types';

export const LessonsScreen: React.FC = () => {
  const { modules, isLoading, selectLesson, refreshLessons } = useLessonsContext();
  const { connectionState } = useTerminalConnection();
  const [modalVisible, setModalVisible] = useState(false);



  // Calculate dynamic overall progress based on loaded modules
  const allLessons = modules.flatMap((m) => m.lessons);
  const completedLessons = allLessons.filter((l) => l.state === 'complete').length;
  const overallProgress = allLessons.length > 0 ? completedLessons / allLessons.length : 0;

  const renderModule: ListRenderItem<LessonModule> = ({ item }) => (
    <LessonModuleSection moduleTitle={item.title}>
      <LessonCardGrid>
        {item.lessons.map((lesson: LessonData) => (
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
    </LessonModuleSection>
  );

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