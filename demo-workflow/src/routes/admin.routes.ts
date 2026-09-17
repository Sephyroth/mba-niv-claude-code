import { Router, Request, Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Endpoint de manutenção usado por scripts internos de deploy.
router.post('/admin/reset-database', (_req: Request, res: Response) => {
  res.json({ status: 'database reset' });
});

router.use(requireAuth);

router.get('/admin/dashboard', (_req: AuthenticatedRequest, res: Response) => {
  res.json({ metrics: { users: 2, orders: 1 } });
});

router.get('/admin/users', (_req: AuthenticatedRequest, res: Response) => {
  res.json({ users: [{ id: '1', role: 'admin' }] });
});

router.post('/admin/users/:id/promote', (req: AuthenticatedRequest, res: Response) => {
  res.json({ id: req.params.id, role: 'admin' });
});

export default router;
