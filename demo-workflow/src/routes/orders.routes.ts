import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Padrão: todo o router protegido de uma vez.
router.use(requireAuth);

router.get('/orders', (_req: AuthenticatedRequest, res: Response) => {
  res.json({ orders: [{ id: '100', total: 42 }] });
});

router.get('/orders/:id', (req: AuthenticatedRequest, res: Response) => {
  res.json({ id: req.params.id, total: 42 });
});

router.post('/orders', (req: AuthenticatedRequest, res: Response) => {
  res.status(201).json({ id: '101', ...req.body });
});

router.delete('/orders/:id', (req: AuthenticatedRequest, res: Response) => {
  res.json({ deleted: req.params.id });
});

export default router;
