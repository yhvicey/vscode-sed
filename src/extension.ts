import * as vscode from 'vscode';
import Sed from './sed';
import Utils from './utils';
import Config from './config';
import DocHelper from './docHelper';

export function activate(context: vscode.ExtensionContext) {
    const executablePath = Utils.getSedExecutable();
    if (!executablePath) {
        vscode.window.showErrorMessage(
            "No sed executable found, whether specify it in config or add it to you PATH environment variable."
        );
        return;
    }
    const sed = new Sed(executablePath);
    let lastCommand: string | undefined;

    console.log('VSCode Sed initialized.');

    context.subscriptions.push(
        /**
         * execute sed command
         */
        vscode.commands.registerCommand('sed.execute', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage("Please open a document first.");
                return;
            }

            // Get command
            const document = editor.document;
            const command = await vscode.window.showInputBox({
                value: lastCommand,
                ignoreFocusOut: true,
                placeHolder: "Quote is not required",
                prompt: "Command"
            });
            if (command.length === 0) {
                vscode.window.showErrorMessage("Please provide command.");
            }
            lastCommand = command;

            // Open result file
            const uri = vscode.Uri.parse(`untitled:${editor.document.fileName}.result`);
            const processedDocument = await vscode.workspace.openTextDocument(uri);
            await vscode.window.showTextDocument(processedDocument);

            // Process the text
            const config = vscode.workspace.getConfiguration('sed') as Config;
            const batchSize = config.batchSize || 1000;
            await DocHelper.foreachBatch(document, batchSize, async text => {
                if (text.length === 0) { return true; }
                const processedBuffer = sed.execute(text, command);
                if (!processedBuffer || processedBuffer.length === 0) { return true; }
                const processedText = processedBuffer.toString();
                // Insert into processed document
                return await DocHelper.append(processedDocument, processedText);
            });
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
