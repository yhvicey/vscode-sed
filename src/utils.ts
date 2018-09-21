import { existsSync } from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';
import * as which from 'which';
import Config from './config';

export default class Utils {
    /**
     * Get sed's executable in below order:
     * 1. sed in config
     * 2. sed in PATH
     * 3. sed under lib/${platform}
     *
     * @returns {(string | null)} Executable path of sed program
     */
    public static getSedExecutable(): string | undefined {
        // Find sed in configuration
        let config = vscode.workspace.getConfiguration("sed") as Config;
        let executablePath = config.sedPath;
        if (executablePath && existsSync(executablePath))
            return executablePath;
        // Find sed in PATH
        try {
            executablePath = which.sync("sed");
            if (existsSync(executablePath))
                return executablePath;
        }
        catch { /* no-op */ }
        // Find sed under lib folder
        let platform = os.platform();
        executablePath = path.join(__dirname, "../lib", platform, "sed");
        if (platform === 'win32')
            executablePath = executablePath + ".exe";
        if (executablePath && existsSync(executablePath))
            return executablePath;
        return undefined;
    }

}