import { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const handleSearch = async () => {
    const q = query(
      collection(db, "user"),
      where("displayName", "==", username)
    );
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (error) {
      setError(true);
    }
  };

  const handleKeyEnter = (event) => {
    event.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    //Check whether  the group chat in firestore exist, if not,
    const combinedUsersId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    //create a chats in Chat collection
    try {
      const response = await getDoc(doc(db, "chats", combinedUsersId));
      if (!response.exists()) {
        await setDoc(doc(db, "chats", combinedUsersId), { messages: [] });

        //create a user chat
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedUsersId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedUsersId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedUsersId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.uid,
            photoURL: currentUser.photoURL,
          },
          [combinedUsersId + ".date"]: serverTimestamp(),
        });
      }
    } catch (error) {
      setError(true);
    }

    setUser(null);
    setUsername("");
  };
  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user"
          onChange={(event) => setUsername(event.target.value)}
          onKeyDown={handleKeyEnter}
          value={username}
        />
      </div>
      {error && <span>User not found!</span>}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user?.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user?.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
