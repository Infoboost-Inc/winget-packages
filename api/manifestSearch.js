import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const manifestsPath = join(__dirname, '../data/manifests.json');
const manifests = JSON.parse(readFileSync(manifestsPath, 'utf-8'));

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { Query, Inclusions, Filters } = req.body;
  
  let results = manifests;

  // Filter based on query
  if (Query && Query.KeyWord) {
    const keyword = Query.KeyWord.toLowerCase();
    results = results.filter(manifest => 
      manifest.PackageIdentifier.toLowerCase().includes(keyword) ||
      manifest.PackageName.toLowerCase().includes(keyword)
    );
  }

  // Filter based on match type
  if (Query && Query.MatchType === 'Exact') {
    results = results.filter(manifest =>
      manifest.PackageIdentifier === Query.KeyWord ||
      manifest.PackageName === Query.KeyWord
    );
  }

  // Apply additional filters
  if (Filters) {
    Filters.forEach(filter => {
      if (filter.PackageMatchField === 'PackageIdentifier') {
        results = results.filter(manifest =>
          manifest.PackageIdentifier === filter.RequestMatch.KeyWord
        );
      }
    });
  }

  // Format response
  const response = {
    Data: results.map(manifest => ({
      PackageIdentifier: manifest.PackageIdentifier,
      PackageName: manifest.PackageName,
      Publisher: manifest.Publisher,
      Versions: [
        {
          PackageVersion: manifest.PackageVersion
        }
      ]
    }))
  };

  res.status(200).json(response);
}
