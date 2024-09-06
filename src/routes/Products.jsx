import { useEffect, useState } from 'react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [limit, setLimit] = useState(30);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filter, setFilter] = useState({ category: '', minPrice: 0, maxPrice: 1000 });

  async function getData() {
    const skip = (page - 1) * limit;
    const fetchUrl = `https://dummyjson.com/products?delay=0&limit=${limit}&skip=${skip}`;

    const data = await fetch(fetchUrl).then(res => res.json());
    setProducts(data.products);
    setTotal(data.total);
    applyFilters(data.products);
  }

  useEffect(() => {
    getData();
  }, [page]);

  useEffect(() => {
    applyFilters(products);
  }, [filter, products]);

  function applyFilters(products) {
    let filtered = products;

    if (filter.category) {
      filtered = filtered.filter(product => product.category === filter.category);
    }

    if (filter.minPrice) {
      filtered = filtered.filter(product => product.price >= filter.minPrice);
    }

    if (filter.maxPrice) {
      filtered = filtered.filter(product => product.price <= filter.maxPrice);
    }

    setFilteredProducts(filtered);
  }

  function handleFilterChange(newFilter) {
    setFilter(newFilter);
    setPage(1);
  }

  function changePage(pageNumber) {
    setPage(pageNumber);
  }

  const pageCount = Math.ceil(total / limit);

  function handlePrevPage(e) {
    e.preventDefault();
    if ((page - 1) > 0) {
      setPage(page - 1);
    }
  }

  function handleNextPage(e) {
    e.preventDefault();
    if ((page + 1) <= pageCount) {
      setPage(page + 1);
    }
  }

  function openModal(product) {
    setSelectedProduct(product);
  }

  function closeModal() {
    setSelectedProduct(null);
  }

  return (
    <>
      <div className="ProductsContainer">
        <div className="ProductsHeader">
          <Filter onFilterChange={handleFilterChange} />
        </div>
        <div className="productItems">
          {filteredProducts.map(product => (
            <div className="productItem" key={product.id} onClick={() => openModal(product)}>
              <h4>{product.title}</h4>
              <img src={product.thumbnail} alt={product.title} />
              <h6>{product.category}</h6>
              <h2>${product.price}</h2>
            </div>
          ))}
        </div>
      </div>

      {pageCount > 0 && (
        <ul className="ProductsPagination">
          <li><a href="#" onClick={handlePrevPage}>&lt;</a></li>
          {Array.from({ length: pageCount }, (v, i) => (i + 1)).map(x => (
            <li key={x}>
              <a href="#" className={page === x ? 'activePage' : ''} onClick={e => { e.preventDefault(); changePage(x);}}>
                {x}
              </a>
            </li>
          ))}
          <li><a href="#" onClick={handleNextPage}>&gt;</a></li>
        </ul>
      )}

      {selectedProduct && (
        <div className="ProductsmodalOverlay" onClick={closeModal}>
          <div className="ProductsmodalContent" onClick={e => e.stopPropagation()}>
            <button className="ProductsCloseButton" onClick={closeModal}>X</button>
            <h3>{selectedProduct.title}</h3>
            <div className="ProductsModalHero">
              <img src={selectedProduct.thumbnail} alt={selectedProduct.title} />
              <div className="ModalBoxes">
                <p className='ModalPrice'>${selectedProduct.price}</p>
                <p><strong>Rating:</strong> {selectedProduct.rating}</p>
                <p><strong>Brand:</strong> {selectedProduct.brand}</p>
                <p><strong>Stock:</strong> {selectedProduct.stock}</p>
                <p><strong>Category:</strong> {selectedProduct.category}</p>
              </div>
            </div>
            <p>{selectedProduct.description}</p>
            {selectedProduct.reviews && (
              <div className="reviews">
                {selectedProduct.reviews.map((review, index) => (
                  <div key={index} className="review">
                    <p><strong>{review.reviewerName}:</strong> {review.comment}</p>
                    <p className='raiting'>Rating: {review.rating}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Filter({ onFilterChange }) {
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleFilterChange = () => {
    onFilterChange({ category, minPrice, maxPrice });
  };

  return (
    <div className="Products-filter-container">
      <select value={category} onChange={(e) => setCategory(e.target.value)} onBlur={handleFilterChange}>
        <option value="">All Categories</option>
        <option value="beauty">Beauty</option>
        <option value="fragrances">Fragrances</option>
        <option value="furniture">Furniture</option>
        <option value="groceries">Groceries</option>
      </select>

      <input
        type="number"
        placeholder="Min Price"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        onBlur={handleFilterChange}
      />
      
      <input
        type="number"
        placeholder="Max Price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        onBlur={handleFilterChange}
      />

      <button onClick={handleFilterChange} className='filterBtn'>Apply Filters</button>
    </div>
  );
}