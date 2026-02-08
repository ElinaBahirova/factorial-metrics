import { Router, type Request, type Response } from 'express';
import { parseRangeQuery } from '../lib/dateRange';
import { uuidSchema, createDefinitionSchema, createValueSchema } from '../schemas/metrics';
import { sendError, sendServerError } from '../lib/errors';
import type { MetricsService } from '../services/metricsService';

/**
 * Thin HTTP layer: validate input, call service, send response (SRP).
 * Depends on MetricsService (DIP).
 */
export function createMetricsRouter(metricsService: MetricsService): Router {
  const router = Router();

  // GET /metrics/definitions – all metric definitions
  router.get('/definitions', async (_req: Request, res: Response) => {
    try {
      const definitions = await metricsService.listDefinitions();
      res.status(200).json(definitions);
    } catch (e) {
      sendServerError(res, e);
    }
  });

  // GET /metrics/definitions/:id – one metric definition
  router.get('/definitions/:id', async (req: Request, res: Response) => {
    const parsed = uuidSchema.safeParse(req.params.id);
    if (!parsed.success) return sendError(res, 400, parsed.error.message);
    try {
      const definition = await metricsService.getDefinitionById(parsed.data);
      if (!definition) return sendError(res, 404, 'Metric definition not found');
      res.status(200).json(definition);
    } catch (e) {
      sendServerError(res, e);
    }
  });

  // GET /metrics/values?range=24h|7d|30d – all values grouped by metric
  router.get('/values', async (req: Request, res: Response) => {
    const range = parseRangeQuery(req.query.range);
    try {
      const { data } = await metricsService.getValuesByRange(range);
      res.status(200).json({ data });
    } catch (e) {
      sendServerError(res, e);
    }
  });

  // GET /metrics/definitions/:id/values?range=24h|7d|30d – values for one metric
  router.get('/definitions/:id/values', async (req: Request, res: Response) => {
    const parsed = uuidSchema.safeParse(req.params.id);
    if (!parsed.success) return sendError(res, 400, parsed.error.message);
    const range = parseRangeQuery(req.query.range);
    try {
      const result = await metricsService.getDefinitionWithValues(parsed.data, range);
      if (!result) return sendError(res, 404, 'Metric definition not found');
      res.status(200).json(result);
    } catch (e) {
      sendServerError(res, e);
    }
  });

  // POST /metrics/definitions – create definition (409 if name exists)
  router.post('/definitions', async (req: Request, res: Response) => {
    const result = createDefinitionSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json(result.error.flatten());
    try {
      const out = await metricsService.createDefinition(result.data);
      if (!out.success) {
        return res.status(409).json({
          error: 'Metric with this name already exists',
          code: out.error,
          field: out.field,
        });
      }
      res.status(201).json(out.definition);
    } catch (e) {
      sendServerError(res, e);
    }
  });

  // POST /metrics/values – create value
  router.post('/values', async (req: Request, res: Response) => {
    const result = createValueSchema.safeParse(req.body);
    if (!result.success) return res.status(400).json(result.error.flatten());
    try {
      const out = await metricsService.createValue(result.data);
      if (!out.success) {
        return sendError(res, 404, 'Metric definition not found');
      }
      res.status(201).json(out.value);
    } catch (e) {
      sendServerError(res, e);
    }
  });

  return router;
}
