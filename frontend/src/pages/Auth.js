import SignupForm from "../components/Auth/SignupForm";
import LoginForm from "../components/Auth/LoginForm";
import { useNavigate } from "react-router-dom";
import React, {useState} from 'react'


const Auth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const navigate = useNavigate();

    const handleAuthSuccess = () => {
        navigate("/");
    };

    const toggleForm = () => setIsLoggedIn(!isLoggedIn);

    return (
        <div className="auth-container">
            {isLoggedIn ? (
                <LoginForm onAuthSuccess={handleAuthSuccess} toggleForm={toggleForm} />
            ) : (
                <SignupForm onAuthSuccess={handleAuthSuccess} toggleForm={toggleForm} />
            )}
        </div>
    );
};


export default Auth;