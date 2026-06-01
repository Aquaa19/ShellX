import { FileTreeNode, FileNodeType } from '../../types';

export const FileSystemParser = {
  parseLsOutput(rawOutput: string, parentPath: string): FileTreeNode[] {
    const lines = rawOutput.split(/\r?\n/);
    const nodes: FileTreeNode[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const parts = trimmed.split(/\s+/);
      if (parts.length < 3) continue;

      const permissions = parts[0];
      const size = parseInt(parts[1], 10);
      const name = parts.slice(2).join(' ');

      if (name === '.' || name === '..') continue;

      const firstChar = permissions.charAt(0);
      let type: FileNodeType = 'file';
      if (firstChar === 'd') {
        type = 'directory';
      } else if (firstChar === 'l') {
        type = 'symlink';
      }

      const path = parentPath.endsWith('/')
        ? `${parentPath}${name}`
        : `${parentPath}/${name}`;

      const node: FileTreeNode = {
        name,
        path,
        type,
        isExpanded: false,
        isLoading: false,
      };

      if (type === 'file') {
        node.size = isNaN(size) ? 0 : size;
        const partsOfName = name.split('.');
        if (partsOfName.length > 1) {
          node.extension = partsOfName.pop() || '';
        } else {
          node.extension = '';
        }
      }

      nodes.push(node);
    }

    return nodes.sort((a, b) => {
      if (a.type === 'directory' && b.type !== 'directory') return -1;
      if (a.type !== 'directory' && b.type === 'directory') return 1;
      return a.name.localeCompare(b.name);
    });
  },

  parseStatOutput(rawOutput: string): { name: string; size: number; type: FileNodeType } | null {
    const parts = rawOutput.trim().split('|');
    if (parts.length < 3) return null;

    const name = parts[0];
    const size = parseInt(parts[1], 10);
    const typeStr = parts[2].toLowerCase();

    let type: FileNodeType = 'file';
    if (typeStr.includes('directory')) {
      type = 'directory';
    } else if (typeStr.includes('symbolic link')) {
      type = 'symlink';
    }

    return {
      name,
      size: isNaN(size) ? 0 : size,
      type,
    };
  },
};
