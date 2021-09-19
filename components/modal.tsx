import React from 'react';
import styles from '../styles/Modal.module.css';
import Image from 'next/image';

type Props = {
  name: string;
  data: any;
  toggleModal: any;
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
              <hr className="my-2" />
              <button className={styles.button} onClick={this.props.toggleModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
