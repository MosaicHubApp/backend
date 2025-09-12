import { Request } from 'express';

export function getFullUrl(req: Request): string {
  const host = req.get('host');
  const protocol = req.protocol;
  return `${protocol}://${host}`;
}