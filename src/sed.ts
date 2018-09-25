import * as vscode from 'vscode';
import Config from './config';
import * as spawn from 'cross-spawn';
import Utils from './utils';

export default class Sed {
    public static executablePath?: string;

    public static execute(text: string, command: string) {
        if (!this.executablePath) {
            return;
        }
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
        if (cp.error) {
            console.warn(cp.error);
        }
        if (cp.stderr.length !== 0) {
            vscode.window.showErrorMessage(`sed execution failed. Error message: ${cp.stderr}`);
            console.error(cp.stderr);
        } else {
            return cp.stdout;
        }
    }
}
