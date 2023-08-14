import { useState, useEffect } from 'react';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import fetchGallery from 'services/api';
import Loader from './Loader/Loader';
import Button from './Button/Button';
import Modal from './Modal/Modal';
import { Notify } from 'notiflix';

const PER_PAGE = '12';

export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [query, setQuery] = useState('');
  const [pictures, setPictures] = useState([]);
  const [page, setPage] = useState(1);
  const [pictureId, setPictureId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetchGallery(query, page);
      if (response.length === 0) {
        Notify.failure('Sorry, no images for your request :(');
      } else {
        setPictures(prevPictures => [...prevPictures, ...response]);
      }
    } catch (error) {
      setIsError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (query && page > 0) {
      fetchData();
    }
  }, [query, page]);

  const handleSubmit = async e => {
    if (e) {
      e.preventDefault();
    }
    const inputValue = e.currentTarget.elements.query.value;
    if (inputValue === '') {
      Notify.failure('Please type something!');
      setIsLoading(false);
      return;
    }
    if (inputValue !== query) {
      setIsLoading(true);
      setPictures([]);
      setQuery(inputValue);
      setPage(1);
    }
  };

  const addMorePages = async () => {
    setPage(prevPage => prevPage + 1);
    setIsLoading(true);
  };

  const toggleModal = id => {
    setPictureId(id);
    setShowModal(prevState => !prevState);

    if (!showModal) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'grid',
        alignContent: 'start',
        gridTemplateColumns: '1fr',
        gridGap: 16,
        paddingBottom: 24,
        fontSize: 40,
        color: '#010101',
      }}
    >
      <Searchbar onSubmit={handleSubmit} />

      <ImageGallery pictures={pictures} toggleModal={toggleModal} />
      {isLoading && <Loader />}
      {pictures.length >= PER_PAGE && pictures.length % PER_PAGE === 0 && (
        <Button onClick={addMorePages} />
      )}
      {showModal && (
        <Modal
          pictures={pictures}
          id={pictureId}
          onClose={toggleModal}
          showModal={showModal}
        />
      )}
    </div>
  );
}
