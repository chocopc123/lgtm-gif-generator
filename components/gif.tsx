import React from 'react';
import styles from '../styles/Generator.module.css';
import Image from 'next/image';
import Modal from '../components/modal';
const { GifReader } = require('omggif');

type Props = { gif: any };
type State = {
  name: string;
  showModal: boolean;
  visibility: string;
};

export default class Gif extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      name: 'modalArea',
      showModal: false,
      visibility: 'invisible',
    };
  }

  render() {
    return (
      <div>
        <div className={styles.card} onClick={() => this.generateGif()}>
          <Image
            src={this.props.gif.images.fixed_width.url}
            alt={this.props.gif.title}
            width={this.props.gif.images.fixed_width.width}
            height={this.props.gif.images.fixed_width.height}
          />
        </div>
        {this.state.showModal && (
          <div className={this.state.visibility}>
            <Modal
              name={this.state.name}
              data={this.props.gif}
              toggleModal={() => this.toggleModal()}
            />
          </div>
        )}
      </div>
    );
  }

  async generateGif() {
    this.toggleModal();
    const i8ary = await this.getGifBinary();
    const imageArray = this.createImageArray(i8ary);
    console.log(imageArray);
    this.showImage(imageArray);
    this.setState({ visibility: 'visible' });
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  async getGifBinary() {
    return new Promise<any>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', this.props.gif.images.fixed_width.url, true);
      console.log(this.props.gif.images.original.frames + 'frames');
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
    const array = new Array(reader.numFrames()).fill(0).map((_, k) => {
      const image = new ImageData(reader.width, reader.height);
      reader.decodeAndBlitFrameRGBA(k, image.data as any);
      return image;
    });
    return array;
  }

  showImage(imageArray: Array<ImageData>) {
    const canvas = document.getElementById('test_canvas') as HTMLCanvasElement;
    const testContext = canvas.getContext('2d');
    testContext?.putImageData(imageArray[0], 0, 0);
  }
}
