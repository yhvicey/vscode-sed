import * as child_process from 'child_process';
import * as vscode from 'vscode';
import Config from './config';

export default class Sed {
    private executablePath: string;

    public constructor(executablePath: string) {
        this.executablePath = executablePath;
    }

    public execute(text: string, action: string, condition?: string) {
        const script = this.getScript(action, condition);
        const config = vscode.workspace.getConfiguration('sed') as Config;
        const fullArgs = config.options && config.options.concat(script) || [script];
        // Start sed process
        const cp = child_process.spawnSync(this.executablePath, fullArgs, {
            input: text,
            stdio: "pipe",
            timeout: config.timeout || 1000,
            maxBuffer: text.length,
            encoding: config.encoding || 'utf-8'
        });
        if (cp.stderr.length !== 0) {
            vscode.window.showErrorMessage(`sed execution failed. Error message: ${cp.stderr}`);
            console.error(cp.stderr);
        } else if (cp.error) {
            vscode.window.showErrorMessage(`Failed to execute sed. Please goto github and create an issue for it.`);
            console.error(cp.error);
        } else {
            return cp.stdout;
        }
    }

    private getScript(action: string, condition?: string) {
        if (condition) {
            // Normalize condition
            if (!condition.startsWith('/')) {
                condition = `/${condition}`;
            }
            if (!condition.endsWith('/')) {
                condition = `${condition}/`;
            }
            return `${condition} ${action}`;
        } else {
            return action;
        }
    }
}
