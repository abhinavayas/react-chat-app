import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  where
} from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebaseConfig";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import HomeIcon from "@mui/icons-material/Home";
import Avatar from "@mui/material/Avatar";
import AppBar from "@mui/material/AppBar";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const AddFriend = ({ addFriendToggleFunction, sender }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState({ title: "Added", text: "" });
  const handleClick = async () => {
    if (email.length >= 1 && email.split("@")[1] === "gmail.com") {
      setLoading(true);
      const q = query(collection(db, "users"), where("email", "==", email));
      const snap = await getDocs(q);
      // const snap2 = await getDoc(doc(db, "userList", sender, "userList", email));
      // alert(snap2.exists() ? "user already added" : "user not added");
      if (snap.docs.length === 1) {
        await setDoc(doc(db, "userList", sender, "userList", email), {
          email: email,
          timestamp: Timestamp.now(),
          read: true
        });
        setMessage({
          title: "Success !!!",
          text: "We have added " + email.split("@")[0] + " to your Friend List."
        });
        setLoading(false);
        setOpen(true);
        setEmail("");
      } else {
        setMessage({
          title: "Oops !!",
          text: "User: " + email + " not found."
        });
        setLoading(false);
        setOpen(true);
      }
    } else {
      setMessage({
        title: "Error",
        text: "Please enter a valid Email address.."
      });
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 300,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4
  };

  return (
    <div className="w-screen bg-[#fff]">
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {message.title}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {message.text}
          </Typography>
        </Box>
      </Modal>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className=" w-screen top-0 left-0 shadow-lg">
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" style={{ backgroundColor: "#4285F4" }}>
            <Toolbar>
              <Button
                onClick={addFriendToggleFunction}
                disableElevation
                variant="contained"
                style={{
                  backgroundColor: "#4285F4",
                  border: "none",
                  minWidth: "10px"
                }}
              >
                <ArrowBackIosIcon style={{ backgroundColor: "#4285F4" }} />
              </Button>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <Avatar alt={sender} src="/static/images/avatar/3.jpg" />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Add Friend
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
      </div>

      <div className=" h-2/3 flex justify-center align-center flex-col">
        <div className="flex justify-center py-5">
          <h1 className="font-bold text-xl">
            {" "}
            <br />{" "}
          </h1>
        </div>
        <div className="flex justify-center">
          <TextField
            id="filled-basic"
            label="Enter Email:"
            variant="filled"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex justify-center py-5">
          <Button
            variant="contained"
            onClick={handleClick}
            style={{ backgroundColor: "#0F9D58" }}
          >
            {" "}
            Add a Friend{" "}
          </Button>
        </div>
        <br />
      </div>
    </div>
  );
};

export default AddFriend;
