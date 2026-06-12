const { spawn } = require('child_process');

const testCmd = `[ "$( ( uname -r | grep -qE '^[0-9]+\\.[0-9]+' && echo "OK" || echo "FAIL" ) | tr '[:upper:]' '[:lower:]' )" = "ok" ] && [ "$( ( [ "$(whoami)" = "shell" ] && echo "OK" || echo "FAIL" ) | tr '[:upper:]' '[:lower:]' )" = "ok" ] && echo YES`;

const child = spawn('adb', ['shell', testCmd]);

child.stdout.on('data', (data) => {
  console.log("STDOUT:", data.toString().trim());
});

child.stderr.on('data', (data) => {
  console.error("STDERR:", data.toString().trim());
});

child.on('close', (code) => {
  console.log(`Child exited with code ${code}`);
});
