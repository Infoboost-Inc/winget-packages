import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const manifestsPath = join(__dirname, '../data/manifests.json');

export default function handler(req, res) {
  const manifests = JSON.parse(readFileSync(manifestsPath, 'utf-8'));
  res.status(200).json(manifests);
}
