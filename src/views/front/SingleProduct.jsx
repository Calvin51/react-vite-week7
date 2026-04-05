import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

// API 設定
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function SingleProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState();

  useEffect(() => {
    const handleView = async (id) => {
      try {
        const response = await axios.get(
          `${API_BASE}/api/${API_PATH}/product/${id}`,
        );
        setProduct(response.data.product);
      } catch (error) {
        alert("錯誤", error);
      }
    };
    handleView(id);
  }, [id]);

  // 加入購物車
  const addCart = async (id, qty = 1) => {
    try {
      const data = {
        product_id: id,
        qty,
      };
      const response = await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {
        data,
      });
    } catch (error) {
      alert("錯誤", error);
    }
  };

  return !product ? (
    <h2>查無產品</h2>
  ) : (
    <>
      <div className="container mt-5">
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
              <small className="text-body-secondary">{product.unit}</small>
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => addCart(product.id)}
            >
              加入購物車
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SingleProduct;
