import { createServer } from "node:http";
import { CATALOG } from "./catalog";
import { renderPage } from "./render";

const PORT = Number(process.env.WEB_PORT ?? 4200);

const server = createServer((_req, res) => {
  res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  res.end(renderPage(CATALOG));
});

server.listen(PORT, () => {
  console.log(`[storefront] ouvindo em http://localhost:${PORT}`);
});
