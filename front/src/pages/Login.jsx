import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Container from "../components/Container";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute } from "../api/api";

function Login() {
  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const [formState, setFormState] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleValidation = () => {
    const { username, password } = formState;
    if (username === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (handleValidation()) {
      const { data } = await axios.post(loginRoute, formState);
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      }
    }
  };

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, []);

  return (
    <Container>
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          type="text"
          name="username"
          placeholder="Username"
          handleChange={handleInputChange}
        />
        <InputField
          type="password"
          name="password"
          placeholder="Password"
          handleChange={handleInputChange}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Login
        </button>
        <span className="block text-center text-gray-600">
          Not register?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </span>
      </form>
      <ToastContainer />
    </Container>
  );
}

const InputField = ({ type, name, placeholder, handleChange }) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    onChange={handleChange}
    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
  />
);

export default Login;
