import React from 'react';
import { StyleSheet, SafeAreaView, FlatList, ListRenderItem } from 'react-native';
import { Theme } from '../tokens';
import { IconButton, MaterialIcon } from '../atoms';
import { 
  AppBackground, 
  AppHeader,
  LessonsHeader,
  LessonModuleSection,
  LessonCardGrid,
  LessonCard
} from '../components';
import { MOCK_LESSONS } from '../data';
import type { LessonData } from '../data';

// Grouping mock data statically for Phase 1.4 structure mapping
const MODULES = [
  {
    id: 'm1',
    title: 'Shell Basics',
    data: MOCK_LESSONS.slice(0, 4),
  },
  {
    id: 'm2',
    title: 'File Operations',
    data: MOCK_LESSONS.slice(4, 8),
  }
];

export const LessonsScreen: React.FC = () => {
  const renderModule: ListRenderItem<typeof MODULES[0]> = ({ item }) => (
    <LessonModuleSection moduleTitle={item.title}>
      <LessonCardGrid>
        {item.data.map((lesson: LessonData) => (
          <LessonCard
            key={lesson.id}
            title={lesson.title}
            state={lesson.state}
            progress={lesson.progress}
            commandsCount={lesson.commandCount}
            estimatedMinutes={lesson.estimatedMinutes}
            onPress={() => console.log('Lesson tapped:', lesson.id)}
          />
        ))}
      </LessonCardGrid>
    </LessonModuleSection>
  );

  return (
    <AppBackground>
      <SafeAreaView style={styles.safeArea}>
        <AppHeader
          title="Lessons"
          rightSlot={
            <IconButton
              icon={<MaterialIcon name="search" size={24} color={Theme.colors.text.primary} />}
              onPress={() => {}}
            />
          }
        />
        <FlatList
          data={MODULES}
          keyExtractor={(item) => item.id}
          renderItem={renderModule}
          contentContainerStyle={styles.scrollContent}
          ListHeaderComponent={
            <LessonsHeader 
              title="Linux Command Line" 
              subtitle="Master the fundamentals of the CUI." 
              overallProgress={0.35} 
              style={styles.listHeader}
            />
          }
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
});