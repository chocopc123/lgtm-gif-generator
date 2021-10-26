import React, { useState } from 'react';
import styles from '../styles/Gif.module.css';
import Image from 'next/image';
import Modal from '../components/modal';
import { CSSTransition } from 'react-transition-group';
const { GifReader } = require('omggif');
const GIF = require('gif.js');

type Props = { gif: any };

const Gif = (props: Props) => {
  const [gifLoaded, setGifLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [generateGifLoaded, setGenerateGifLoaded] = useState(false);
  const [generateGifRendered, setGenerateGifRendered] = useState(false);

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
          onClick={() => generateGif()}
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
          toggleModal={() => toggleModal()}
          generateGifLoaded={generateGifLoaded}
          generateGifRendered={generateGifRendered}
          showModal={showModal}
        />
      )}
    </>
  );

  async function generateGif() {
    toggleModal();
    const i8ary = await getGifBinary();
    const imageArray = createImageArray(i8ary);
    renderLgtmGif(imageArray);
  }

  function toggleModal() {
    setShowModal(!showModal);
    setGenerateGifLoaded(false);
    setGenerateGifRendered(false);
  }

  async function getGifBinary() {
    return new Promise<any>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', props.gif.images.fixed_width.url, true);
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
      preview.src = URL.createObjectURL(blob);
      setGenerateGifRendered(true);
      preview.addEventListener('load', (e) => {
        setGenerateGifLoaded(true);
      });
    });
    gif.render();
  }
};

export default Gif;
