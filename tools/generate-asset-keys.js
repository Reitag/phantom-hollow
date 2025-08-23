import fs from 'fs';
import path from 'path';

const packsDir = path.resolve('src/data/json-packs');
const outputFile = path.resolve('src/constants/asset-keys.ts');

const packFiles = fs.readdirSync(packsDir).filter((f) => f.endsWith('.json'));

const assets = {};

for (const file of packFiles) {
  const filePath = path.join(packsDir, file);
  const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (Array.isArray(jsonData.files)) {
    const keys = jsonData.files
      .filter((item) => typeof item.key === 'string')
      .map((item) => item.key);
    assets[path.basename(file, '.json')] = keys;
  }
}

let output = `// AUTO-GENERATED FILE. Do not edit directly.
// Generated from src/data/json-packs/*.json\n`;

for (const [group, keys] of Object.entries(assets)) {
  const groupName = group.toUpperCase().replace(/-/g, '_');
  output += `\nexport const ${groupName} = {\n`;
  keys.forEach((key) => {
    const constName = key.toUpperCase().replace(/-/g, '_');
    output += `  ${constName}: '${key}',\n`;
  });
  output += `} as const;\n`;
}

fs.writeFileSync(outputFile, output, 'utf8');

console.log(`asset-keys.ts generated at ${outputFile}`);
