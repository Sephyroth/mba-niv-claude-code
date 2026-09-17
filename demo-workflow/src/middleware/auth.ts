import { Request, Response, NextFunction } from 'express';

// Tokens de exemplo aceitos pela API de demonstração.
const VALID_TOKENS = new Set<string>([
  'demo-token-alice',
  'demo-token-bob',
  'demo-token-admin',
]);

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

/**
 * Valida um Bearer token no header Authorization.
 * Rejeita com 401 quando o token está ausente ou é inválido.
 */
export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const header = req.header('authorization');

  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or malformed Authorization header' });
    return;
  }

  const token = header.slice('Bearer '.length).trim();

  if (!VALID_TOKENS.has(token)) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }

  req.userId = token.replace('demo-token-', '');
  next();
}
