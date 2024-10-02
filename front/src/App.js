import {BrowserRouter, Route, Routes} from "react-router-dom";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import './index.css';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'


function App() {
  return (<>
    <BrowserRouter>
      <Routes>
        <Route exact path="/register" element={<Register/>}  />
        <Route path="/" element={<Chat/>} />
        <Route path="/login" element={<Login/>}  />
      </Routes>
    </BrowserRouter>
        <ToastContainer
            position="top-right"
            autoClose={2500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />
</>
  );
}

export default App;
