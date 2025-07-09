import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('unityPackageCreator.createUnityPackage', async () => {
      const packageName = await vscode.window.showInputBox({
        prompt: 'Enter a name for the Unity package',
      });

      if (!packageName) {
        vscode.window.showErrorMessage('Package name is required.');
        return;
      }

		const folderUri = await vscode.window.showOpenDialog({
			canSelectFiles: false,
			canSelectFolders: true,
			canSelectMany: false,
			openLabel: 'Select folder to create the Unity Package'
		});
      if (!folderUri || folderUri.length === 0) {
		vscode.window.showErrorMessage('You must select a folder.');
		return;
		}
		const selectedPath = folderUri[0].fsPath;

      const packagesPath = path.join(selectedPath, packageName);
      fs.mkdirSync(packagesPath, { recursive: true });

      // Subfolders
      ['Runtime', 'Editor', 'Tests'].forEach(subdir =>
        fs.mkdirSync(path.join(packagesPath, subdir), { recursive: true })
      );

	  const userProvidedDescription = await vscode.window.showInputBox({
        prompt: 'Enter a description for your Unity package',
      });
	  const description = userProvidedDescription || "Your Unity package description.";

      // Files
      fs.writeFileSync(path.join(packagesPath, 'package.json'), `{
  "name": "${packageName}",
  "version": "0.1.0",
  "displayName": "${packageName}",
  "description": "${description}",
  "unity": "2021.3",
  "author": {
    "name": "Your Name",
    "email": "you@example.com"
  }
}
`);

      fs.writeFileSync(path.join(packagesPath, 'CHANGELOG.md'), `# Changelog

## [0.1.0] - Initial version
`);

      fs.writeFileSync(path.join(packagesPath, 'LICENSE.md'), `MIT License

Your license here.
`);

      fs.writeFileSync(path.join(packagesPath, 'README.md'), `# ${packageName}

Describe your Unity package here.
`);

      vscode.window.showInformationMessage(`Unity package "${packageName}" created!`);
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
