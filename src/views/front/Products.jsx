import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

// API 設定
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Products() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/api/${API_PATH}/products`,
        );

        setProducts(response.data.products);
      } catch (error) {
        alert("資料取得失敗", error);
      }
    };
    getProducts();
  }, []);

  const handleView = (id) => {
    navigate(`/product/${id}`);
  };
  return (
    <>
      <div className="container">
        <div className="row">
          {products.map((product) => (
            <div className="col-md-4" key={product.id}>
              <div className="card ">
                <img
                  src={product.imageUrl}
                  className="card-img-top"
                  alt={product.title}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text">
                    原價 : <del>{product.origin_price}</del>
                    {product.unit} 售價 :{product.price}
                    {product.unit}
                  </p>
                  <p className="card-text">
                    <small className="text-body-secondary">
                      {product.unit}
                    </small>
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleView(product.id)}
                  >
                    查看更多
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Products;
