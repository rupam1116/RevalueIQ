const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, 'src');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = walkSync(dirFile, filelist);
    } catch (err) {
      if (err.code === 'ENOTDIR' || err.code === 'EBUSY') filelist = [...filelist, dirFile];
    }
  });
  return filelist;
};

const files = walkSync(directory);
const target = "process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'";
const replacement = "getApiUrl()";

let replacedCount = 0;

files.forEach(file => {
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes(target)) {
      // Need to add import { getApiUrl } from '@/lib/api' if not present
      if (!content.includes('getApiUrl')) {
        const importStatement = "import { getApiUrl } from \"@/lib/api\";\n";
        // Insert after "use client"; or at top
        if (content.startsWith('"use client";')) {
          content = content.replace('"use client";', '"use client";\n' + importStatement);
        } else {
          content = importStatement + content;
        }
      }
      
      content = content.replace(/process\.env\.NEXT_PUBLIC_API_URL\s*\|\|\s*'http:\/\/localhost:5000'/g, replacement);
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated ${file}`);
      replacedCount++;
    }
  }
});

console.log(`Done. Updated ${replacedCount} files.`);
