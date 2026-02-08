import type { Response } from 'express';

export function sendError(res: Response, status: number, message: string, extra?: Record<string, unknown>) {
  res.status(status).json({ error: message, ...extra });
}

export function sendServerError(res: Response, err: unknown) {
  console.error(err);
  res.status(500).json({ error: 'An unexpected error occurred' });
}
