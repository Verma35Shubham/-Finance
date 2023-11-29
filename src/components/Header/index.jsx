import React, { useEffect } from "react";
import "./style.css";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import userImg from '../../assets/user.svg';

function Header() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading]);

  function logoutFn() {
    try {
      signOut(auth)
        .then(() => {
          toast.success("Logged Out Successfully!");
          navigate("/");
        })
        .catch((error) => {
          toast.error(e.message);
        });
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div className="navbar">
      {user ? (<p className="logo">Hi, Welcome back <span>Khushal</span></p>) : (<p className="logo">Financly.</p>)}
      {user && (
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem"}}>
          <img src={user.photoURL ? user.photoURL : userImg} style={{borderRadius: "50%", height: "1.6rem", width: "1.7rem"}} /> 
          <p className="logo link" onClick={logoutFn}>
            Logout
          </p>
        </div>
      )}
    </div>
  );
}

export default Header;