import axios from "axios";
import { useEffect, useState } from "react";
import { currency } from "../../utils/filter";

// API 設定
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Cart() {
  const [cart, setCart] = useState([]);

  // 取得購物車資料
  useEffect(() => {
    const getCart = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
        setCart(response.data.data);
      } catch (error) {
        alert("資料取得錯誤", error);
      }
    };
    getCart();
  }, []);

  // 更新商品數量
  const updateCart = async (cartId, productId, qty = 1) => {
    try {
      const data = {
        product_id: productId,
        qty,
      };
      const response = await axios.put(
        `${API_BASE}/api/${API_PATH}/cart/${cartId}`,
        { data },
      );

      // 畫面刷新 購物車內容刷新
      const response2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCart(response2.data.data);
    } catch (error) {
      alert("更新失敗", error.response);
    }
  };

  // 移除單一商品
  const deleteCart = async (cartId) => {
    try {
      const response = await axios.delete(
        `${API_BASE}/api/${API_PATH}/cart/${cartId}`,
      );

      // 畫面刷新 購物車內容刷新
      const response2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCart(response2.data.data);
    } catch (error) {
      alert("移除商品失敗", error.response);
    }
  };

  // 清空購物車
  const deleteCartAll = async () => {
    try {
      const url = `${API_BASE}/api/${API_PATH}/carts`;
      await axios.delete(url);

      // 畫面刷新 購物車內容刷新
      const response2 = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCart(response2.data.data);
    } catch (error) {
      alert("清空購物車失敗", error.response);
    }
  };

  return (
    <>
      <div className="container">
        <h2>購物車列表</h2>
        <div className="text-end mt-4">
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={() => deleteCartAll()}
          >
            清空購物車
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">品名</th>
              <th scope="col">數量/單位</th>
              <th scope="col">小計</th>
            </tr>
          </thead>
          <tbody>
            {
              // 有可能是空的所以加上可選參數
              cart?.carts?.map((cartItem) => (
                <tr key={cartItem.id}>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => deleteCart(cartItem.id)}
                    >
                      刪除
                    </button>
                  </td>
                  <th scope="row">{cartItem.product.title}</th>
                  <td>
                    <div className="input-group input-group-sm mb-3">
                      <input
                        type="number"
                        className="form-control"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-sm"
                        defaultValue={cartItem.qty}
                        onChange={(e) =>
                          updateCart(
                            cartItem.id,
                            cartItem.product_id,
                            Number(e.target.value),
                          )
                        }
                      />
                      <span
                        className="input-group-text"
                        id="inputGroup-sizing-sm"
                      >
                        {cartItem.product.unit}
                      </span>
                    </div>
                  </td>
                  <td className="text-end">{currency(cartItem.final_total)}</td>
                </tr>
              ))
            }
          </tbody>
          <tfoot>
            <tr>
              <td className="text-end" colSpan="3">
                總計
              </td>
              <td className="text-end">{currency(cart.final_total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}

export default Cart;
