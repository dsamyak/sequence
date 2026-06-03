import fs from 'fs';
import path from 'path';
import https from 'https';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const API_KEY = process.env.VITE_ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY;
const VOICE_ID = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice

if (!API_KEY) {
  console.error("Missing ElevenLabs API Key. Set VITE_ELEVENLABS_API_KEY in .env.local");
  process.exit(1);
}

const OUT_DIR = path.join(process.cwd(), 'public', 'assets', 'audio');
const MAP_FILE = path.join(process.cwd(), 'src', 'utils', 'audioMap.js');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// ──────────────────────────────────────────────────
// Define the exact phrases used in narration.js
// ──────────────────────────────────────────────────
const phrases = [
  // Intro
  { text: "Welcome to Number Patterns and Sequences!", style: 'encouragement' },
  { text: "Today, we are going to discover amazing number patterns.", style: 'statement' },
  { text: "What happens when we count by twos, fives, tens, hundreds, or even thousands?", style: 'question' },
  { text: "Are you ready to explore number patterns and solve some mysteries?", style: 'statement' },
  
  // Wonder
  { text: "John is waiting for a train. The display says: 5 min, 10 min, 15 min, 20 min... What comes next?", style: 'question' },
  { text: "If a house number is 1000, the next is 2000, then 3000... what is the rule?", style: 'question' },
  { text: "Great thinking!", style: 'celebration' },
  { text: "Let us discover the answer in our story!", style: 'statement' },

  // Story
  { text: "John is waiting at the train station. The display shows trains arriving at minutes 5, 10, 15, 20.", style: 'statement' },
  { text: "Can you see the pattern? The trains come every 5 minutes!", style: 'question' },
  { text: "Sarah visits the market. Apples cost 100, 200, 300, 400 cents.", style: 'statement' },
  { text: "The price goes up by 100 each time. That is a number pattern!", style: 'emphasis' },
  { text: "Mike counts the steps on a staircase: 2, 4, 6, 8, 10.", style: 'statement' },
  { text: "Each step adds 2 more. When we add the same number each time, that is an ascending pattern.", style: 'statement' },
  { text: "Aisha has 50 stickers. She gives away 10 each day: 50, 40, 30, 20, 10.", style: 'statement' },
  { text: "When we subtract the same number each time, that is a descending pattern.", style: 'emphasis' },
  { text: "Luca looks at house numbers: 1000, 2000, 3000, 4000.", style: 'statement' },
  { text: "Wow! Counting by thousands! The rule is plus 1000.", style: 'celebration' },
  { text: "Now you know what number patterns are!", style: 'statement' },
  { text: "Patterns are everywhere, and you can find them!", style: 'encouragement' },
  { text: "Let us practice making patterns ourselves.", style: 'instruction' },
  { text: "Let us continue!", style: 'statement' },

  // Simulate
  { text: "Look at the number line. Find the missing number by figuring out the pattern rule!", style: 'instruction' },
  { text: "Look at these numbers. Which ones show a correct pattern? Tap to check!", style: 'instruction' },
  { text: "Now fill in the missing number. Use the number pad to type your answer!", style: 'instruction' },
  { text: "Is this pattern going up or down? Choose ascending or descending!", style: 'instruction' },
  { text: "Let's build a pattern! Follow the rule and pick the next numbers.", style: 'instruction' },
  
  { text: "Correct! The rule is plus 10.", style: 'celebration' },
  { text: "You completed the number line!", style: 'encouragement' },
  { text: "Yes! That is a correct pattern.", style: 'celebration' },
  { text: "Amazing! You got it right!", style: 'celebration' },
  { text: "You are ready to play!", style: 'encouragement' },
  { text: "Correct! The numbers are getting smaller.", style: 'celebration' },
  { text: "You built a perfect pattern!", style: 'celebration' },

  // Play Worlds
  { text: "Welcome to Number Town!", style: 'encouragement' },
  { text: "Welcome to Pattern Park!", style: 'encouragement' },
  { text: "Welcome to Sequence Sea!", style: 'encouragement' },
  { text: "Welcome to Cloud City!", style: 'encouragement' },
  { text: "Welcome to Math Mountain!", style: 'encouragement' },
  { text: "Welcome to Digit Desert!", style: 'encouragement' },
  { text: "Welcome to Logic Lair!", style: 'encouragement' },
  { text: "Welcome to Crystal Cave!", style: 'encouragement' },
  { text: "Welcome to Rainbow Road!", style: 'encouragement' },
  { text: "Welcome to Master Palace!", style: 'encouragement' },
  { text: "Answer the questions. You can do it!", style: 'instruction' },

  // Play Actions
  { text: "Correct! Well done!", style: 'celebration' },
  { text: "Try the next one!", style: 'encouragement' },
  
  // Play Complete (Variations)
  { text: "You completed Number Town with three stars!", style: 'celebration' },
  { text: "You completed Number Town with two stars!", style: 'celebration' },
  { text: "You completed Number Town with one stars!", style: 'celebration' }, // (sic based on function return)
  { text: "You completed Number Town with zero stars!", style: 'celebration' },
  // Let's generate a fallback for World Complete and wrong answer since they are dynamic
  // For the sake of this pipeline script, we will omit the fully dynamic combinations and just assume they will fallback to silent if missing, 
  // or we can pre-generate common ones. 
  
  // Reflect
  { text: "What did you learn about number patterns?", style: 'question' },
  { text: "How confident do you feel about number patterns?", style: 'statement' },
];

// Map styles to elevenlabs settings
const STYLE_SETTINGS = {
  statement: { stability: 0.5, similarity_boost: 0.75, style: 0.0 },
  question: { stability: 0.3, similarity_boost: 0.8, style: 0.2 },
  encouragement: { stability: 0.6, similarity_boost: 0.85, style: 0.4 },
  celebration: { stability: 0.8, similarity_boost: 0.9, style: 0.6 },
  instruction: { stability: 0.4, similarity_boost: 0.7, style: 0.1 },
  emphasis: { stability: 0.2, similarity_boost: 0.8, style: 0.3 }
};

const getFileName = (text) => {
  const hash = crypto.createHash('md5').update(text).digest('hex').substring(0, 8);
  const safeText = text.replace(/[^a-z0-9]/gi, '_').substring(0, 30);
  return `audio_${safeText}_${hash}.mp3`;
};

const generateAudio = (text, style) => {
  return new Promise((resolve, reject) => {
    const fileName = getFileName(text);
    const filePath = path.join(OUT_DIR, fileName);

    if (fs.existsSync(filePath)) {
      console.log(`[SKIP] Already exists: ${fileName}`);
      return resolve(`/assets/audio/${fileName}`);
    }

    console.log(`[GENERATING] ${text.substring(0, 40)}...`);
    const settings = STYLE_SETTINGS[style] || STYLE_SETTINGS.statement;

    const data = JSON.stringify({
      text: text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: settings
    });

    const req = https.request({
      hostname: 'api.elevenlabs.io',
      path: `/v1/text-to-speech/${VOICE_ID}`,
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
      }
    }, (res) => {
      if (res.statusCode !== 200) {
        let errData = '';
        res.on('data', d => errData += d);
        res.on('end', () => reject(new Error(`API Error ${res.statusCode}: ${errData}`)));
        return;
      }
      
      const fileStream = fs.createWriteStream(filePath);
      res.pipe(fileStream);
      fileStream.on('finish', () => resolve(`/assets/audio/${fileName}`));
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
};

async function run() {
  const audioMap = {};
  for (const phrase of phrases) {
    try {
      const url = await generateAudio(phrase.text, phrase.style);
      audioMap[phrase.text] = url;
      // Sleep slightly to respect rate limits
      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      console.error(`Failed to generate "${phrase.text}":`, err.message);
    }
  }

  // Generate audioMap.js
  const mapContent = `// Auto-generated by scripts/generate_audio.js
export const audioMap = ${JSON.stringify(audioMap, null, 2)};
`;
  fs.writeFileSync(MAP_FILE, mapContent);
  console.log('✅ Generated audioMap.js');
}

run();
