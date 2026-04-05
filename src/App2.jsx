import { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as bootstrap from "bootstrap";
import "./assets/style.css";
import ProductModal from "./components/ProductModal";
import Pagination from "./components/Pagination";
import Login from "./views/Login";

// API 設定
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

// 宣告初始化表單資料模板
const INITIAL_TEMPLATE_DATA = {
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [],
};

function App() {
  // 登入狀態管理(控制顯示登入或產品頁）
  const [isAuth, setIsAuth] = useState(false);

  //產品資料
  const [products, setProducts] = useState([]);
  //表單資料
  const [templateProduct, setTemplateProduct] = useState(INITIAL_TEMPLATE_DATA);
  //表單狀態管理
  const [modalType, setModalType] = useState("");
  //頁面設定用
  const [pagination, setPagination] = useState({});

  //綁定Modal用
  const productModalRef = useRef(null);

  //取得產品資料
  const getProducts = async (page = 1) => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products?page=${page}`,
      );
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    // 讀取 Cookie 檢查登入狀態
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];
    if (token) {
      //確定有取得token才設定
      // 修改實體建立時所指派的預設配置
      axios.defaults.headers.common["Authorization"] = token;
    }

    //初始化 Bootstrap Modal
    productModalRef.current = new bootstrap.Modal("#productModal", {
      keyboard: false, //禁用 Esc 鍵關閉模態框，通常用於需要強制使用者完成操作的情境
    });

    // Modal 關閉時移除焦點
    //監聽 hide.bs.modal 並移除焦點，可以確保關閉後的狀態是乾淨的，避免潛在的問題
    document
      .querySelector("#productModal")
      .addEventListener("hide.bs.modal", () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });

    //確認登入驗證
    const checkLogin = async () => {
      try {
        const res = await axios.post(`${API_BASE}/api/user/check`);
        // console.log(res.data);
        setIsAuth(true);
        getProducts();
      } catch (error) {
        console.error(error.response);
      }
    };

    checkLogin();
  }, []);

  // Open Modal函式
  const openModal = (type, product) => {
    // console.log(product);
    setModalType(type);
    setTemplateProduct((pre) => ({
      ...pre,
      ...product,
    }));
    productModalRef.current.show();
  };
  // close Modal函式
  const closeModal = () => {
    productModalRef.current.hide();
  };

  return (
    <>
      {!isAuth ? (
        <Login getProducts={getProducts} setIsAuth={setIsAuth} />
      ) : (
        <div className="container">
          <h2>產品列表</h2>
          {/* 新增產品按鈕 */}
          <div className="text-end mt-4">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => openModal("create", INITIAL_TEMPLATE_DATA)}
            >
              建立新的產品
            </button>
          </div>
          {/* 產品列表 */}
          <table className="table">
            <thead>
              <tr>
                <th scope="col">分類</th>
                <th scope="col">產品名稱</th>
                <th scope="col">原價</th>
                <th scope="col">售價</th>
                <th scope="col">是否啟用</th>
                <th scope="col">編輯</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.category}</td>
                  <th scope="row">{product.title}</th>
                  <td>{product.origin_price}</td>
                  <td>{product.price}</td>
                  <td className={`${product.is_enabled && "text-success"} `}>
                    {product.is_enabled ? "啟用" : "未啟用"}
                  </td>
                  <td>
                    <div
                      className="btn-group"
                      role="group"
                      aria-label="Basic example"
                    >
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => openModal("edit", product)}
                      >
                        編輯
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => openModal("delete", product)}
                      >
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination pagination={pagination} onChangePage={getProducts} />
        </div>
      )}

      <ProductModal
        modalType={modalType}
        templateProduct={templateProduct}
        getProducts={getProducts}
        closeModal={closeModal}
      />
    </>
  );
}

export default App;
