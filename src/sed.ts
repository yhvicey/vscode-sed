import * as vscode from 'vscode';
import Config from './config';
import * as spawn from 'cross-spawn';

export default class Sed {
    private executablePath: string;

    public constructor(executablePath: string) {
        this.executablePath = executablePath;
    }

    public execute(text: string, command: string) {
        const config = vscode.workspace.getConfiguration('sed') as Config;
        const fullArgs = (config.options || []).concat(command);
        // Start sed process
        const cp = spawn.sync(this.executablePath, fullArgs, {
            input: text,
            stdio: "pipe",
            timeout: config.timeout || 1000,
            maxBuffer: 200 * 1024 + text.length,
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
