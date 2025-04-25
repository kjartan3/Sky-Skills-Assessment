import React, {useState} from 'react'
import './Register.css';

const LoginForm = ({ onAuthSuccess, toggleForm }) => {
    const [formData, setFormData] = useState({ 
            email: "",
            password: "" 
        })

        const [error, setError] = useState("")

        const handleChange = (e) => {
            setFormData(prev => ({
             ...prev, 
             [e.target.name]: e.target.value
            }))
         }

         const handleSubmit = async (e) => {
            e.preventDefault()
            setError("")

            try {
                const res = await fetch(`http://localhost:5000/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify( formData ),
                })

                const data = await res.json()
                if (res.ok) {
                    sessionStorage.setItem("token", data.token);
                    onAuthSuccess()
    
                } 
                else {
                setError(data.message || "Login failed")
                }
            } catch (err) {
                console.error("Login error", err)
                setError(err.message || "Something went wrong")
         }
        }

        return (
            <form onSubmit={handleSubmit} className='login-form'>
                <h2>Login</h2>
                {error && <p style={{ color: "red" }}>{error}</p>}
    
                <input
                    type='email'
                    name='email'
                    placeholder='Email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type='password'
                    name='password'
                    placeholder='Password'
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button className="form-button" type='submit'>Login</button>
    
                <p>
                    Don't have an account?{" "}
                    <button className="sign-up-button" type="button" onClick={toggleForm}>
                        Sign-up
                    </button>
                </p>
            </form>
        );
}

export default LoginForm;