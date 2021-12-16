import React, { useState } from 'react';
import styles from '../styles/Gif.module.css';
import Image from 'next/image';
import Modal from '../components/modal';
import { CSSTransition } from 'react-transition-group';

type Props = { gif: any };

const Gif = (props: Props) => {
  const [gifLoaded, setGifLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <CSSTransition
        in={gifLoaded}
        timeout={300}
        classNames={{
          enter: styles.modalEnter,
          enterActive: styles.modalEnterActive,
        }}
      >
        <div
          className={styles.card + ' ' + (gifLoaded ? 'visible' : 'invisible')}
          onClick={() => setShowModal(!showModal)}
        >
          <Image
            src={props.gif.images.fixed_width.url}
            alt={props.gif.title}
            width={props.gif.images.fixed_width.width}
            height={props.gif.images.fixed_width.height}
            onLoadingComplete={() => setGifLoaded(true)}
          />
        </div>
      </CSSTransition>
      {showModal && (
        <Modal
          data={props.gif}
          toggleModal={() => setShowModal(!showModal)}
          showModal={showModal}
        />
      )}
    </>
  );
};

export default Gif;
