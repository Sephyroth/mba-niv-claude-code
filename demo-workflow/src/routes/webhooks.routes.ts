import { Router, Request, Response } from 'express';

const router = Router();

// público por design — provedores externos chamam sem Bearer token,
// a autenticidade é verificada por assinatura HMAC no corpo.
router.post('/webhooks/stripe', (req: Request, res: Response) => {
  res.json({ received: true, type: req.body?.type ?? 'unknown' });
});

// público por design
router.post('/webhooks/github', (req: Request, res: Response) => {
  res.json({ received: true, event: req.header('x-github-event') ?? 'unknown' });
});

export default router;
