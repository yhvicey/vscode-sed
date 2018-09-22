import * as vscode from 'vscode';

export default class DocHelper {
    public static async append(document: vscode.TextDocument, text: string) {
        const endPos = this.getRange(document).end;
        const edit = vscode.TextEdit.insert(endPos, text);
        const workspaceEdit = new vscode.WorkspaceEdit();
        workspaceEdit.insert(document.uri, endPos, text);
        return await vscode.workspace.applyEdit(workspaceEdit);
    }

    public static async foreachBatch(
        document: vscode.TextDocument,
        batchSize: number,
        iterator: (text: string) => boolean | Promise<boolean>
    ) {
        for (let i = 0; i < document.lineCount; i += batchSize) {
            const end = Math.min(i + batchSize - 1, document.lineCount - 1);
            const range = this.getRange(document, i, end);

            const startPos = range.start;
            const endPos = range.end;

            const text = document.getText(new vscode.Range(startPos, endPos));
            if (await iterator(text)) {
                continue;
            } else {
                break;
            }
        }
    }

    public static getRange(document: vscode.TextDocument, startLine?: number, endLine?: number) {
        startLine = startLine || 0;
        endLine = endLine || document.lineCount - 1;
        if (startLine > endLine) {
            throw Error("startLine cannot be larget than endLine.");
        }
        return new vscode.Range(
            document.lineAt(startLine).range.start,
            document.lineAt(endLine).range.end
        );
    }
}
