function sanitizeValidationCommand(cmd) {
  if (!cmd) return cmd;

  // Step 1: Normalize escaped quotes first
  let clean = cmd.replace(/\\"/g, '"');

  // Step 2: Match and format checks
  const regex = /\[\s*"\$\(\(?\s*(.+?)\s*\)\s*\|\s*tr\s+'\[:upper:\]'\s+'\[:lower:\]'\s*\)"\s*=\s*"(.+?)"\s*\]/gi;

  let sanitized = clean.replace(regex, (match, script, expected) => {
    let cleanScript = script.trim();
    const cleanExpected = expected.trim();

    // Strip leading parenthesis if it was mismatched due to regex capturing
    if (cleanScript.startsWith('(')) {
      cleanScript = cleanScript.slice(1).trim();
    }

    return `[ "$( ( ${cleanScript} ) | tr '[:upper:]' '[:lower:]' )" = "${cleanExpected}" ]`;
  });

  return sanitized;
}

const originalCmd = `[ \\"$( ( uname -r | grep -qE '^[0-9]+\\\\.[0-9]+' && echo \\\\\\\"OK\\\\\\\" || echo \\\\\\\"FAIL\\\\\\\" ) | tr '[:upper:]' '[:lower:]' )\\" = \\"ok\\" ] && [ \\"$( ( [ \\\\\\\"$(whoami)\\\\\\\" = \\\\\\\"student\\\\\\\" ] && echo \\\\\\\"OK\\\\\\\" || echo \\\\\\\"FAIL\\\\\\\" ) | tr '[:upper:]' '[:lower:]' )\\" = \\"ok\\" ] && [ \\"$( ( cat /etc/os-release | grep -qi \\\\\\\"ubuntu\\\\|debian\\\\|fedora\\\\|centos\\\\|linux\\\\\\\" && echo \\\\\\\"OK\\\\\\\" || echo \\\\\\\"FAIL\\\\\\\" ) | tr '[:upper:]' '[:lower:]' )\\" = \\"ok\\" ] && echo \\"SHELLX_OK\\"`;

// Let's parse the string from JSON representation to match what we have in memory in Javascript
const parsedCmd = JSON.parse(`"${originalCmd}"`);

console.log("IN MEMORY:");
console.log(parsedCmd);

console.log("\nSANITIZED:");
console.log(sanitizeValidationCommand(parsedCmd));
