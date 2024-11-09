import { collectDefaultMetrics, Counter, Gauge, Registry } from "prom-client";

export const register = new Registry();
collectDefaultMetrics({ register });

export const matchedUserCounter = new Counter({
  help: "matched users counter",
  name: "matched_users_counter",
});

export const totalRequestsCounter = new Counter({
  help: "total requests_counter",
  name: "total_requests_counter",
});

export const activeWSConnectionsGauge = new Gauge({
  help: "active ws connections",
  name: "active_ws_connections",
});

export const queueSizeGuage = new Gauge({
  help: "queue size guage",
  name: "queue_size_guage",
});

register.registerMetric(matchedUserCounter);
register.registerMetric(totalRequestsCounter);
register.registerMetric(activeWSConnectionsGauge);
register.registerMetric(queueSizeGuage);
