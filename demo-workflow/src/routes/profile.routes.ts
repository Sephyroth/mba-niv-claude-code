import { Router, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Padrão: middleware direto no handler de cada rota.
router.get('/profile', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({ userId: req.userId, name: 'Alice' });
});

router.put('/profile', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({ userId: req.userId, ...req.body });
});

router.patch('/profile/password', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({ userId: req.userId, passwordChanged: true });
});

export default router;
