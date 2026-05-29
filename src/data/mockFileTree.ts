export interface FileTreeNode {
  name: string;
  type: 'file' | 'directory';
  path: string;
  extension: string; 
  children?: FileTreeNode[];
}

export const MOCK_FILE_TREE: FileTreeNode[] = [
  {
    name: 'home',
    type: 'directory',
    path: '/home',
    extension: '',
    children: [
      {
        name: 'student',
        type: 'directory',
        path: '/home/student',
        extension: '',
        children: [
          {
            name: 'projects',
            type: 'directory',
            path: '/home/student/projects',
            extension: '',
            children: [
              {
                name: 'hello.sh',
                type: 'file',
                path: '/home/student/projects/hello.sh',
                extension: 'sh',
              },
              {
                name: 'readme.md',
                type: 'file',
                path: '/home/student/projects/readme.md',
                extension: 'md',
              },
            ],
          },
          {
            name: 'config.json',
            type: 'file',
            path: '/home/student/config.json',
            extension: 'json',
          },
        ],
      },
    ],
  },
  {
    name: 'var',
    type: 'directory',
    path: '/var',
    extension: '',
    children: [
      {
        name: 'log',
        type: 'directory',
        path: '/var/log',
        extension: '',
      },
    ],
  },
];