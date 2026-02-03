import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default function handler(req, res) {
  // Serve the HTML page
  const htmlPath = join(__dirname, '../public/index.html');
  const html = readFileSync(htmlPath, 'utf-8');
  
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}
