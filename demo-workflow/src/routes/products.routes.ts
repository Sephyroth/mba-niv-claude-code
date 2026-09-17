import { Router, Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Catálogo público.
router.get('/products', (_req: Request, res: Response) => {
  res.json({ products: [{ id: 'p1', name: 'Widget', price: 9.99 }] });
});

router.get('/products/:id', (req: Request, res: Response) => {
  res.json({ id: req.params.id, name: 'Widget', price: 9.99 });
});

router.post('/products', (req: AuthenticatedRequest, res: Response) => {
  res.status(201).json({ id: 'p2', ...req.body });
});

router.put('/products/:id', (req: AuthenticatedRequest, res: Response) => {
  res.json({ id: req.params.id, ...req.body });
});

export default router;
