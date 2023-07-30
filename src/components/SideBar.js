import * as React from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../firebaseConfig";
import AddFriend from "./AddFriend";
import ChatBox from "./ChatBox";
import Avatar from "@mui/material/Avatar";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Drawer from "@mui/material/Drawer";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
// this is sender always

const SideBar = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const [showList, setShowList] = useState(true); // TOGGLE FRIEDN LIST
  const [showChat, setShowChat] = useState(false); // TOGGLES CHAT BOX
  const [reciever, setReciever] = useState([]); // HAS USER NAME AND READ OR NOT LAST MESSAGE
  const [userList, setUserList] = useState(["abhinavrajdevwork@gmail.com"]);
  const [toggleAddFrieend, setToggleAddFriend] = useState(false); //  SET THE VISIBLITY OF ADD FRIEND PAGE
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "userList", userInfo.email, "userList"),
      orderBy("timestamp", "desc")
    );
    onSnapshot(q, (snap) => {
      setUserList(
        snap.docs.map((doc) => {
          return doc.data();
        })
      );
    });
  }, []);

  const addFriendToggleFunction = () => {
    setShowList((prevVal) => !prevVal);
    setToggleAddFriend((prevVal) => !prevVal);
    setOpen(false);
  };

  const hideChat = () => {
    setShowList(true);
    setShowChat(false);
  };

  // show chat
  const handleClick = (user) => {
    setReciever(user);
    setShowList(false);
    setShowChat(true);
  };

  return (
    <div className="">
      {showChat && (
        <ChatBox
          sender={userInfo.email}
          reciever={reciever}
          hideChat={hideChat}
        />
      )}
      {toggleAddFrieend && (
        <AddFriend
          addFriendToggleFunction={addFriendToggleFunction}
          sender={userInfo.email}
        />
      )}

      {showList && (
        <div className="">
          <Drawer
            sx={{
              flexShrink: 0,
              width: "50%",
              boxShadow:
                "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
              "& .MuiDrawer-paper": {
                width: "50%",
                boxSizing: "border-box",
                boxShadow:
                  "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
                backgroundColor: "#f0f0f0"
              }
            }}
            variant="persistent"
            anchor="left"
            open={open}
          >
            <ArrowBackIosIcon
              style={{
                marginLeft: "auto",
                marginRight: "0px",
                marginTop: "10px",
                fontSize: "20px",
                cursor: "pointer"
              }}
              onClick={() => setOpen(false)}
            />

            <List>
              <ListItem
                alignItems="flex-start"
                style={{ cursor: "pointer" }}
                onClick={addFriendToggleFunction}
              >
                <ListItemAvatar>
                  <PersonAddIcon
                    style={{ fontSize: "30px", color: "#0F9D58" }}
                  />
                </ListItemAvatar>
                <ListItemText primary={"Add"} style={{ margin: "auto" }} />
              </ListItem>
              <Divider />
              <div
                className="px-2"
                style={{ position: "sticky", bottom: "0px", height: "100%" }}
              >
                <img
                  className="w-2/3"
                  alt="abhinav raj"
                  style={{ margin: "auto" }}
                  src="https://abhinavayas.github.io/abhraj.com-assets/assets/profile/profile-transparent-bg.png"
                />
                <br />

                <p className="text-center">
                  {" "}
                  Developed by Abhinav Raj, <br />{" "}
                  <a href="http://abhraj.com/" className="text-blue-600">
                    {" "}
                    <u> Contact</u>{" "}
                  </a>{" "}
                </p>
              </div>
            </List>
          </Drawer>

          <div className=" w-screen bg-[#fefae0] shadow-lg">
            <Box sx={{ flexGrow: 1 }}>
              <AppBar position="static" style={{ backgroundColor: "#4285F4" }}>
                <Toolbar>
                  <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={() => setOpen(true)}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    GM chat
                  </Typography>
                </Toolbar>
              </AppBar>
            </Box>
          </div>
          <div className="  pb-[200px]">
            <List
              sx={{
                width: "100%",
                margin: "auto",
                bgcolor: "background.paper"
              }}
            >
              {" "}
              {userList.map((user) => {
                return (
                  <ListItem
                    key={user.email}
                    alignItems="flex-start"
                    onClick={() => handleClick(user.email)}
                    style={{ cursor: "pointer" }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt={user.email}
                        src="/static/images/avatar/3.jpg"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.email ? user.email.split("@")[0] : ""}
                    />
                    {!user.read && (
                      <AnnouncementIcon style={{ color: "red" }} />
                    )}
                  </ListItem>
                );
              })}
            </List>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideBar;
