import styles from '../styles/Generator.module.css';
import Image from 'next/image';

export default function Gif({ gif }: { gif: any }) {
  return (
    <div className={styles.card} onClick={() => showModal(gif)}>
      <Image
        src={gif.images.fixed_width.url}
        alt={gif.title}
        width={gif.images.fixed_width.width}
        height={gif.images.fixed_width.height}
      />
    </div>
  );
}

async function showModal(gif: any) {
  console.log(gif.title);
}
