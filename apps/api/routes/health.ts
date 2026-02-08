import { Router, type Request, type Response } from 'express';
import type { PrismaClient } from '@prisma/client';

/**
 * Health route for orchestration (k8s, load balancers).
 * GET /health – readiness: 200 if DB is reachable, 503 otherwise.
 */
export function createHealthRouter(prisma: PrismaClient): Router {
  const router = Router();

  router.get('/', async (_req: Request, res: Response) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.status(200).json({ status: 'ok' });
    } catch {
      res.status(503).json({ status: 'error', error: 'Database unavailable' });
    }
  });

  return router;
}
