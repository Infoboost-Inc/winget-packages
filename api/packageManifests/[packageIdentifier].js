import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const manifestsPath = join(__dirname, '../../data/manifests.json');
const manifests = JSON.parse(readFileSync(manifestsPath, 'utf-8'));

export default function handler(req, res) {
  const { packageIdentifier } = req.query;

  if (!packageIdentifier) {
    return res.status(400).json({ error: 'Package identifier required' });
  }

  // Find the manifest
  const manifest = manifests.find(
    m => m.PackageIdentifier.toLowerCase() === packageIdentifier.toLowerCase()
  );

  if (!manifest) {
    return res.status(404).json({ error: 'Package not found' });
  }

  // Return the full manifest in WinGet format
  const response = {
    Data: {
      PackageIdentifier: manifest.PackageIdentifier,
      Versions: [
        {
          PackageVersion: manifest.PackageVersion,
          DefaultLocale: {
            PackageLocale: manifest.PackageLocale || "en-US",
            Publisher: manifest.Publisher,
            PublisherUrl: manifest.PublisherUrl,
            PublisherSupportUrl: manifest.PublisherSupportUrl,
            PrivacyUrl: manifest.PrivacyUrl,
            Author: manifest.Author,
            PackageName: manifest.PackageName,
            PackageUrl: manifest.PackageUrl,
            License: manifest.License || "Unknown",
            LicenseUrl: manifest.LicenseUrl,
            Copyright: manifest.Copyright,
            CopyrightUrl: manifest.CopyrightUrl,
            ShortDescription: manifest.ShortDescription || "",
            Description: manifest.Description,
            Moniker: manifest.Moniker,
            Tags: manifest.Tags || [],
            Agreements: manifest.Agreements || [],
            ReleaseNotes: manifest.ReleaseNotes,
            ReleaseNotesUrl: manifest.ReleaseNotesUrl,
            PurchaseUrl: manifest.PurchaseUrl,
            InstallationNotes: manifest.InstallationNotes,
            Documentations: manifest.Documentations || []
          },
          Installers: manifest.Installers.map(installer => ({
            Architecture: installer.Architecture,
            InstallerType: installer.InstallerType,
            InstallerUrl: installer.InstallerUrl,
            InstallerSha256: installer.InstallerSha256,
            SignatureSha256: installer.SignatureSha256,
            Scope: installer.Scope,
            InstallerLocale: installer.InstallerLocale,
            Platform: installer.Platform,
            MinimumOSVersion: installer.MinimumOSVersion,
            InstallerSwitches: installer.InstallerSwitches || {},
            ExpectedReturnCodes: installer.ExpectedReturnCodes,
            UpgradeBehavior: installer.UpgradeBehavior,
            Commands: installer.Commands,
            Protocols: installer.Protocols,
            FileExtensions: installer.FileExtensions,
            Dependencies: installer.Dependencies,
            PackageFamilyName: installer.PackageFamilyName,
            ProductCode: installer.ProductCode,
            Capabilities: installer.Capabilities,
            RestrictedCapabilities: installer.RestrictedCapabilities,
            Markets: installer.Markets,
            InstallerSuccessCodes: installer.InstallerSuccessCodes,
            ElevationRequirement: installer.ElevationRequirement,
            UnsupportedOSArchitectures: installer.UnsupportedOSArchitectures,
            AppsAndFeaturesEntries: installer.AppsAndFeaturesEntries,
            InstallationMetadata: installer.InstallationMetadata
          }))
        }
      ]
    }
  };

  res.status(200).json(response);
}
