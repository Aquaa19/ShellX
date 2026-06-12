const https = require('https');
const fs = require('fs');

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error("Malformed JSON: " + body));
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  try {
    const modulesRes = await get('https://firestore.googleapis.com/v1/projects/shellx-6cb6b/databases/(default)/documents/lessons');
    if (!modulesRes.documents) {
      console.log("No modules found.");
      return;
    }

    const allData = [];
    for (const doc of modulesRes.documents) {
      const moduleId = doc.name.split('/').pop();
      const cardsRes = await get(`https://firestore.googleapis.com/v1/projects/shellx-6cb6b/databases/(default)/documents/lessons/${moduleId}/lessonCards`);
      
      const cards = [];
      if (cardsRes.documents) {
        for (const card of cardsRes.documents) {
          const cardId = card.name.split('/').pop();
          cards.push({
            id: cardId,
            title: card.fields.title?.stringValue,
            validationCommand: card.fields.validationCommand?.stringValue,
            validationExpected: card.fields.validationExpected?.stringValue
          });
        }
      }
      allData.push({ moduleId, cards });
    }

    fs.writeFileSync('scratch/all_firestore_lessons.json', JSON.stringify(allData, null, 2));
    console.log("Dumped all lessons to scratch/all_firestore_lessons.json");
  } catch (error) {
    console.error("Error:", error);
  }
}

run();
