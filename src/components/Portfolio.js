import React, { useState } from 'react';
import './Portfolio.css';
import { portfolioData, categories } from '../data/portfolioData';

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredPortfolio = selectedCategory === 'all'
    ? portfolioData
    : portfolioData.filter(item => item.category === selectedCategory);

  const openModal = (item) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <section id="portfolio" className="portfolio-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Portfolio</h2>
          <p className="section-subtitle">Explore my work across different categories</p>
        </div>

        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="portfolio-grid">
          {filteredPortfolio.map((item) => (
            <div
              key={item.id}
              className="portfolio-item"
              onClick={() => openModal(item)}
            >
              <div className="portfolio-image">
                <img src={item.image} alt={item.title} loading="lazy" />
                <div className="portfolio-overlay">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPortfolio.length === 0 && (
          <div className="no-results">
            <p>No items found in this category.</p>
          </div>
        )}
      </div>

      {selectedItem && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>&times;</button>
            <img src={selectedItem.image} alt={selectedItem.title} />
            <div className="modal-info">
              <h3>{selectedItem.title}</h3>
              <p className="modal-category">{selectedItem.category}</p>
              <p className="modal-description">{selectedItem.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Portfolio;
