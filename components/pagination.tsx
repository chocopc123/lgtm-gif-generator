import React, { useState } from 'react';
import styles from '../styles/Gif.module.css';

type Props = {
  pageNumber: number;
  setPageNumber: any;
  getGifs: any;
};

const Pagination = (props: Props) => {
  return (
    <div>
      <button onClick={() => getPreviewPageGifs()}>&lt;前へ</button>-
      <button onClick={() => getNextPageGifs()}>次へ&gt;</button>
    </div>
  );

  async function getPreviewPageGifs() {
    if (props.pageNumber > 1) props.setPageNumber(props.pageNumber - 1);
    props.getGifs();
  }
  async function getNextPageGifs() {
    props.setPageNumber(props.pageNumber + 1);
    props.getGifs();
  }
};

export default Pagination;
