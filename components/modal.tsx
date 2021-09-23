import React from 'react';
import styles from '../styles/Modal.module.css';
import Image from 'next/image';
import Loading from '../components/loading';

type Props = {
  name: string;
  data: any;
  toggleModal: any;
  visibility: string;
};

export default class Modal extends React.Component<Props> {
  constructor(props: any) {
    super(props);
  }
  render() {
    return (
      <div className="modal-wrap">
        <div className={styles.modalArea}>
          <div className={styles.modalBackground} onClick={this.props.toggleModal} />
          <div className={styles.modalWrapper}>
            <div className="modalContents">
              <h3 className="text-3xl font-bold">{this.props.data.title}</h3>
              <hr className="my-2" />
              <Image
                src={this.props.data.images.fixed_width.url}
                alt={this.props.data.title}
                width={this.props.data.images.fixed_width.width}
                height={this.props.data.images.fixed_width.height}
              />
              {this.props.visibility === 'invisible' && <Loading />}
              <img id="preview" className={this.props.visibility + ' border'} />
              <hr className="my-2" />
              <button className={styles.closeButton} onClick={this.props.toggleModal}>
                Close
              </button>
              <button className={styles.downloadButton} onClick={this.downloadGif}>
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  downloadGif() {
    const preview = document.getElementById('preview') as HTMLImageElement;
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.download = 'LGTM.gif';
    a.href = preview.src;
    a.click();
    a.remove();
  }
}
