# Sed

Invoke sed for your current document inside vscode.

## Usage

Press F1, enter `sed:` and choose `Sed: Execute`, enter your sed command and hit enter. Result will be shown in a new editor.

![Usage](images/usage.gif)

## Build

Build|Publish
-|-
[![Build status](https://vicey.visualstudio.com/GithubProjectsCICD/_apis/build/status/vscode-sed%20-%20Build)](https://vicey.visualstudio.com/GithubProjectsCICD/_build/latest?definitionId=8)|[![Build status](https://vicey.visualstudio.com/GithubProjectsCICD/_apis/build/status/vscode-sed%20-%20Publish)](https://vicey.visualstudio.com/GithubProjectsCICD/_build/latest?definitionId=9)

### Prerequisite

- [Powershell](https://github.com/powershell/powershell)
- [node](https://github.com/nodejs/node)
- [yarn](https://github.com/yarnpkg/yarn) (Recommanded) or [npm](https://github.com/npm/cli)

### How to build

```powershell
# Download sed.exe for win32
PS> ./tools/Get-Win32Sed.ps1

# Download packages
PS> yarn
#PS> npm install --save-dev # Or use npm

# Compile package
PS> yarn run compile
#PS> npm run compile

# Create package
PS> yarn run package #-o <package path>
#PS> npm run package #-- -o <package path>

# Publish package
PS> yarn run release --packagePath <package path> --pat <VSTS PAT>
#PS> npm run release -- --packagePath <package path> --pat <VSTS PAT>
```

## TODO

- [ ] Add shortcut in context menu
- [ ] Save favorite commands
- [ ] Customize commands showing in the context menu