import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

// API 設定
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Login({ getProducts, setIsAuth }) {
  // 表單資料狀態(儲存登入表單輸入)
  // const [formData, setFormData] = useState({
  //   username: "",
  //   password: "",
  // });

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // 登入表單輸入處理
  // const eventHandler = (e) => {
  //   const { value, name } = e.target;
  //   setFormData((prevData) => ({
  //     ...prevData, // 保留原有屬性
  //     [name]: value, // 更新特定屬性
  //   }));
  //   // console.log(name, value);
  // };

  //串接登入Api
  const onSubmit = async (formData) => {
    try {
      // e.preventDefault(); //避免預設事件 使用react hook form不需要設定
      const res = await axios.post(`${API_BASE}/admin/signin`, formData);
      alert(res.data.message);
      const { token, expired } = res.data;
      // 設定 Cookie
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
      // 修改實體建立時所指派的預設配置
      axios.defaults.headers.common["Authorization"] = token;

      navigate("/admin/product");
      // //取得產品資料
      // getProducts();
      // //設定登入狀態
      // setIsAuth(true);
    } catch (error) {
      //設定登入狀態
      // setIsAuth(false);
      alert("登入失敗", error.response);
    }
  };

  return (
    <div className="container login">
      <h1>會員登入</h1>
      <form className="form-floating" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-floating mb-3">
          <input
            type="email"
            className="form-control"
            id="username"
            name="username"
            placeholder="name@example.com"
            {...register("username", {
              required: "請輸入Email",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Email 格式不正確",
              },
            })}
            // onChange={(e) => eventHandler(e)}
          />
          <label htmlFor="username">Email address</label>
          {errors.username && (
            <p className="text-danger">{errors.username.message}</p>
          )}
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            placeholder="Password"
            {...register("password", {
              required: "請輸入密碼",
              minLength: {
                value: 8,
                message: "密碼不少於8位數",
              },
            })}
            // onChange={(e) => eventHandler(e)}
          />
          <label htmlFor="password">Password</label>
          {errors.password && (
            <p className="text-danger">{errors.password.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="btn btn-primary w-100 mt-2"
          disabled={!isValid}
        >
          登入
        </button>
      </form>
    </div>
  );
}

export default Login;
