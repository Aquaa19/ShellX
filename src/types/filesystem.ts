export type FileNodeType = 'file' | 'directory' | 'symlink';

export interface FileTreeNode {
  name:       string;
  path:       string;
  type:       FileNodeType;
  size?:      number;       // Size in bytes (undefined for directories)
  extension?: string;
  children?:  FileTreeNode[];  // undefined: not fetched; []: empty directory
  isLoading?: boolean;         // Spinner trigger during async child fetching
  isExpanded?: boolean;
}
