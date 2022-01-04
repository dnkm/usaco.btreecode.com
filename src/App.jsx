import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Add from "./Add";
import Admin from "./Admin";
import AppContext from "./context";
import { auth, fstore } from "./fire";
import List from "./List";
import Update from "./Update";

export default function App() {
  let [user, setUser] = useState(undefined);
  let [userData, setUserData] = useState(undefined);

  useEffect(() => {
    let unsub = onAuthStateChanged(auth, async (user) => {
      console.log("user", user);
      if (user) {
        let userDataRef = doc(fstore, "user_data", user.uid);
        let d = await getDoc(userDataRef);

        const initUserData = {
          name: auth.currentUser?.displayName,
          isActive: true,
          isAdmin: false
        };

        if (d.exists()) {
          setUserData(d.data());
        } else {
          await setDoc(userDataRef, initUserData);
          setUserData(initUserData);
        }
      }
      setUser(user);
    });

    return () => unsub();
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        userData
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<List />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}
