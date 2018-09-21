import * as vscode from 'vscode';
import Sed from './sed';
import Utils from './utils';
import Config from './config';

export function activate(context: vscode.ExtensionContext) {
    let executablePath = Utils.getSedExecutable();
    if (!executablePath) {
        vscode.window.showErrorMessage("No sed executable found, whether specify it in config or add it to you PATH environment variable.");
        return;
    }
    let sed = new Sed(executablePath);
    console.log('VSCode Sed initialized.');

    context.subscriptions.push(
        /**
         * execute sed command
         */
        vscode.commands.registerCommand('sed.execute', async (...args: any[]) => {
            args.forEach(arg => {
                console.log(arg);
            });
            let editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage("Please open a document first.");
                return;
            }
            // Get inputs
            let document = editor.document;
            let condition = await vscode.window.showInputBox({
                ignoreFocusOut: true,
                placeHolder: "No slash ('/') required",
                prompt: "Condition (Optional)"
            });
            let action = await vscode.window.showInputBox({
                ignoreFocusOut: true,
                prompt: "Action"
            });
            if (!action) {
                vscode.window.showErrorMessage("Please provide action.");
                return;
            }
            // Create result file
            let uri = new vscode.Uri().with({
                scheme: "untitled",
                path: "Result"
            });
            let processedDocument = await vscode.workspace.openTextDocument(uri);
            let processedEditor = await vscode.window.showTextDocument(processedDocument);
            // Process the text
            let config = vscode.workspace.getConfiguration('sed') as Config;
            let batchSize = config.batchSize || 1000;
            for (let i = 0; i < document.lineCount; i += batchSize) {
                let end = Math.min(i + batchSize - 1, document.lineCount - 1);

                let startPos = document.lineAt(i).range.start;
                let endPos = document.lineAt(end).range.end;

                let text = document.getText(new vscode.Range(startPos, endPos));
                if (text.length === 0) continue;
                let processedBuffer = sed.execute(text, action, condition);
                if (!processedBuffer || processedBuffer.length === 0) continue;
                let processedText = processedBuffer.toString();
                // Insert into processed document
                let processedEndPos = processedDocument.lineAt(processedDocument.lineCount - 1).range.end;
                await processedEditor.edit(edit => {
                    edit.insert(processedEndPos, processedText);
                });
            }
        }),
        /**
         * Show current executable path
         */
        vscode.commands.registerCommand('sed.showExecutablePath', () => {
            vscode.window.showInformationMessage(`Using sed at ${executablePath}.`);
        })
    );
}

export function deactivate() {
}