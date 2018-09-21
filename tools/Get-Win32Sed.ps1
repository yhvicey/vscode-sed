#!/usr/bin/env pwsh

$downloadUrl = "https://master.dl.sourceforge.net/project/gnuwin32/sed/4.2.1/sed-4.2.1-bin.zip";
$guid = New-Guid;
$projectRoot = "$PSScriptRoot\.."
$tempFile = "$projectRoot/$guid.zip";
$tempDir = "$projectRoot/$guid";

try {
    Import-Module BitsTransfer;
    Start-BitsTransfer -Source $downloadUrl -Destination "$projectRoot/$guid.zip";
    Expand-Archive -Path $tempFile -DestinationPath $tempDir;
    $libDir = "$projectRoot/lib/win32";
    if (!(Test-Path $libDir)) {
        New-Item -Path $libDir -ItemType Directory;
    }
    Copy-Item -Path "$tempDir/bin/sed.exe" -Destination $libDir -Force;
}
catch {
    throw $_;
}
finally {
    Remove-Module BitsTransfer;
    if (Test-Path $tempFile) {
        Remove-Item $tempFile -Force;
    }
    if (Test-Path $tempDir) {
        Remove-Item $tempDir -Recurse -Force;
    }
}
