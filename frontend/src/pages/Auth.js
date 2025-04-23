import SignupForm from "../components/Auth/SignupForm";
import LoginForm from "../components/Auth/LoginForm";
import { useNavigate } from "react-router-dom";
import React, {useState} from 'react'


const Auth = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const navigate = useNavigate()

    const handleAuthSuccess = () => {
        navigate("/")
    }

    return (
        <div className="auth-container">
            {isLoggedIn ? (
                <LoginForm onAuthSuccess={handleAuthSuccess}/>
            ) : (
                <SignupForm onAuthSuccess={handleAuthSuccess}/>
            )}

            <p style={{marginTop: "1rem"}}>
                {isLoggedIn ? "Don't have an account?" : "Already have an account"}{" "}
                <button onClick={() => setIsLoggedIn(!isLoggedIn)}>
                {isLoggedIn ? "Sign-up" : "Log in"} 
                </button>
            </p>

        </div>
    )
};

export default Auth;