import axios from "axios";
import { useEffect, useState } from "react";
import { RotatingTriangles } from "react-loader-spinner";

// API 設定
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function ProtectedRoute({ children }) {
  // 登入狀態管理(控制顯示登入或產品頁）
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

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

    //確認登入驗證
    const checkLogin = async () => {
      try {
        const res = await axios.post(`${API_BASE}/api/user/check`);
        console.log(res.data);
        setIsAuth(true);
      } catch (error) {
        console.error(error.response);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  if (loading) return <RotatingTriangles />;
  if (!isAuth) return <Navigate to="/login" />;

  return children;
}

export default ProtectedRoute;
