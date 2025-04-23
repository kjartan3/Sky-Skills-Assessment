import React, {useState} from 'react'


const SignupForm = ({ onAuthSuccess }) => {
    const [formData, setFormData] = useState({ 
        name: "",
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
        e.preventDefault();
        setError("")
        try {
            const res = await fetch(`http://localhost:5000/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify( formData ),
            })

            const data = await res.json()

            if (res.ok) {
                console.log("Token recieved", data.token)
                sessionStorage.setItem("token", data.token);
                onAuthSuccess();
            } 
            else {
            alert(data.message || "Sign-up failed")
            }
        } catch (err) {
            console.error("Sign-up error", err)
            setError(err.message || "Something went wrong")
        }
    }

    return (
        <form onSubmit={handleSubmit} className='signup-form'>
            <h2>Sign-up</h2>
            {error && <p style={{color: "red"}}>{error}</p>}
            <input
                type='text'
                name='name'
                placeholder='Name'
                value={formData.name}
                onChange={handleChange}
                required
            />
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
            <button type='submit'>Register</button>
        </form>
    )
}

export default SignupForm