import { createServer } from 'node:http';
import { createHandler } from './handler.mjs';

const port = Number(process.env.MOCK_PORT ?? 4174);
const server = createServer(createHandler());
server.listen(port, '127.0.0.1', () => {
  console.log(`[mock REST] http://127.0.0.1:${port}/api/health`);
});
server.on('error', (error) => {
  console.error('[mock REST] No se pudo iniciar:', error.message);
  process.exitCode = 1;
});
