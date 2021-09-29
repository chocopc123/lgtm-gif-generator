// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const giphyApiKey = process.env.GIPHY_API_KEY;
  const searchString = req.query.search;
  let url;
  if (searchString === '') {
    url = `https://api.giphy.com/v1/gifs/trending?api_key=${giphyApiKey}&limit=15&rating=g`;
  } else {
    url = encodeURI(
      `https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${req.query.search}&limit=15&offset=0&rating=g&lang=en`
    );
  }
  const gifs = await fetch(url)
    .then((res) => res.json())
    .catch((err) => {
      console.error('Error:', err);
    });
  res.status(200).json(gifs);
}
