import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = event.target[0].value;
    const password = event.target[1].value;

    try {
     const response= await signInWithEmailAndPassword(auth, email, password);
     console.log(response)
      navigate("/");
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div>
      <div className="formContainer">
        <div className="formWrapper">
          <span className="logo">Sha1Chat</span>
          <span className="title">Login</span>
          <form onSubmit={handleSubmit}>
            <input type="email" placeholder="email" />
            <input type="password" placeholder="password" />

            <button>Sign In</button>
            {error && <span>Something went wrong!!!</span>}
          </form>
          <p>You don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
