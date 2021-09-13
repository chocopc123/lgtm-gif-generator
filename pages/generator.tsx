import Head from "next/head";
import styles from "../styles/Generator.module.css";
import { GetStaticProps } from "next";

export default function Generator({ gifs }: { gifs: any }) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Generate LGTM Gif</title>
        <meta name="description" content="Generate LGTM Gif from GIPHY" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <form>
        <label>
          <input type="text" name="search" />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <div className={styles.grid}>
        {gifs.data.map((data: any) => (
          <div key={data.id} className={styles.card}>
            <img src={data.images.fixed_width.url}></img>
          </div>
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
      console.error("Error:", err);
    });
  return {
    props: {
      gifs,
    },
  };
};
