import AddImage from "../img/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const displayName = event.target[0].value;
    const email = event.target[1].value;
    const password = event.target[2].value;
    const file = event.target[3].files[0];

    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(response.user);

      const date = new Date().getTime();
      //Create a unique image name
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          setLoading(true)
          try {
            //Update the user profile
            await updateProfile(response.user, {
              displayName: displayName,
              photoURL: downloadURL,
            });
            //create user on firestore
            await setDoc(doc(db, "user", response.user.uid), {
              uid: response.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "userChats", response.user.uid), {});
            navigate("/login");
          } catch (error) {
            console.log(error);
            setError(true);
            setLoading(false);
          }
        });
      });
    } catch (error) {
      console.log(error);
      setError(true);
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="formContainer">
        <div className="formWrapper">
          <span className="logo">Sha1Chat</span>
          <span className="title">Register</span>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="display Name" />
            <input type="email" placeholder="email" />
            <input type="password" placeholder="password" />
            <input style={{ display: "none" }} type="file" id="file" />
            <label htmlFor="file">
              <img src={AddImage} alt="" />
              <span>Add an Avatar</span>
            </label>

            <button>Sign Up</button>
            {loading && "Uploading and compressing the image please wait..."}
            {error && <span>Something went wrong!!!</span>}
          </form>
          <p>You have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
