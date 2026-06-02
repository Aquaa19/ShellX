import type { LessonModule } from '../types';

export const INITIAL_MODULES: LessonModule[] = [
  {
    id: 'mod-1',
    title: 'Module 1: Introduction to Linux & Terminal',
    order: 1,
    chapters: [
      {
        id: 'ch-1-1',
        moduleId: 'mod-1',
        title: 'Chapter 1.1 — What is Linux?',
        description: 'Understand operating system architectures and Linux distributions.',
        order: 1,
        lessons: [
          {
            id: 'les-1-1-1',
            chapterId: 'ch-1-1',
            title: 'What is an Operating System',
            description: 'Learn about kernels, user spaces, and kernel-mode execution.',
            instructions: '# What is an Operating System\n\nAn Operating System (OS) is the system software that manages computer hardware and software resources and provides common services for computer programs.\n\nIn this lesson, we will focus on the **Linux Kernel** which serves as the bridge between software requests and the physical hardware.',
            type: 'theory_only',
            estimatedMinutes: 5,
            order: 1,
            tasks: []
          },
          {
            id: 'les-1-1-2',
            chapterId: 'ch-1-1',
            title: 'Linux vs Windows vs macOS',
            description: 'A comparison of operating system design concepts.',
            instructions: '# Operating System Paradigms\n\nUnlike Windows or macOS, Linux is open-source, monolithic, and modular. It follows the Unix philosophy: **"Write programs that do one thing and do it well."**\n\nLet\'s check your running kernel system name to verify you are currently connected to a Linux environment.',
            type: 'terminal_challenge',
            estimatedMinutes: 8,
            order: 2,
            tasks: [
              {
                id: 'task-1-1-2-1',
                instruction: 'Query the OS kernel release name.',
                validationType: 'command_check',
                validationScript: 'uname',
                expectedOutput: 'Linux'
              }
            ]
          }
        ]
      },
      {
        id: 'ch-1-2',
        moduleId: 'mod-1',
        title: 'Chapter 1.2 — Understanding the Terminal',
        description: 'Differentiate between shell interfaces, terminals, and CLI prompts.',
        order: 2,
        lessons: [
          {
            id: 'les-1-2-1',
            chapterId: 'ch-1-2',
            title: 'GUI vs CLI prompts',
            description: 'Understand graphical versus command-line operations.',
            instructions: '# The Command Line Interface\n\nThe Terminal Emulator provides you with a direct text interface to communicate with the operating system Shell (like Bash or Zsh).',
            type: 'theory_only',
            estimatedMinutes: 5,
            order: 1,
            tasks: []
          }
        ]
      },
      {
        id: 'ch-1-3',
        moduleId: 'mod-1',
        title: 'Chapter 1.3 — Your First Commands',
        description: 'Run essential terminal inspection commands.',
        order: 3,
        lessons: [
          {
            id: 'les-1-3-1',
            chapterId: 'ch-1-3',
            title: 'First Terminal Steps',
            description: 'Run basic identity, location, and system date commands.',
            instructions: '# Your First Shell Commands\n\nLet\'s test the basic identity tool chain:\n\n1. `whoami` prints your current active username.\n2. `pwd` prints your current working directory path.',
            type: 'terminal_challenge',
            estimatedMinutes: 10,
            order: 1,
            tasks: [
              {
                id: 'task-1-3-1-1',
                instruction: 'Check your current user handle username.',
                validationType: 'command_check',
                validationScript: 'whoami',
                expectedOutput: 'student'
              },
              {
                id: 'task-1-3-1-2',
                instruction: 'Verify you are in the default home workspace.',
                validationType: 'command_check',
                validationScript: 'pwd',
                expectedOutput: '/home/student'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'mod-2',
    title: 'Module 2: Navigating the File System',
    order: 2,
    chapters: [
      {
        id: 'ch-2-1',
        moduleId: 'mod-2',
        title: 'Chapter 2.1 — Linux File System Basics',
        description: 'Learn root structure hierarchies.',
        order: 1,
        lessons: []
      },
      {
        id: 'ch-2-2',
        moduleId: 'mod-2',
        title: 'Chapter 2.2 — Moving Around',
        description: 'Master navigation using pwd, ls, and cd.',
        order: 2,
        lessons: []
      },
      {
        id: 'ch-2-3',
        moduleId: 'mod-2',
        title: 'Chapter 2.3 — Listing Files',
        description: 'Explore file metadata details using arguments.',
        order: 3,
        lessons: []
      },
      {
        id: 'ch-2-4',
        moduleId: 'mod-2',
        title: 'Chapter 2.4 — Paths',
        description: 'Differentiate between absolute and relative targets.',
        order: 4,
        lessons: []
      }
    ]
  },
  {
    id: 'mod-3',
    title: 'Module 3: Files & Directories',
    order: 3,
    chapters: [
      { id: 'ch-3-1', moduleId: 'mod-3', title: 'Chapter 3.1 — Creating Files', description: 'touch and redirections', order: 1, lessons: [] },
      { id: 'ch-3-2', moduleId: 'mod-3', title: 'Chapter 3.2 — Creating Directories', description: 'mkdir and mkdir -p', order: 2, lessons: [] },
      { id: 'ch-3-3', moduleId: 'mod-3', title: 'Chapter 3.3 — Copying Files', description: 'cp and recursive copiers', order: 3, lessons: [] },
      { id: 'ch-3-4', moduleId: 'mod-3', title: 'Chapter 3.4 — Moving Files', description: 'mv and renaming processes', order: 4, lessons: [] },
      { id: 'ch-3-5', moduleId: 'mod-3', title: 'Chapter 3.5 — Deleting Files', description: 'rm, rmdir, and directory clearings', order: 5, lessons: [] },
      { id: 'ch-3-6', moduleId: 'mod-3', title: 'Chapter 3.6 — File Viewing', description: 'cat, less, head, and tail', order: 6, lessons: [] }
    ]
  },
  {
    id: 'mod-4',
    title: 'Module 4: Understanding Permissions',
    order: 4,
    chapters: [
      { id: 'ch-4-1', moduleId: 'mod-4', title: 'Chapter 4.1 — Users & Groups', description: 'Administrators, owners, and user blocks', order: 1, lessons: [] },
      { id: 'ch-4-2', moduleId: 'mod-4', title: 'Chapter 4.2 — File Permissions', description: 'Read, write, execute privileges', order: 2, lessons: [] },
      { id: 'ch-4-3', moduleId: 'mod-4', title: 'Chapter 4.3 — Permission Commands', description: 'chmod and ownership chown controls', order: 3, lessons: [] },
      { id: 'ch-4-4', moduleId: 'mod-4', title: 'Chapter 4.4 — sudo', description: 'Elevated shell tasks and execution paths', order: 4, lessons: [] }
    ]
  },
  {
    id: 'mod-5',
    title: 'Module 5: Working With Text',
    order: 5,
    chapters: [
      { id: 'ch-5-1', moduleId: 'mod-5', title: 'Chapter 5.1 — Searching Text', description: 'grep search matching systems', order: 1, lessons: [] },
      { id: 'ch-5-2', moduleId: 'mod-5', title: 'Chapter 5.2 — Counting Data', description: 'wc line character counters', order: 2, lessons: [] },
      { id: 'ch-5-3', moduleId: 'mod-5', title: 'Chapter 5.3 — Sorting Data', description: 'sort and filter deduplication', order: 3, lessons: [] },
      { id: 'ch-5-4', moduleId: 'mod-5', title: 'Chapter 5.4 — Transforming Text', description: 'cut and tr pipelines', order: 4, lessons: [] },
      { id: 'ch-5-5', moduleId: 'mod-5', title: 'Chapter 5.5 — Stream Editor', description: 'introduction to sed', order: 5, lessons: [] }
    ]
  },
  {
    id: 'mod-6',
    title: 'Module 6: Finding Things',
    order: 6,
    chapters: [
      { id: 'ch-6-1', moduleId: 'mod-6', title: 'Chapter 6.1 — Finding Files', description: 'find criteria commands', order: 1, lessons: [] },
      { id: 'ch-6-2', moduleId: 'mod-6', title: 'Chapter 6.2 — Locate Database', description: 'locate indexes speed searches', order: 2, lessons: [] },
      { id: 'ch-6-3', moduleId: 'mod-6', title: 'Chapter 6.3 — Command Discovery', description: 'which, whereis, and type', order: 3, lessons: [] }
    ]
  },
  {
    id: 'mod-7',
    title: 'Module 7: Processes & System Monitoring',
    order: 7,
    chapters: [
      { id: 'ch-7-1', moduleId: 'mod-7', title: 'Chapter 7.1 — Understanding Processes', description: 'PID tracking and foreground/background', order: 1, lessons: [] },
      { id: 'ch-7-2', moduleId: 'mod-7', title: 'Chapter 7.2 — Monitoring', description: 'ps, top, and htop resource monitors', order: 2, lessons: [] },
      { id: 'ch-7-3', moduleId: 'mod-7', title: 'Chapter 7.3 — Killing Processes', description: 'kill, killall, and signals', order: 3, lessons: [] },
      { id: 'ch-7-4', moduleId: 'mod-7', title: 'Chapter 7.4 — Jobs', description: 'jobs, bg, and fg task controls', order: 4, lessons: [] }
    ]
  },
  {
    id: 'mod-8',
    title: 'Module 8: Package Management',
    order: 8,
    chapters: [
      { id: 'ch-8-1', moduleId: 'mod-8', title: 'Chapter 8.1 — Installing Software', description: 'packages and repositories', order: 1, lessons: [] },
      { id: 'ch-8-2', moduleId: 'mod-8', title: 'Chapter 8.2 — APT', description: 'apt updates, upgrades, and installer configurations', order: 2, lessons: [] },
      { id: 'ch-8-3', moduleId: 'mod-8', title: 'Chapter 8.3 — Snap & Flatpak', description: 'modern sandbox package structures', order: 3, lessons: [] }
    ]
  },
  {
    id: 'mod-9',
    title: 'Module 9: Archives & Compression',
    order: 9,
    chapters: [
      { id: 'ch-9-1', moduleId: 'mod-9', title: 'Chapter 9.1 — ZIP Files', description: 'zip and unzip operations', order: 1, lessons: [] },
      { id: 'ch-9-2', moduleId: 'mod-9', title: 'Chapter 9.2 — TAR Archives', description: 'tarball compilation packages', order: 2, lessons: [] },
      { id: 'ch-9-3', moduleId: 'mod-9', title: 'Chapter 9.3 — Compression', description: 'gzip and bzip2 mechanisms', order: 3, lessons: [] }
    ]
  },
  {
    id: 'mod-10',
    title: 'Module 10: Networking Essentials',
    order: 10,
    chapters: [
      { id: 'ch-10-1', moduleId: 'mod-10', title: 'Chapter 10.1 — Network Basics', description: 'DNS, ports, and IP bindings', order: 1, lessons: [] },
      { id: 'ch-10-2', moduleId: 'mod-10', title: 'Chapter 10.2 — Connectivity Commands', description: 'ping, curl, and wget downloads', order: 2, lessons: [] },
      { id: 'ch-10-3', moduleId: 'mod-10', title: 'Chapter 10.3 — Network Information', description: 'ip, ss, and netstat interfaces', order: 3, lessons: [] }
    ]
  },
  {
    id: 'mod-11',
    title: 'Module 11: Terminal Productivity',
    order: 11,
    chapters: [
      { id: 'ch-11-1', moduleId: 'mod-11', title: 'Chapter 11.1 — Command History', description: 'reverse searches and listings', order: 1, lessons: [] },
      { id: 'ch-11-2', moduleId: 'mod-11', title: 'Chapter 11.2 — Autocomplete', description: 'tab index completion processes', order: 2, lessons: [] },
      { id: 'ch-11-3', moduleId: 'mod-11', title: 'Chapter 11.3 — Redirection', description: 'standard inputs, outputs, and appends', order: 3, lessons: [] },
      { id: 'ch-11-4', moduleId: 'mod-11', title: 'Chapter 11.4 — Pipes', description: 'standard piping utilities', order: 4, lessons: [] },
      { id: 'ch-11-5', moduleId: 'mod-11', title: 'Chapter 11.5 — Combining Commands', description: 'chaining commands with &&, ||, and ;', order: 5, lessons: [] }
    ]
  },
  {
    id: 'mod-12',
    title: 'Module 12: Introduction to Bash',
    order: 12,
    chapters: [
      { id: 'ch-12-1', moduleId: 'mod-12', title: 'Chapter 12.1 — What is Bash?', description: 'shell scripting parameters', order: 1, lessons: [] },
      { id: 'ch-12-2', moduleId: 'mod-12', title: 'Chapter 12.2 — Running Scripts', description: 'executing .sh scripts', order: 2, lessons: [] },
      { id: 'ch-12-3', moduleId: 'mod-12', title: 'Chapter 12.3 — Variables', description: 'variable declarations and outputs', order: 3, lessons: [] },
      { id: 'ch-12-4', moduleId: 'mod-12', title: 'Chapter 12.4 — User Input', description: 'reading parameters from stdin', order: 4, lessons: [] },
      { id: 'ch-12-5', moduleId: 'mod-12', title: 'Chapter 12.5 — Output', description: 'echo and printf interfaces', order: 5, lessons: [] }
    ]
  },
  {
    id: 'mod-13',
    title: 'Module 13: Bash Logic',
    order: 13,
    chapters: [
      { id: 'ch-13-1', moduleId: 'mod-13', title: 'Chapter 13.1 — Conditions', description: 'if, else, and elif statements', order: 1, lessons: [] },
      { id: 'ch-13-2', moduleId: 'mod-13', title: 'Chapter 13.2 — Comparison Operators', description: 'numeric and string comparisons', order: 2, lessons: [] },
      { id: 'ch-13-3', moduleId: 'mod-13', title: 'Chapter 13.3 — Case Statements', description: 'pattern checks', order: 3, lessons: [] }
    ]
  },
  {
    id: 'mod-14',
    title: 'Module 14: Loops',
    order: 14,
    chapters: [
      { id: 'ch-14-1', moduleId: 'mod-14', title: 'Chapter 14.1 — for Loop', description: 'iterative listings', order: 1, lessons: [] },
      { id: 'ch-14-2', moduleId: 'mod-14', title: 'Chapter 14.2 — while Loop', description: 'conditional loop systems', order: 2, lessons: [] },
      { id: 'ch-14-3', moduleId: 'mod-14', title: 'Chapter 14.3 — until Loop', description: 'until loops configurations', order: 3, lessons: [] },
      { id: 'ch-14-4', moduleId: 'mod-14', title: 'Chapter 14.4 — break & continue', description: 'skipping and breaking loop checks', order: 4, lessons: [] }
    ]
  },
  {
    id: 'mod-15',
    title: 'Module 15: Functions',
    order: 15,
    chapters: [
      { id: 'ch-15-1', moduleId: 'mod-15', title: 'Chapter 15.1 — Creating Functions', description: 'modular scripts declarations', order: 1, lessons: [] },
      { id: 'ch-15-2', moduleId: 'mod-15', title: 'Chapter 15.2 — Parameters', description: 'argument variables bindings', order: 2, lessons: [] },
      { id: 'ch-15-3', moduleId: 'mod-15', title: 'Chapter 15.3 — Return Values', description: 'exit status and return evaluations', order: 3, lessons: [] }
    ]
  },
  {
    id: 'mod-16',
    title: 'Module 16: Real Shell Scripting',
    order: 16,
    chapters: [
      { id: 'ch-16-1', moduleId: 'mod-16', title: 'Chapter 16.1 — Backup Script', description: 'file archives cron utilities', order: 1, lessons: [] },
      { id: 'ch-16-2', moduleId: 'mod-16', title: 'Chapter 16.2 — Log Analyzer', description: 'text parser validation pipelines', order: 2, lessons: [] },
      { id: 'ch-16-3', moduleId: 'mod-16', title: 'Chapter 16.3 — File Organizer', description: 'automatic document classifications', order: 3, lessons: [] },
      { id: 'ch-16-4', moduleId: 'mod-16', title: 'Chapter 16.4 — System Monitor', description: 'RAM CPU resource tracking scripts', order: 4, lessons: [] },
      { id: 'ch-16-5', moduleId: 'mod-16', title: 'Chapter 16.5 — Password Generator', description: 'random character arrays scripts', order: 5, lessons: [] }
    ]
  },
  {
    id: 'mod-17',
    title: 'Module 17: Git Basics',
    order: 17,
    chapters: [
      { id: 'ch-17-1', moduleId: 'mod-17', title: 'Chapter 17.1 — What is Git?', description: 'distributed source code control overview', order: 1, lessons: [] },
      { id: 'ch-17-2', moduleId: 'mod-17', title: 'Chapter 17.2 — Repositories', description: 'worktree index histories', order: 2, lessons: [] },
      { id: 'ch-17-3', moduleId: 'mod-17', title: 'Chapter 17.3 — Core Commands', description: 'git init, clone, add, and commit', order: 3, lessons: [] },
      { id: 'ch-17-4', moduleId: 'mod-17', title: 'Chapter 17.4 — GitHub Workflow', description: 'remotes commits and PR pushes', order: 4, lessons: [] }
    ]
  },
  {
    id: 'mod-18',
    title: 'Module 18: Linux Power User',
    order: 18,
    chapters: [
      { id: 'ch-18-1', moduleId: 'mod-18', title: 'Chapter 18.1 — Aliases', description: 'custom terminal commands maps', order: 1, lessons: [] },
      { id: 'ch-18-2', moduleId: 'mod-18', title: 'Chapter 18.2 — Environment Variables', description: 'PATH and system exports', order: 2, lessons: [] },
      { id: 'ch-18-3', moduleId: 'mod-18', title: 'Chapter 18.3 — Cron Jobs', description: 'automated system crontab scheduler', order: 3, lessons: [] },
      { id: 'ch-18-4', moduleId: 'mod-18', title: 'Chapter 18.4 — SSH', description: 'remote login keys connections', order: 4, lessons: [] },
      { id: 'ch-18-5', moduleId: 'mod-18', title: 'Chapter 18.5 — tmux', description: 'persistent screen multiplexer', order: 5, lessons: [] },
      { id: 'ch-18-6', moduleId: 'mod-18', title: 'Chapter 18.6 — Advanced Pipes', description: 'named pipes standard error streams', order: 6, lessons: [] }
    ]
  },
  {
    id: 'mod-19',
    title: 'Module 19: Challenges & Mini Projects',
    order: 19,
    chapters: [
      { id: 'ch-19-1', moduleId: 'mod-19', title: 'Beginner Tasks', description: 'creating folders, logs traversal challenges', order: 1, lessons: [] },
      { id: 'ch-19-2', moduleId: 'mod-19', title: 'Intermediate Scripts', description: 'backup utilities, notes manager challenges', order: 2, lessons: [] },
      { id: 'ch-19-3', moduleId: 'mod-19', title: 'Advanced Scenarios', description: 'interactive dashboard script challenges', order: 3, lessons: [] }
    ]
  },
  {
    id: 'mod-20',
    title: 'Module 20: Final Certification Project',
    order: 20,
    chapters: [
      { id: 'ch-20-1', moduleId: 'mod-20', title: 'Project A: File Manager', description: 'write modular file manager bash tool', order: 1, lessons: [] },
      { id: 'ch-20-2', moduleId: 'mod-20', title: 'Project B: System Info Tool', description: 'compile dashboard monitor script', order: 2, lessons: [] },
      { id: 'ch-20-3', moduleId: 'mod-20', title: 'Project C: Task Manager', description: 'interactive checklist planner bash app', order: 3, lessons: [] },
      { id: 'ch-20-4', moduleId: 'mod-20', title: 'Project D: CLI Password Vault', description: 'encrypted storage password script', order: 4, lessons: [] }
    ]
  }
];
