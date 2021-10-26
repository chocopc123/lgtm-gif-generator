import React, { useState } from 'react';
import Head from 'next/head';
import Gif from '../components/gif';
import styles from '../styles/Generator.module.css';
import { GetStaticProps } from 'next';

type Props = {
  gifs: any;
};

const Generator = (props: Props) => {
  const [gifs, setGifs] = useState(props.gifs);
  return (
    <div className={styles.container}>
      <Head>
        <title>Generate LGTM Gif</title>
        <meta name="description" content="Generate LGTM Gif from GIPHY" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-3/5">
        <form className="flex justify-center mt-10" onSubmit={(e) => getGif(e)}>
          <input
            id="search"
            type="search"
            name="search"
            className="inline-block bg-white text-gray-700 border border-gray-300 rounded py-2 px-4 mr-1 focus:outline-none focus:bg-white focus:border-gray-400 w-3/6"
          />
          <input
            type="button"
            value="Search"
            className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded w-1/6 content-center"
            onClick={(e) => getGif(e)}
          />
        </form>
      </div>
      <div className={styles.grid}>
        {gifs.data.map((data: any) => (
          <Gif key={data.id} gif={data}></Gif>
        ))}
      </div>
    </div>
  );

  async function getGif(e: any) {
    e.preventDefault();
    const searchInput = document.getElementById('search') as HTMLInputElement;
    const searchString = searchInput.value;
    changeUrlParams(searchString);
    const gifs = await fetch(`/api/search?search=${searchString}`)
      .then((response) => response.json())
      .catch((err) => {
        console.error('Error:', err);
      });
    setGifs(gifs);
  }

  function changeUrlParams(searchString: string) {
    const url = new URL(window.location.href);
    url.searchParams.set('search', searchString);
    window.history.replaceState({}, '', `${url.toString()}`);
  }
};

export const getStaticProps: GetStaticProps = async () => {
  const giphyApiKey = process.env.GIPHY_API_KEY;
  const gifs = await fetch(
    `https://api.giphy.com/v1/gifs/trending?api_key=${giphyApiKey}&limit=15&rating=g`
  )
    .then((res) => res.json())
    .catch((err) => {
      console.error('Error:', err);
    });
  return {
    props: {
      gifs,
    },
  };
};

export default Generator;
