// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { search } from '../../helpers/searchHelpers';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const gifs = await search(req.query.search, req.query.offset, req.query.limit);
  res.status(200).json(gifs);
}
