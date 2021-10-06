import React from 'react';
import styles from '../styles/Modal.module.css';
import Image from 'next/image';
import Loading from '../components/loading';
import { CSSTransition } from 'react-transition-group';

type Props = {
  name: string;
  data: any;
  toggleModal: any;
  generateGifLoaded: boolean;
  generateGifRendered: boolean;
  showModal: boolean;
};

type State = {
  showModal: boolean;
};

export default class Modal extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      showModal: this.props.showModal,
    };
  }
  render() {
    return (
      <div className={styles.modalArea}>
        <CSSTransition
          in={this.state.showModal}
          appear={true}
          timeout={500}
          classNames={{
            appear: styles.modalBackgroundEnter,
            appearActive: styles.modalBackgroundEnterActive,
            exit: styles.modalBackgroundExit,
            exitActive: styles.modalBackgroundExitActive,
          }}
          unmountOnExit
          onExited={this.props.toggleModal}
        >
          <div className={styles.modalBackground} onClick={() => this.closeModal()} />
        </CSSTransition>
        <CSSTransition
          in={this.state.showModal}
          appear={true}
          timeout={400}
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
              <h3 className="text-3xl font-bold">{this.props.data.title}</h3>
              <hr className="my-2" />
              <Image
                src={this.props.data.images.fixed_width.url}
                alt={this.props.data.title}
                width={this.props.data.images.fixed_width.width}
                height={this.props.data.images.fixed_width.height}
              />
              {!this.props.generateGifLoaded && <Loading />}
              <img
                id="preview"
                alt={'[Preview] ' + this.props.data.title}
                className={(this.props.generateGifLoaded ? 'visible' : 'invisible') + ' border'}
              />
              <hr className="my-2" />
              <button className={styles.closeButton} onClick={this.props.toggleModal}>
                Close
              </button>
              <button
                className={styles.downloadButton}
                onClick={this.downloadGif}
                disabled={!this.props.generateGifRendered}
              >
                Download
              </button>
            </div>
          </div>
        </CSSTransition>
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

  closeModal() {
    this.setState({ showModal: false });
  }
}
