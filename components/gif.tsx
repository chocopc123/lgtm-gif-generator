import React from 'react';
import styles from '../styles/Generator.module.css';
import Image from 'next/image';
import Modal from '../components/modal';

type Props = { gif: any };
type State = {
  name: string;
  showModal: boolean;
};

export default class Gif extends React.Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      name: 'modalArea',
      showModal: false,
    };
  }

  render() {
    return (
      <div>
        <div className={styles.card} onClick={() => this.toggleModal()}>
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
          />
        )}
      </div>
    );
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }
}
