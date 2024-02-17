import React, { useContext, useState } from "react";
import Img from "../img/img.png";
import Attach from "../img/attach.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { arrayUnion, doc, getDoc, serverTimestamp, Timestamp, updateDoc, } from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    try {
      if (img) {
        const storageRef = ref(storage, uuid());
        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on("state_changed", (snapshot) => { },
          (error) => {
            console.error("Error uploading image:", error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              await updateChatWithMessage(downloadURL);
            });
          }
        );
      } else {
        await updateChatWithMessage(null);
      }

      // Update userChats for both currentUser and the other user
      await updateLastMessage(currentUser.uid);
      await updateLastMessage(data.user.uid);

      setText("");
      setImg(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const updateChatWithMessage = async (downloadURL) => {
    try {
      const chatDocRef = doc(db, "chats", data.chatId);
      await updateDoc(chatDocRef, {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
          img: downloadURL,
        }),
      });
    } catch (error) {
      console.error("Error updating chat:", error);
    }
  };

  const updateLastMessage = async (userId) => {
    try {
      const userChatDocRef = doc(db, "userChats", userId);
      const userChatDocSnap = await getDoc(userChatDocRef);
      if (userChatDocSnap.exists()) {
        await updateDoc(userChatDocRef, {
          [data.chatId + ".lastMessage"]: {
            text,
          },
          [data.chatId + ".date"]: serverTimestamp(),
        });
      } else {
        console.error("User chat document does not exist:", userId);
      }
    } catch (error) {
      console.error("Error updating userChats:", error);
    }
  };
  
  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <img src={Attach} alt="" />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};