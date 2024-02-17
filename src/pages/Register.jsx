import React, { useState } from 'react'
import Add from "../img/addAvatar.png"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from 'react-router-dom';

export const Register = () => {
  const [err, setErr] = useState(false)
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault() //to prevent refreshing on submit
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      //Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      //Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            //create user on firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "userChats", res.user.uid), {})
            navigate("/")

          } catch (err) {
            console.log(err);
            setErr(true);
          }
        });
      });
    } catch {
      setErr(true)
    }

  }
  return (
    <div className='formContainer'>
      <div className="formWrapper">
        <span className="logo">QuipQuirk</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder='Display name' />
          <input type="email" placeholder='Email' />
          <input type="password" placeholder='Password' />
          <input style={{ display: "none" }} type="file" id='file' />
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add an avatar</span>
          </label>
          <button>Sign Up</button>
          {/* {err && <span>Something went wrong</span>} */}
        </form>
        <p>Do you have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  )
}
