import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Container from "../components/Container";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import {registerRoute} from "../api/api";

function Register() {
    const navigate = useNavigate();
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };
    const [formState, setFormState] = useState({
        username: '',
        password: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState({ ...formState, [name]: value });
    };

    const handleValidation = () => {
        const { password, username } = formState;
        if (username.length < 3) {
            toast.error(
                "Username should be greater than 3 characters.",
                toastOptions
            );
            return false;
        } else if (password.length < 4) {
            toast.error(
                "Password should be equal or greater than 4 characters.",
                toastOptions
            );
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formState);

        if (handleValidation()) {
            // const {password, username} = formState;
            const {data} = await axios.post(registerRoute,formState)
            if (data.status === false) {
                toast.error(data.msg, toastOptions);
            }
            if (data.status === true) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );
                navigate("/");
            }
        }
    };

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
                <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                    Create User
                </button>
                <span className="block text-center text-gray-600">
                    Have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
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

export default Register;