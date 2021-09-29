import React from 'react';
import styles from '../styles/Gif.module.css';
import Image from 'next/image';
import Modal from '../components/modal';
import { CSSTransition } from 'react-transition-group';
const { GifReader } = require('omggif');
const GIF = require('gif.js');

type Props = { gif: any };
type State = {
  name: string;
  gifLoaded: boolean;
  showModal: boolean;
  generateGifLoaded: boolean;
  generateGifRendered: boolean;
};

export default class Gif extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      name: 'modalArea',
      gifLoaded: false,
      showModal: false,
      generateGifLoaded: false,
      generateGifRendered: false,
    };
  }

  render() {
    return (
      <>
        <CSSTransition
          in={this.state.gifLoaded}
          timeout={300}
          classNames={{
            enter: styles.modalEnter,
            enterActive: styles.modalEnterActive,
          }}
        >
          <div
            className={styles.card + ' ' + (this.state.gifLoaded ? 'visible' : 'invisible')}
            onClick={() => this.generateGif()}
          >
            <Image
              src={this.props.gif.images.fixed_width.url}
              alt={this.props.gif.title}
              width={this.props.gif.images.fixed_width.width}
              height={this.props.gif.images.fixed_width.height}
              onLoadingComplete={() => this.setState({ gifLoaded: true })}
            />
          </div>
        </CSSTransition>
        {this.state.showModal && (
          <Modal
            name={this.state.name}
            data={this.props.gif}
            toggleModal={() => this.toggleModal()}
            generateGifLoaded={this.state.generateGifLoaded}
            generateGifRendered={this.state.generateGifRendered}
            showModal={this.state.showModal}
          />
        )}
      </>
    );
  }

  async generateGif() {
    this.toggleModal();
    const i8ary = await this.getGifBinary();
    const imageArray = this.createImageArray(i8ary);
    this.renderLgtmGif(imageArray);
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
    this.setState({ generateGifLoaded: false });
    this.setState({ generateGifRendered: false });
  }

  async getGifBinary() {
    return new Promise<any>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', this.props.gif.images.fixed_width.url, true);
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

  createImageArray(binary: Uint8Array) {
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

  drawText(image: ImageData, i: number) {
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

  renderLgtmGif(imageArray: Array<any>) {
    const gif = new GIF({
      workers: 2,
      workerScript: '/api/gif.js/gif.worker',
      quality: 10,
      width: imageArray[0].data.width,
      height: imageArray[0].data.height,
    });
    imageArray.forEach((image, i) => {
      const canvasElement = this.drawText(image.data, i);
      gif.addFrame(canvasElement, { delay: image.delay });
    });
    const self = this;
    gif.on('finished', function (blob: any) {
      const preview = document.getElementById('preview') as HTMLImageElement;
      preview.src = URL.createObjectURL(blob);
      self.setState({ generateGifRendered: true });
      preview.addEventListener('load', (e) => {
        self.setState({ generateGifLoaded: true });
      });
    });
    gif.render();
  }
}
