import fs from 'fs';
import path from 'path';

// Read package-json
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));

const outputDir = 'build_electron';
const oldPath = path.join(outputDir, 'win-unpacked');
const newPath = path.join(outputDir, `${pkg.name}-${pkg.version}`);

try {
  // Looking for win-unpacked
  if (fs.existsSync(oldPath)) {
    // Delete
    if (fs.existsSync(newPath)) {
      console.log(`Removing previous build: ${newPath}`);
      fs.rmSync(newPath, { recursive: true, force: true });
    }

    // Rename
    fs.renameSync(oldPath, newPath);
    console.log(`The build is ready: ${newPath}`);
  } else {
    console.error('Error: win-unpacked distribulante not found.');
  }
} catch (err) {
  console.error('Error:', err.message);
}
