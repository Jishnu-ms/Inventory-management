import { useNavigate } from 'react-router-dom';

const ProductList = ({ products }) => {
  const navigate = useNavigate();

  const handleEdit = (index) => {
    navigate(`/edit-product/${index}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Product List</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product, index) => (
          <div key={index} className="border p-4 rounded shadow">
            <h4 className="font-semibold">{product.name}</h4>
            <p>Price: ₹{product.price}</p>
            <p>Stock: {product.quantity}</p>
            <button
              onClick={() => handleEdit(index)}
              className="mt-2 bg-yellow-600 text-white py-1 px-3 rounded hover:bg-yellow-700"
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;




