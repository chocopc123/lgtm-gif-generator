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
        <div className={styles.modalBackground} onClick={() => setShowModal(false)} />
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
            <div className="relative">
              <div className={styles.gifPreview}>
                {!generateGifLoaded && (
                  <Image
                    src={props.data.images.downsized.url}
                    alt={props.data.title}
                    width={props.data.images.downsized.width}
                    height={props.data.images.downsized.height}
                  />
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  id="preview"
                  alt={'[Preview] ' + props.data.title}
                  className={generateGifLoaded ? '' : 'hidden'}
                  width={props.data.images.downsized.width}
                  height={props.data.images.downsized.height}
                />
              </div>
              <div className={styles.gifGenerateLoading}>{!generateGifLoaded && <Loading />}</div>
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
      xhr.open('GET', props.data.images.original.url, true);
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

  function drawText(image: ImageData, i: number) {
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    canvas.height = image.height;
    canvas.width = image.width;
    const context = canvas.getContext('2d');
    const halfWidth = Math.floor(image.width / 2);
    const halfHeight = Math.floor(image.height / 2);
    const isLandscape = image.width / 4 > image.height / 3;
    let acronymFontSize;
    if (isLandscape) acronymFontSize = Math.floor(image.height / 3);
    else acronymFontSize = Math.floor(image.width / 5);
    var originalMeaningFontSize = Math.floor(acronymFontSize / 4);
    var lineSpacing = Math.floor(acronymFontSize / 5) * 3;

    context?.putImageData(image, 0, 0);
    context!.textAlign = 'center';
    context!.textBaseline = 'middle';
    context!.fillStyle = 'white';
    context!.font = `${acronymFontSize}px Impact`;
    context?.fillText('L G T M', halfWidth, halfHeight);
    context!.font = `${originalMeaningFontSize}px sans-serif`;
    context?.fillText('Looks Good To Me', halfWidth, halfHeight + lineSpacing);
    return canvas;
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
};

export default Modal;
