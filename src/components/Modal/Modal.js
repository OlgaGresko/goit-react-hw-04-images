import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import css from './Modal.module.css';

const modalRoot = document.querySelector('#modal-root');

export default function Modal({ pictures, id, onClose, showModal }) {
  const [pictureLink, setPictureLink] = useState(null);
  const [pictureAlt, setPictureAlt] = useState('');

  useEffect(() => {
    const foundPicture = pictures.find(picture => picture.id === id);
    if (foundPicture) {
      setPictureLink(foundPicture.largeImageURL);
      setPictureAlt(foundPicture.tags);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleKeyDown = e => {
    if (e.code === 'Escape') {
      onClose();
    }
  };

  const handleModalClick = e => {
    const backdrop = document.querySelector('#backdrop');
    if (e.target === backdrop) {
      onClose();
    }
  };

  return createPortal(
    <div id="backdrop" className={css.overlay} onClick={handleModalClick}>
      <div id="modal" className={css.modal}>
        {pictureLink && <img src={pictureLink} alt={pictureAlt} />}
      </div>
    </div>,
    modalRoot
  );
}
