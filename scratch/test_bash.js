const { exec } = require('child_process');
const fs = require('fs');

const scriptContent = `#!/bin/sh
[ "$( ( uname -r | grep -qE '^[0-9]+\\.[0-9]+' && echo \\"OK\\" || echo \\"FAIL\\" ) | tr '[:upper:]' '[:lower:]' )" = "ok" ] && echo YES || echo NO
`;

fs.writeFileSync('scratch/test.sh', scriptContent.replace(/\r\n/g, '\n'));

exec(`sh scratch/test.sh`, (err, stdout, stderr) => {
  if (err) {
    console.error("SH EXEC ERROR:", err);
  }
  console.log("SH STDOUT:", stdout.trim());
  console.log("SH STDERR:", stderr.trim());
  fs.unlinkSync('scratch/test.sh');
});
