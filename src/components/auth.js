import GoogleButton from "react-google-button";
import {
  signInWithPopup,
  getAdditionalUserInfo,
  GoogleAuthProvider
} from "firebase/auth";
import { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { userActions } from "../store/userSlice";
import SideBar from "./SideBar";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

const Auth = () => {
  const provider = new GoogleAuthProvider();
  const [user, setUser] = useState();
  const dispatch = useDispatch();
  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await signInWithPopup(auth, provider)
      .then((result) => {
        setUser(result.user);

        // IS A NEW USER
        if (getAdditionalUserInfo(result).isNewUser) {
          const newUserData = {
            name: result.user.displayName,
            email: result.user.email,
            userList: ["abhinav", "adarsh"]
          };
          setDoc(doc(db, "users", result.user.uid), newUserData);
          dispatch(userActions.setUserInfo(newUserData));
          setLogged(true);
          setLoading(false);
        }

        // NOT A NEW USER
        if (!getAdditionalUserInfo(result).isNewUser) {
          onSnapshot(doc(db, "users", result.user.uid), (snap) => {
            dispatch(userActions.setUserInfo(snap.data()));
            setLogged(true);
            setLoading(false);
          });
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  return (
    <div className="">
      {!logged && (
        <div className="flex flex-col h-screen">
          <div className="text-white text-center text-3xl h-2/3  w-screen flex  items-center justify-center bg-[#4285F4]">
            <div className="px-5">
              <Typography variant="h2" component="div" sx={{ flexGrow: 1 }}>
                GM chat
              </Typography>

              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Chat with just a Gmail to <br /> a Gmail..
              </Typography>
            </div>
          </div>
          <div className="flex items-center justify-center  w-screen h-1/3 bg-[#fff] ">
            <div className="">
              {!loading && (
                <GoogleButton onClick={handleClick}>
                  {" "}
                  Continue with Google{" "}
                </GoogleButton>
              )}
              {loading && <CircularProgress />}
            </div>
          </div>
        </div>
      )}
      {logged && <SideBar />}
    </div>
  );
};

export default Auth;
