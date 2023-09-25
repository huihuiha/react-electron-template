/**
 * 执行shell脚本的语言
 */

import { Options, PythonShell } from 'python-shell';

const path = require('path');

const rootPath = path.join(__dirname, '../../../');
const pythonPath = path.join(rootPath, 'python');

function getShellPath(filename: string) {
  return path.join(pythonPath, filename);
}

export async function runShell(shellName: string, options: Options = {}) {
  console.log(getShellPath(shellName));
  return PythonShell.run(getShellPath(shellName), options).then(
    (messages) => {},
  );
}
