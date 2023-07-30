import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Timestamp, orderBy } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import Avatar from "@mui/material/Avatar";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SendIcon from "@mui/icons-material/Send";
import TextField from "@mui/material/TextField";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const ChatBox = ({ sender, reciever, hideChat }) => {
  const [toggle, setToggle] = useState(false);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [id, setIDs] = useState([]);
  useEffect(() => {
    const q = query(
      collection(db, "msg", sender, reciever),
      orderBy("timestamp", "asc")
    );
    onSnapshot(q, (snap) => {
      setChats(
        snap.docs.map((doc) => {
          setToggle((prevVal) => !prevVal);
          return doc.data();
        })
      );
      setIDs(
        snap.docs.map((doc) => {
          return doc.id;
        })
      );
      updateDoc(doc(db, "userList", sender, "userList", reciever), {
        read: true
      });
    });
  }, []);

  const handleSend = () => {
    if (message.length >= 1) {
      const timeNow = Timestamp.now();
      addDoc(collection(db, "msg", sender, reciever), {
        read: false,
        text: message,
        timestamp: timeNow,
        sender: sender
      });
      addDoc(collection(db, "msg", reciever, sender), {
        read: false,
        text: message,
        timestamp: timeNow,
        sender: sender
      });
      // NOTIFY USER MESSAGE HAS BEEN SEND TO RECIEVER
      setDoc(doc(db, "userList", reciever, "userList", sender), {
        email: sender,
        timestamp: timeNow,
        read: false
      });
      setDoc(doc(db, "userList", sender, "userList", reciever), {
        email: reciever,
        timestamp: timeNow,
        read: true
      });
      try {
        document.getElementById("charBox").scrollTop = document.getElementById(
          "charBox"
        ).scrollHeight;
      } catch (e) {}
      setMessage("");
    }
  };
  const chatRef = useRef();

  const ScrollDown = () => {
    const lastChildElement = chatRef.current?.lastElementChild;
    lastChildElement?.scrollIntoView({ behavior: "smooth" });
    // chatRef.current.scrollTo({ x: 0, y: 50 });
  };
  const [firstRender, setFirstRender] = useState(true);

  useEffect(() => {
    ScrollDown();
    setFirstRender((prevVale) => (prevVale === false ? true : false));
  }, [chats]); //
  useEffect(() => {
    ScrollDown();
  }, [firstRender]);

  return (
    <div className=" flex flex-col  bg-[#fff]  justify-between h-screen">
      <div className=" top-0 left-0  shadow-lg sticky top-0">
        <Box sx={{}}>
          <AppBar position="static" style={{ backgroundColor: "#4285F4" }}>
            <Toolbar>
              <Button
                onClick={hideChat}
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
                <Avatar alt={reciever} src="/static/images/avatar/3.jpg" />
              </IconButton>
              <Typography variant="p" component="div" sx={{ flexGrow: 1 }}>
                {reciever ? reciever.split("@")[0] : ""}
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
      </div>

      <div
        className="flex  w-screen  flex-col gap-5 overflow-auto  px-2 pb-10 pt-40"
        ref={chatRef}
      >
        {chats.map((chat, index) => {
          return (
            <div
              key={id[index]}
              className={
                chat.sender === sender
                  ? "flex justify-end "
                  : "flex justify-start "
              }
            >
              <div
                className={
                  chat.sender === sender
                    ? "shadow-md text-xl font-semibold bg-[#bde0fe] rounded-lg p-2"
                    : "shadow-md text-xl font-semibold  bg-[#a2d2ff] rounded-lg p-2"
                }
              >
                <h1> {chat.text} </h1>
              </div>
            </div>
          );
        })}{" "}
      </div>
      <div className="sticky bottom-0 flex items-center gap-5 px-4 pb-2">
        <TextField
          fullWidth
          multiline
          label="message"
          id="fullWidth"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          disableElevation
          variant="contained"
          endIcon={<SendIcon />}
          style={{
            color: "#0F9D58",
            cursor: "pointer",
            backgroundColor: "#fff",
            width: "10px",
            minWidth: "10px"
          }}
          onClick={handleSend}
        ></Button>
      </div>
    </div>
  );
};

export default ChatBox;
