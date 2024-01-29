import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [numericColumn, setNumericColumn] = useState('someNumericValue');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('https://dummyjson.com/products')
      .then((response) => response.json())
      .then((data) => {
        setData(data.products);
      });
  }, []);

  console.log(data);

  const handleCheckboxChange = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleNumericColumnChange = (event) => {
    setNumericColumn(event.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  // Filter and paginate data
  const filteredData = data
    .filter((row) => row.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const pageCount = Math.ceil(data.length / itemsPerPage);

  // Calculate the values for the bar chart
  const chartData = {
    x: filteredData.map((row) => row.title),
    y: filteredData.map((row) => row.price),
    type: 'bar',
  };

  return (
    <div className="container mt-3 mb-3">
      <h1 className="text-center">Data Table and Bar Chart</h1>
      <div className="d-flex justify-content-center gap-3">
        <label htmlFor="numericColumn">Search Name:</label>
        {/* <select
          id="numericColumn"
          onChange={handleNumericColumnChange}
          value={numericColumn} 
        >
          <option value="price">Price</option>
          <option value="name">Name</option>
          <option value="stock">Stock</option>
          <option value="rating">Rating</option>
          
        </select> */}
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="table-responsive mt-3">
        <table className="table table-bordered data-table">
          <thead>
            <tr>
              <th>Checkbox</th>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr key={row.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row.id)}
                    onChange={() => handleCheckboxChange(row.id)}
                  />
                </td>
                <td>{row.id}</td>
                <td>{row.title}</td>
                <td>{row.price}</td>
                <td>{row.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-center">
        <div className="pagination">
          {Array.from({ length: pageCount }).map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={currentPage === index + 1 ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="bar-chart mt-4 text-center">
        <h2>Bar Chart</h2>
        <Plot
          data={[chartData]}
          layout={{ width: 600, height: 400, title: 'Bar Chart' }}
        />
      </div>
    </div>
  );
}

export default App;
