const fs = require('fs');

function sanitizeValidationCommand(cmd) {
  if (!cmd) return cmd;

  // Step 1: Normalize all literal escaped quotes to unescaped double quotes
  let clean = cmd.replace(/\\"/g, '"');

  // Step 2: Standardize check subshell formatting
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

const lessons = JSON.parse(fs.readFileSync('scratch/all_firestore_lessons.json', 'utf8'));

let count = 0;
let errors = 0;

for (const m of lessons) {
  for (const card of m.cards) {
    if (card.validationCommand) {
      count++;
      const sanitized = sanitizeValidationCommand(card.validationCommand);
      
      // Let's do a basic parenthesis count validation
      let openParen = 0;
      let closeParen = 0;
      for (const char of sanitized) {
        if (char === '(') openParen++;
        if (char === ')') closeParen++;
      }

      if (openParen !== closeParen) {
        console.error(`Mismatch in ${card.id} - ${card.title}:`);
        console.error(`  Original: ${card.validationCommand}`);
        console.error(`  Sanitized: ${sanitized}`);
        console.error(`  Open: ${openParen}, Close: ${closeParen}`);
        errors++;
      }
    }
  }
}

console.log(`Validated ${count} commands. Found ${errors} parenthesis mismatch errors.`);
