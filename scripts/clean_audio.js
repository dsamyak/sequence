import fs from 'fs';
import path from 'path';

// Import using readFileSync and regex to avoid needing babel/node for ES modules
const MAP_FILE = path.join(process.cwd(), 'src', 'utils', 'audioMap.js');
const OUT_DIR = path.join(process.cwd(), 'public', 'assets', 'audio');

if (!fs.existsSync(OUT_DIR)) {
  console.log("No audio directory exists yet.");
  process.exit(0);
}

if (!fs.existsSync(MAP_FILE)) {
  console.log("No audioMap.js found.");
  process.exit(0);
}

const mapContent = fs.readFileSync(MAP_FILE, 'utf-8');
const match = mapContent.match(/export const audioMap = ({[\s\S]*?});/);

if (!match) {
  console.error("Could not parse audioMap.js");
  process.exit(1);
}

const audioMap = JSON.parse(match[1]);
const validFiles = new Set(Object.values(audioMap).map(p => path.basename(p)));

const files = fs.readdirSync(OUT_DIR);
let deleted = 0;

for (const file of files) {
  if (file.endsWith('.mp3') && !validFiles.has(file)) {
    console.log(`🗑️ Deleting orphaned file: ${file}`);
    fs.unlinkSync(path.join(OUT_DIR, file));
    deleted++;
  }
}

console.log(`✅ Clean complete. Deleted ${deleted} orphaned files.`);
