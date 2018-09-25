import * as child_process from 'child_process';
import * as vscode from 'vscode';
import Config from './config';

export default class Sed {
    private executablePath: string;

    public constructor(executablePath: string) {
        this.executablePath = executablePath;
    }

    public execute(text: string, command: string) {
        const config = vscode.workspace.getConfiguration('sed') as Config;
        const fullArgs = (config.options || []).concat(command);
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
            console.warn(cp.error);
        }
        return cp.stdout;
    }
}
