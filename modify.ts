import fs from 'fs';
import path from 'path';

function walk(dir: string, callback: (filepath: string) => void) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      walk(filepath, callback);
    } else if (filepath.endsWith('.tsx') || filepath.endsWith('.ts')) {
      callback(filepath);
    }
  }
}

walk('./src', (filepath) => {
  let content = fs.readFileSync(filepath, 'utf8');
  content = content.replace(/zinc-/g, 'slate-');
  content = content.replace(/brand-cyan/g, 'cyan-500');
  content = content.replace(/brand-emerald/g, 'emerald-400');
  content = content.replace(/brand-gold/g, 'amber-400');
  content = content.replace(/brand-rose/g, 'rose-500');
  content = content.replace(/bg-bg-surface/g, 'bg-black');
  
  // Specific tweaks for theme matching
  content = content.replace(/bg-bg-base\/80/g, 'bg-black/50');
  content = content.replace(/shadow-\[0_0_[\d]+px_rgba\([^)]+\)\]/g, ''); // remove glow shadows
  content = content.replace(/text-glow-[a-z]+/g, ''); // remove glow text
  
  fs.writeFileSync(filepath, content, 'utf8');
});

console.log('Modified all files.');
