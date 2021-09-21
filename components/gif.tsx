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
          <Modal
            name={this.state.name}
            data={this.props.gif}
            toggleModal={() => this.toggleModal()}
            visibility={this.state.visibility}
          />
        )}
      </div>
    );
  }

  async generateGif() {
    this.toggleModal();
    const i8ary = await this.getGifBinary();
    const imageArray = this.createImageArray(i8ary);
    console.log(imageArray);
    this.drawText(imageArray);
    this.setState({ visibility: 'visible' });
  }

  toggleModal() {
    this.setState({ visibility: 'invisible' });
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

  drawText(imageArray: Array<ImageData>) {
    const canvas = document.getElementById('test_canvas') as HTMLCanvasElement;
    const width = imageArray[0].width;
    const height = imageArray[0].height;
    const testContext = canvas.getContext('2d');
    testContext?.putImageData(imageArray[0], 0, 0);
    testContext!.textAlign = 'center';
    testContext!.textBaseline = 'middle';
    testContext!.fillStyle = 'white';
    testContext!.font = '40px Impact';
    testContext?.fillText('L G T M', width / 2, height / 2);
    testContext!.font = '10px sans-serif';
    testContext?.fillText('Looks Good To Me', width / 2, height / 2 + 25);
  }
}
