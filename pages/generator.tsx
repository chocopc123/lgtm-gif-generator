import Head from 'next/head';
import Gif from '../components/gif';
import styles from '../styles/Generator.module.css';
import { GetStaticProps } from 'next';

export default function Generator({ gifs }: { gifs: any }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Generate LGTM Gif</title>
        <meta name="description" content="Generate LGTM Gif from GIPHY" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-3/5">
        <form className="flex justify-center mt-10">
          <input
            type="search"
            name="search"
            className="inline-block bg-white text-gray-700 border border-gray-300 rounded py-2 px-4 mr-1 focus:outline-none focus:bg-white focus:border-gray-400 w-3/6"
          />
          <input
            type="submit"
            value="Search"
            className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded w-1/6 content-center"
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
}

export const getStaticProps: GetStaticProps = async () => {
  const giphyApiKey = process.env.GIPHY_API_KEY;
  let gifs;
  const response = await fetch(
    `https://api.giphy.com/v1/gifs/trending?api_key=${giphyApiKey}&limit=15&rating=g`
  )
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      gifs = json;
    })
    .catch((err) => {
      console.error('Error:', err);
    });
  return {
    props: {
      gifs,
    },
  };
};
