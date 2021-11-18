async function search(searchString: any, offset: number) {
  const giphyApiKey = process.env.GIPHY_API_KEY;
  var url;
  if (searchString) {
    url = encodeURI(
      `https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${searchString}&limit=15&offset=${offset}&rating=g&lang=en`
    );
  } else {
    url = `https://api.giphy.com/v1/gifs/trending?api_key=${giphyApiKey}&limit=15&rating=g`;
  }
  return await fetch(url)
    .then((res) => res.json())
    .catch((err) => {
      console.error('Error:', err);
    });
}

export { search };
