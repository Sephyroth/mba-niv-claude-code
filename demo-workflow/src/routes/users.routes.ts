import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Padrão: middleware aplicado por rota.
router.get('/users', requireAuth, (_req: AuthenticatedRequest, res: Response) => {
  res.json({ users: [{ id: '1', name: 'Alice' }, { id: '2', name: 'Bob' }] });
});

router.get('/users/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({ id: req.params.id, name: 'Alice' });
});

router.delete('/users/:id', (req: AuthenticatedRequest, res: Response) => {
  res.json({ deleted: req.params.id });
});

export default router;
