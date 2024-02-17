import React, { useState } from 'react'
import Add from "../img/addAvatar.png"
import { useNavigate, Link } from 'react-router-dom'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"

export const Login = () => {

    const [err, setErr] = useState(false)
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault() //to prevent refreshing on submit
        const email = e.target[0].value;
        const password = e.target[1].value;

        try {
            await signInWithEmailAndPassword(auth, email, password)
            navigate("/")
        } catch {
            setErr(true)
        }
    }
    return (
        <div className='formContainer'>
            <div className="formWrapper">
                <span className="logo">QuipQuirk</span>
                <span className="title">Login</span>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder='Email' />
                    <input type="password" placeholder='Password' />
                    <button>Sign in</button>
                    {err && <span>Something went wrong</span>}
                </form>
                <p>You don't have an account? <Link to="/register">Register</Link></p>
            </div>
        </div>
    )
}


// email: mukul@gmail.com
// pass: mukulprabhu

// email: swathi@gmail.com
// pass: swathiprabhu
