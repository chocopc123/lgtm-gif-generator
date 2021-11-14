import React, { useState, useEffect } from 'react';
import styles from '../styles/Modal.module.css';
import Image from 'next/image';
import Loading from '../components/loading';
import { CSSTransition } from 'react-transition-group';
const { GifReader } = require('omggif');
const GIF = require('gif.js');

type Props = {
  data: any;
  toggleModal: any;
  showModal: boolean;
};

const Modal = (props: Props) => {
  const [showModal, setShowModal] = useState(props.showModal);
  const [generateGifLoaded, setGenerateGifLoaded] = useState(false);
  const [generateGifRendered, setGenerateGifRendered] = useState(false);
  let unmounted: boolean = false;
  useEffect(() => {
    const f = async () => {
      const i8ary = await getGifBinary();
      const imageArray = createImageArray(i8ary);
      renderLgtmGif(imageArray);
    };
    f();
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      unmounted = true;
    };
  }, []);
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
            <div className="flex justify-around">
              {!generateGifLoaded && (
                <Image
                  src={props.data.images.fixed_width.url}
                  alt={props.data.title}
                  width={props.data.images.fixed_width.width}
                  height={props.data.images.fixed_width.height}
                />
              )}
              {/* {!generateGifLoaded && <Loading />} */}
              <img
                id="preview"
                alt={'[Preview] ' + props.data.title}
                className={generateGifLoaded ? '' : 'hidden'}
                width={props.data.images.fixed_width.width}
                height={props.data.images.fixed_width.height}
              />
            </div>
            <hr className="my-2" />
            <button className={styles.closeButton} onClick={props.toggleModal}>
              Close
            </button>
            <button
              className={styles.downloadButton}
              onClick={downloadGif}
              disabled={!generateGifRendered}
            >
              Download
            </button>
          </div>
        </div>
      </CSSTransition>
    </div>
  );

  async function getGifBinary() {
    return new Promise<any>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', props.data.images.fixed_width.url, true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = function (e) {
        const arrayBuffer = this.response;
        if (arrayBuffer) {
          const binary = new Uint8Array(arrayBuffer);
          resolve(binary);
        }
        reject('error');
      };
      xhr.send();
    });
  }

  function createImageArray(binary: Uint8Array) {
    const reader = new GifReader(binary);
    const array = new Array(reader.numFrames()).fill(0);
    array.forEach((_, currentFrame) => {
      const previousFlame = currentFrame - 1;
      const frameInfo = reader.frameInfo(currentFrame);
      const image = new ImageData(reader.width, reader.height);
      if (currentFrame >= 1 && frameInfo.disposal < 2) {
        image.data.set(new Uint8ClampedArray(array[previousFlame].data.data));
      }
      array[currentFrame] = {
        data: image,
        delay: reader.frameInfo(currentFrame).delay * 10,
      };
      reader.decodeAndBlitFrameRGBA(currentFrame, image.data);
    });
    return array;
  }

  function drawText(image: ImageData, i: number) {
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    canvas.height = image.height;
    canvas.width = image.width;
    const context = canvas.getContext('2d');

    context?.putImageData(image, 0, 0);
    context!.textAlign = 'center';
    context!.textBaseline = 'middle';
    context!.fillStyle = 'white';
    context!.font = '40px Impact';
    context?.fillText('L G T M', image.width / 2, image.height / 2);
    context!.font = '10px sans-serif';
    context?.fillText('Looks Good To Me', image.width / 2, image.height / 2 + 25);
    return canvas;
  }

  function renderLgtmGif(imageArray: Array<any>) {
    const gif = new GIF({
      workers: 2,
      workerScript: '/api/gif.js/gif.worker',
      quality: 10,
      width: imageArray[0].data.width,
      height: imageArray[0].data.height,
    });
    imageArray.forEach((image, i) => {
      const canvasElement = drawText(image.data, i);
      gif.addFrame(canvasElement, { delay: image.delay });
    });
    gif.on('finished', function (blob: any) {
      const preview = document.getElementById('preview') as HTMLImageElement;
      if (!unmounted) {
        preview.src = URL.createObjectURL(blob);
        setGenerateGifRendered(true);
        preview.addEventListener('load', (e) => {
          setGenerateGifLoaded(true);
        });
      }
    });
    gif.render();
  }

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
