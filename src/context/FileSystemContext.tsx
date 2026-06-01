import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useTerminalConnection } from './TerminalConnectionContext';
import { FileTreeNode } from '../types';
import { buildHomeDirCommand, buildListCommand, buildReadFileCommand } from '../services/filesystem';
import { FileSystemParser } from '../services/filesystem/FileSystemParser';

interface FileSystemContextState {
  tree:            FileTreeNode[];
  rootPath:        string;
  selectedPath:    string | null;
  selectedNode:    FileTreeNode | null;
  isRootLoading:   boolean;
  pendingPaths:    Set<string>;
  initialize:      () => Promise<void>;
  expandFolder:    (node: FileTreeNode) => Promise<void>;
  collapseFolder:  (path: string) => void;
  selectFile:      (node: FileTreeNode) => void;
  openFileInTerminal: (path: string, navigation?: any) => void;
}

const FileSystemContext = createContext<FileSystemContextState | null>(null);

export const FileSystemContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { sendCommand, outputLines, connectionState } = useTerminalConnection();

  const [tree, setTree] = useState<FileTreeNode[]>([]);
  const [rootPath, setRootPath] = useState<string>('/home/student');
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<FileTreeNode | null>(null);
  const [isRootLoading, setIsRootLoading] = useState(false);
  const [pendingPaths, setPendingPaths] = useState<Set<string>>(new Set());

  const pendingRequests = useRef<Map<string, {
    resolve: (output: string) => void;
    reject: (error: Error) => void;
    buffer: string[];
    started: boolean;
  }>>(new Map());

  const lastProcessedIndexRef = useRef(0);

  const executeFSCommand = useCallback((command: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (connectionState !== 'connected') {
        reject(new Error('Socket is not connected.'));
        return;
      }

      const requestId = `fs_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      const timer = setTimeout(() => {
        const req = pendingRequests.current.get(requestId);
        if (req) {
          req.reject(new Error(`FileSystem command timed out: ${command}`));
          pendingRequests.current.delete(requestId);
        }
      }, 10000);

      const originalResolve = resolve;
      const originalReject = reject;

      pendingRequests.current.set(requestId, {
        resolve: (val) => {
          clearTimeout(timer);
          originalResolve(val);
        },
        reject: (err) => {
          clearTimeout(timer);
          originalReject(err);
        },
        buffer: [],
        started: false,
      });

      const fullCommand = `echo "FS_START:${requestId}" && ${command} && echo "FS_END:${requestId}"`;
      sendCommand(fullCommand);
    });
  }, [connectionState, sendCommand]);

  useEffect(() => {
    const lines = outputLines;
    if (lines.length < lastProcessedIndexRef.current) {
      lastProcessedIndexRef.current = 0;
    }

    const startIdx = lastProcessedIndexRef.current;
    for (let i = startIdx; i < lines.length; i++) {
      const line = lines[i];
      if (line.type === 'command') continue;

      const content = line.content.trim();

      if (content.startsWith('FS_START:')) {
        const reqId = content.substring('FS_START:'.length).trim();
        const req = pendingRequests.current.get(reqId);
        if (req) {
          req.started = true;
        }
        continue;
      }

      if (content.startsWith('FS_END:')) {
        const reqId = content.substring('FS_END:'.length).trim();
        const req = pendingRequests.current.get(reqId);
        if (req) {
          const rawOutput = req.buffer.join('\n');
          req.resolve(rawOutput);
          pendingRequests.current.delete(reqId);
        }
        continue;
      }

      pendingRequests.current.forEach((req) => {
        if (req.started) {
          req.buffer.push(line.content);
        }
      });
    }

    lastProcessedIndexRef.current = lines.length;
  }, [outputLines]);

  const initialize = useCallback(async () => {
    if (connectionState !== 'connected') return;
    setIsRootLoading(true);
    setSelectedPath(null);
    setSelectedNode(null);
    try {
      const home = await executeFSCommand(buildHomeDirCommand());
      const cleanHome = home.trim();
      if (cleanHome) {
        setRootPath(cleanHome);
        const lsOutput = await executeFSCommand(buildListCommand(cleanHome));
        const nodes = FileSystemParser.parseLsOutput(lsOutput, cleanHome);
        setTree(nodes);
      }
    } catch (e) {
      console.warn('[FileSystemContext] Init traversal failed:', e);
    } finally {
      setIsRootLoading(false);
    }
  }, [connectionState, executeFSCommand]);

  const expandFolder = useCallback(async (node: FileTreeNode) => {
    if (node.children !== undefined) {
      setTree((prev) =>
        updateNodeInTree(prev, node.path, (n) => ({ ...n, isExpanded: true }))
      );
      return;
    }

    setPendingPaths((prev) => {
      const next = new Set(prev);
      next.add(node.path);
      return next;
    });

    setTree((prev) =>
      updateNodeInTree(prev, node.path, (n) => ({ ...n, isLoading: true }))
    );

    try {
      const lsOutput = await executeFSCommand(buildListCommand(node.path));
      const childNodes = FileSystemParser.parseLsOutput(lsOutput, node.path);

      setTree((prev) =>
        updateNodeInTree(prev, node.path, (n) => ({
          ...n,
          children: childNodes,
          isExpanded: true,
          isLoading: false,
        }))
      );
    } catch (e) {
      console.warn('[FileSystemContext] Folder expansion failed:', e);
      setTree((prev) =>
        updateNodeInTree(prev, node.path, (n) => ({ ...n, isLoading: false }))
      );
    } finally {
      setPendingPaths((prev) => {
        const next = new Set(prev);
        next.delete(node.path);
        return next;
      });
    }
  }, [executeFSCommand]);

  const collapseFolder = useCallback((path: string) => {
    setTree((prev) =>
      updateNodeInTree(prev, path, (n) => ({ ...n, isExpanded: false }))
    );
  }, []);

  const selectFile = useCallback((node: FileTreeNode) => {
    setSelectedPath(node.path);
    setSelectedNode(node);
  }, []);

  const openFileInTerminal = useCallback((path: string, navigation?: any) => {
    sendCommand(buildReadFileCommand(path));
    if (navigation) {
      navigation.navigate('Terminal');
    }
  }, [sendCommand]);

  return (
    <FileSystemContext.Provider
      value={{
        tree,
        rootPath,
        selectedPath,
        selectedNode,
        isRootLoading,
        pendingPaths,
        initialize,
        expandFolder,
        collapseFolder,
        selectFile,
        openFileInTerminal,
      }}
    >
      {children}
    </FileSystemContext.Provider>
  );
};

export const useFileSystemContext = () => {
  const context = useContext(FileSystemContext);
  if (!context) {
    throw new Error('[useFileSystemContext] Must be used within a <FileSystemContextProvider>.');
  }
  return context;
};

// Pure tree node recursion editor with depth limits to prevent stack overflow
function updateNodeInTree(
  nodes: FileTreeNode[],
  targetPath: string,
  updater: (node: FileTreeNode) => FileTreeNode,
  depth = 0
): FileTreeNode[] {
  if (depth > 10) {
    console.warn('[FileSystemContext] Recursion depth limit (10) exceeded.');
    return nodes;
  }
  return nodes.map((node) => {
    if (node.path === targetPath) return updater(node);
    if (node.children) {
      return {
        ...node,
        children: updateNodeInTree(node.children, targetPath, updater, depth + 1),
      };
    }
    return node;
  });
}
