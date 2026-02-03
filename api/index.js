// Main entry point for WinGet REST API
export default function handler(req, res) {
  res.status(200).json({
    Data: {
      SourceIdentifier: "WinGet-Custom-Source",
      ServerSupportedVersions: ["1.0.0", "1.1.0", "1.4.0", "1.5.0", "1.6.0", "1.7.0"]
    }
  });
}
