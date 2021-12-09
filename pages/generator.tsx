import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Gif from '../components/gif';
import styles from '../styles/Generator.module.css';
import { GetServerSideProps } from 'next';
import { search } from '../helpers/searchHelpers';
import { Pagination } from '@mui/material';

type Props = {
  gifs: any;
};

const Generator = (props: Props) => {
  const [gifs, setGifs] = useState(props.gifs);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageLimit, setPageLimit] = useState(15);
  const totalCount = gifs.pagination.total_count;
  const totalPageCount = Math.ceil(totalCount / pageLimit);
  const maxPages = Math.ceil(5000 / pageLimit);

  useEffect(() => {
    const url = new URL(window.location.href);
    const searchInput = document.getElementById('search') as HTMLInputElement;
    // queryparamsにsearchが存在する場合は検索フォームにも反映
    if (url.searchParams.get('search')) {
      searchInput.value = url.searchParams.get('search') as string;
    } else {
      deleteUrlParams('search');
    }
    // デフォルトで検索フォームにカーソル配置
    searchInput.focus();
    // queryparamsにpageが存在する場合はpropsに設定
    const page = Number(url.searchParams.get('page'));
    if (page > 1) {
      const adjustedPage = page > 0 ? page : 1;
      setPageNumber(adjustedPage);
    } else {
      deleteUrlParams('page');
    }
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Generate LGTM Gif</title>
        <meta name="description" content="Generate LGTM Gif from GIPHY" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-3/5">
        <form className="flex justify-center mt-10" onSubmit={(e) => getSearchGifs(e)}>
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
            onClick={(e) => getSearchGifs(e)}
          />
        </form>
      </div>

      <div className={styles.grid}>
        {gifs.data.map((data: any) => (
          <Gif key={data.id} gif={data}></Gif>
        ))}
      </div>

      <Pagination
        className="my-5"
        count={maxPages < totalPageCount ? maxPages : totalPageCount}
        shape="rounded"
        size="large"
        page={pageNumber}
        onChange={getPageGifs}
      />
    </div>
  );

  async function getGifs(pageNumber: number) {
    const searchInput = document.getElementById('search') as HTMLInputElement;
    const searchString = searchInput.value;
    const gifs = await fetch(
      `/api/search?search=${searchString}&offset=${(pageNumber - 1) * pageLimit}&limit=${pageLimit}`
    )
      .then((response) => response.json())
      .catch((err) => {
        console.error('Error:', err);
      });
    setGifs(gifs);
  }

  async function getSearchGifs(e: any) {
    e.preventDefault();
    const searchString = (document.getElementById('search') as HTMLInputElement).value;
    changeUrlParams('search', searchString);
    setPage(1);
    getGifs(1);
  }

  function getPageGifs(event: React.ChangeEvent<unknown>, page: number) {
    setPage(page);
    getGifs(page);
  }

  function setPage(pageNumber: number) {
    setPageNumber(pageNumber);
    if (pageNumber > 1) {
      changeUrlParams('page', pageNumber.toString());
    } else {
      deleteUrlParams('page');
    }
  }

  function changeUrlParams(paramName: string, paramValue: string | null) {
    const url = new URL(window.location.href);
    if (paramValue) {
      url.searchParams.set(paramName, paramValue);
    } else {
      url.searchParams.delete(paramName);
    }
    window.history.replaceState({}, '', `${url.toString()}`);
  }

  function deleteUrlParams(paramName: string) {
    const url = new URL(window.location.href);
    url.searchParams.delete(paramName);
    window.history.replaceState({}, '', `${url.toString()}`);
  }
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const page = Number(context.query.page);
  const adjustedPage = page > 0 ? page : 1;
  const offset = (adjustedPage - 1) * 15;
  const gifs = await search(context.query.search, offset.toString(), '15');
  return {
    props: {
      gifs,
    },
  };
};

export default Generator;
