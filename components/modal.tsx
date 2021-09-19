import React from 'react';
import styles from '../styles/Modal.module.css';

type Props = {
  name: string;
  data: any;
  toggleModal: any;
};

export default class Modal extends React.Component<Props> {
  constructor(props: any) {
    super(props);
    console.log(this.props.toggleModal);
  }
  render() {
    return (
      <div className="modal-wrap">
        <div className={styles.modalArea}>
          <div className={styles.modalBackground} />
          <div className={styles.modalWrapper}>
            <div className="modalContents">
              <h3 className="text-3xl font-bold">Gif</h3>
              <hr className="my-2" />
              <p>楽しいgif</p>
              <hr className="my-2" />
              <button className={styles.button} onClick={this.props.toggleModal}>
                Close modal
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
