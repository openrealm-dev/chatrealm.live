import http from "node:http";
import { WebSocketServer } from "ws";

import { initializeWebSocketConnection } from "./lib/handler.js";
import logger from "./lib/logger.js";
import {
  activeWSConnectionsGauge,
  register,
  totalRequestsCounter,
} from "./lib/monitor.js";
import WebSocketManager from "./lib/websocket-manager.js";
import { C2SMessage } from "./types.js";

// HTTP Server setup
const app = http.createServer(async (request, response) => {
  if (request.method === "GET" && request.url === "/metrics") {
    response.writeHead(200, { "Content-Type": register.contentType });
    response.end(await register.metrics());
  } else {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.end("Not Found");
  }
});

app.listen(9095, () => {
  logger.info("HTTP server listening on port 9095");
});

// WebSocket Server setup
const port = Number(process.env.PORT) || 9001;
const wss = new WebSocketServer({ port });

logger.info(`WebSocket server started on port ${port}`);

wss.on("connection", (ws) => {
  totalRequestsCounter.inc();
  activeWSConnectionsGauge.inc();

  const wsManager = new WebSocketManager(ws);

  ws.on("error", console.error);

  ws.on("message", (data) => {
    const message = JSON.parse(data.toString()) as C2SMessage;
    if (message.type === "C2SINIT") {
      initializeWebSocketConnection(wsManager, message);
    }
  });

  ws.on("close", () => {
    activeWSConnectionsGauge.dec();
  });
});
