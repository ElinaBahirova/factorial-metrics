import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import { config } from './config';
import { prisma } from './lib/prisma';
import { errorHandler, notFoundHandler } from './lib/middleware';
import { createMetricsRepository } from './repositories/metricsRepository';
import { MetricsService } from './services/metricsService';
import { createMetricsRouter } from './routes/metrics';
import { createHealthRouter } from './routes/health';

const metricsRepository = createMetricsRepository(prisma);
const metricsService = new MetricsService(metricsRepository);
const metricsRouter = createMetricsRouter(metricsService);
const healthRouter = createHealthRouter(prisma);

const app = express();
app.use(cors({
  origin: config.CORS_ORIGIN,
}));
app.use(express.json());

app.use('/health', healthRouter);
app.use('/metrics', metricsRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(config.PORT, () => {
  console.log(`API running on port ${config.PORT}`);
});

process.on('SIGTERM', () => {
  server.close(() => {
    prisma.$disconnect().then(() => process.exit(0));
  });
});
process.on('SIGINT', () => {
  server.close(() => {
    prisma.$disconnect().then(() => process.exit(0));
  });
});
