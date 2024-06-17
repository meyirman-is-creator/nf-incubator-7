import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);

  useEffect(() => {
    fetchProperties();
  }, [page]);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/items?page=${page}&limit=${limit}`);
      setProperties(response.data.results);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const nextPage = () => {
    if (page < Math.ceil(total / limit)) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Real Estate Listings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((property, index) => (
          <div key={index} className="border p-4 rounded shadow">
            {property.image && (
              <img src={property.image} alt={property.title} className="w-full h-48 object-cover mb-4" />
            )}
            <h2 className="text-xl font-semibold">{property.title}</h2>
            <p>{property.locationDate}</p>
            <p>{property.postedDate}</p>
            <a href={property.postLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Listing</a>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={prevPage}
          disabled={page === 1}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page} of {Math.ceil(total / limit)}</span>
        <button
          onClick={nextPage}
          disabled={page === Math.ceil(total / limit)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default App;
