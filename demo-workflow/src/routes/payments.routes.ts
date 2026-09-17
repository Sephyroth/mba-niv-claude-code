import { Router, Request, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

router.post('/payments/charge', (req: Request, res: Response) => {
  const { amount, currency } = req.body ?? {};
  res.status(201).json({ chargeId: 'ch_001', amount, currency: currency ?? 'usd' });
});

router.get('/payments/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({ id: req.params.id, status: 'succeeded' });
});

export default router;
