import React, { useState } from 'react'
import './style.css'
import Input from '../Input';
import Button from '../Button';
import {  GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, db, doc, provider, setDoc } from '../../firebase';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getDoc } from 'firebase/firestore';

function SignUpSignIn() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState(false);
  const navigate = useNavigate();

  function signupWithEmail() {
    setLoading(true);
    console.log("Name", name);
    console.log("email", email);
    console.log("password", password);
    console.log("confirm password", confirmPassword);
    // Create new account using email and password
    if(name!= "" && email!= "" && password!= "" && confirmPassword!= ""){
      if(password == confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            console.log("User >>", user);
            toast.success("User created!");
            setLoading(false);
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            createDoc(user);
            navigate("/dashboard");
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);
          })        
      } else {
        toast.error("password and Confirm password don't match!");
        setLoading(false);
      }

    } else {
        toast.error("All fields are mandatory!");
        setLoading(false);
    }
  }

  function loginUsingEmail() {
    console.log("Email",email);
    console.log("Password", password);
    setLoading(true);
    if(email != "" && password != "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          toast.success("User Logged In!");
          setLoading(false);
          navigate("/dashboard");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setLoading(false);
          toast.error(errorMessage);
        });
    } else {
      toast.error("All fields are mandatory!");
      setLoading(false);
    }

  }

  async function createDoc(user) {
    setLoading(true);
    if(!user) return;

    const  userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);

    if(!userData.exists()) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          name : user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt: new Date(),
        });
        // toast.success("Doc created!");
        setLoading(false);
      } catch (e) {
        toast.error(e.message);
        setLoading(false);
      }
    } else {
      // toast.error("Doc already exists");
      setLoading(false);
    }
  
  }

  function googleAuth() {
    setLoading(true);
    try {
      signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        toast.success("User Authenticated!");
        setLoading(false);
        createDoc(user);
        navigate("/dashboard");
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        setLoading(false);
        toast.error(errorMessage);
        
      });
    } catch (e) {
      setLoading(false);
      toast.error(e.message);
    }
  }

  return (
    <>
      {
        loginForm ? (
          <div className='signupWrapper'>
            <h2 className='title'>
                Login on <span style={{color: '#2187FF'}}>Financly.</span>
            </h2>
            <form>
              <Input
                type="email"
                label={"Email"} 
                state={email} 
                setState={setEmail} 
                placeholder={"JhonDoe@gmail.com"} 
              />
              <Input
                type="password"
                label={"Password"} 
                state={password} 
                setState={setPassword} 
                placeholder={"JhonDoe@123"} 
              />
              <Button disabled={loading} text={loading ? "Loading..." : "Login Using Email and Password"} onClick={loginUsingEmail}/>
              <p className='login'>or</p>
              <Button onClick={googleAuth} text={loading ? "Loading..." : "Login Using Google"} blue={true} />
              <p className='login' style={{cursor: 'pointer'}} onClick={() => setLoginForm(!loginForm)}>Or Don't Have An Account? Click Here</p>
            </form>
          </div>

        ) :

        (
          <div className='signupWrapper'>
            <h2 className='title'>
                Sign Up on <span style={{color: '#2187FF'}}>Financly.</span>
            </h2>
            <form>
              <Input
                label={"Full Name"} 
                state={name} 
                setState={setName} 
                placeholder={"Jhon Doe"} 
              />
              <Input
                type="email"
                label={"Email"} 
                state={email} 
                setState={setEmail} 
                placeholder={"JhonDoe@gmail.com"} 
              />
              <Input
                type="password"
                label={"Password"} 
                state={password} 
                setState={setPassword} 
                placeholder={"JhonDoe@123"} 
              />
              <Input
                type="password"
                label={"Confirm Password"} 
                state={confirmPassword} 
                setState={setConfirmPassword} 
                placeholder={"JhonDoe@123"} 
              />
              <Button disabled={loading} text={loading ? "Loading..." : "Signup Using Email and Password"} onClick={signupWithEmail}/>
              <p className='login'>or</p>
              <Button onClick={googleAuth} text={loading ? "Loading..." : "Signup Using Google"} blue={true} />
              <p className='login' style={{cursor: 'pointer'}} onClick={() => setLoginForm(!loginForm)}>Or Have An Account Already? Click Here</p>
            </form>
          </div>
        )
      }
    </>
  )
}

export default SignUpSignIn;