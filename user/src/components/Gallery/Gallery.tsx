import { useEffect } from 'react';
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { FaEye } from 'react-icons/fa';
import './Gallery.css';
import PageBanner from '../PageBanner/PageBanner';

// Import images (adjust paths as needed)
import gal1 from '../../assets/gallery/gal1.jpg';
import gal2 from '../../assets/gallery/gal2.jpg';
import gal3 from '../../assets/gallery/gal3.jpg';
import gal4 from '../../assets/gallery/gal4.jpg';
import gal5 from '../../assets/gallery/gal5.jpg';
import gal6 from '../../assets/gallery/gal6.jpg';
import gal7 from '../../assets/gallery/gal7.jpg';

const Gallery = () => {
  useEffect(() => {
    // Initialize Fancybox
    Fancybox.bind('[data-fancybox="gallery"]', {
      Thumbs: {
        autoStart: true,
      },
      Toolbar: {
        display: ["close"],
      },
    } as any);

    // Cleanup on unmount
    return () => {
      Fancybox.destroy();
    };
  }, []);

  const galleryItems = [
    { src: gal1, size: 'large' },
    { src: gal2, size: 'small' },
    { src: gal3, size: 'small' },
    { src: gal4, size: 'small' },
    { src: gal5, size: 'small' },
    { src: gal6, size: 'small' },
    { src: gal7, size: 'large' },
  ];

  return (
    <>
      <PageBanner title="Gallery" />
    <section className="project-sec2 project-masionary py-5">
      <div className="container">
        <div className="row gallery-grid" id="gallery-container">
          {galleryItems.map((item, index) => (
            <div 
              key={index} 
              className={`${item.size === 'large' ? 'col-lg-8' : 'col-lg-4'} mb-4`}
            >
              <div className="gallery-item">
                <figure className="gallery-img">
                  <img src={item.src} alt={`Gallery ${index + 1}`} />
                </figure>
                <div className="gallery-hover">
                  <a href={item.src} data-fancybox="gallery">
                    <FaEye />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    </>
  );
};

export default Gallery;