import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const children = [];
let closing = false;
function closeAll() {
  if (closing) return;
  closing = true;
  for (const child of children) if (child.exitCode === null && child.signalCode === null) child.kill('SIGTERM');
}
function launch(name, script) {
  const child = spawn(process.execPath, [resolve(root, script)], { cwd: root, stdio: 'inherit', env: process.env });
  children.push(child);
  child.on('error', (error) => { console.error(`[${name}]`, error.message); closeAll(); process.exitCode = 1; });
  child.on('exit', (code, signal) => {
    if (!closing) {
      console.log(`[${name}] Finalizó (${signal ?? code ?? '?'})`);
      process.exitCode = code || (signal ? 1 : 0);
      closeAll();
    }
  });
}
process.on('SIGINT', closeAll);
process.on('SIGTERM', closeAll);
console.log('Umbralis · frontend + API REST mock');
launch('REST mock', 'server/mock-api.mjs');
launch('Vite', 'node_modules/vite/bin/vite.js');
