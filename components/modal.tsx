import React, { useState } from 'react';
import styles from '../styles/Modal.module.css';
import Image from 'next/image';
import Loading from '../components/loading';
import { CSSTransition } from 'react-transition-group';

type Props = {
  data: any;
  toggleModal: any;
  generateGifLoaded: boolean;
  generateGifRendered: boolean;
  showModal: boolean;
};

const Modal = (props: Props) => {
  const [showModal, setShowModal] = useState(props.showModal);
  return (
    <div className={styles.modalArea}>
      <CSSTransition
        in={showModal}
        appear={true}
        timeout={200}
        classNames={{
          appear: styles.modalBackgroundEnter,
          appearActive: styles.modalBackgroundEnterActive,
          exit: styles.modalBackgroundExit,
          exitActive: styles.modalBackgroundExitActive,
        }}
        unmountOnExit
        onExited={props.toggleModal}
      >
        <div className={styles.modalBackground} onClick={() => closeModal()} />
      </CSSTransition>
      <CSSTransition
        in={showModal}
        appear={true}
        timeout={200}
        classNames={{
          appear: styles.modalEnter,
          appearActive: styles.modalEnterActive,

          exit: styles.modalExit,
          exitActive: styles.modalExitActive,
        }}
        unmountOnExit
      >
        <div className={styles.modalWrapper}>
          <div className="modalContents">
            <h3 className="text-3xl font-bold">{props.data.title}</h3>
            <hr className="my-2" />
            <Image
              src={props.data.images.fixed_width.url}
              alt={props.data.title}
              width={props.data.images.fixed_width.width}
              height={props.data.images.fixed_width.height}
            />
            {!props.generateGifLoaded && <Loading />}
            <img
              id="preview"
              alt={'[Preview] ' + props.data.title}
              className={(props.generateGifLoaded ? 'visible' : 'invisible') + ' border'}
            />
            <hr className="my-2" />
            <button className={styles.closeButton} onClick={props.toggleModal}>
              Close
            </button>
            <button
              className={styles.downloadButton}
              onClick={downloadGif}
              disabled={!props.generateGifRendered}
            >
              Download
            </button>
          </div>
        </div>
      </CSSTransition>
    </div>
  );

  function downloadGif() {
    const preview = document.getElementById('preview') as HTMLImageElement;
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.download = 'LGTM.gif';
    a.href = preview.src;
    a.click();
    a.remove();
  }

  function closeModal() {
    setShowModal(false);
  }
};

export default Modal;
