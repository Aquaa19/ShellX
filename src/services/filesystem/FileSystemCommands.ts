// List directory contents as machine-readable output
export function buildListCommand(path: string): string {
  // Uses \ls and color=never to prevent ANSI/alias carriage return characters.
  // Handles folder names containing spaces correctly using awk string assembly.
  return `\\ls -la --color=never --time-style='+' "${path}" 2>/dev/null | awk 'NR>1 {name=$6; for(i=7; i<=NF; i++) name=name " " $i; print $1,$5,name}'`;
}

export function buildStatCommand(path: string): string {
  return `stat --printf="%n|%s|%F\\n" "${path}" 2>/dev/null`;
}

export function buildReadFileCommand(path: string, maxLines: number = 50): string {
  return `head -n ${maxLines} "${path}" 2>/dev/null`;
}

export function buildHomeDirCommand(): string {
  return 'echo $HOME';
}

export function buildTypeCheckCommand(path: string): string {
  return `[ -d "${path}" ] && echo DIR || ([ -f "${path}" ] && echo FILE || echo NONE)`;
}
