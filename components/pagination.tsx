import React, { useState } from 'react';
import styles from '../styles/Gif.module.css';

type Props = {
  pageNumber: number;
  setPageNumber: any;
  getGifs: any;
  paginationInfo: any;
  pageLimit: number;
};

const Pagination = (props: Props) => {
  return (
    <div>
      <button onClick={() => getPreviewPageGifs()}>&lt;前へ</button>-
      <button onClick={() => getNextPageGifs()}>次へ&gt;</button>
    </div>
  );

  async function getPreviewPageGifs() {
    if (props.pageNumber > 1) {
      props.setPageNumber(props.pageNumber - 1);
      props.getGifs(props.pageNumber - 1);
    }
  }
  async function getNextPageGifs() {
    const totalCount = props.paginationInfo.total_count;
    const totalPageCount = Math.ceil(totalCount / props.pageLimit);
    if (props.pageNumber < totalPageCount) {
      props.setPageNumber(props.pageNumber + 1);
      props.getGifs(props.pageNumber + 1);
    }
  }
};

export default Pagination;
