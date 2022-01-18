import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Admin from "./pages/Admin";
import AppContext from "./util/context";
import { auth, fstore } from "./util/fire";
import List from "./pages/List/Index";
import Update from "./used/Update";
import TopNav from "./components/TopNav";
import "./styles.css";

export default function App() {
  let [user, setUser] = useState(undefined);
  let [userLoaded, setUserLoaded] = useState(false);
  let [userData, setUserData] = useState(undefined);

  useEffect(() => {
    let unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        let userDataRef = doc(fstore, "user_data", user.uid);
        let d = await getDoc(userDataRef);

        const initUserData = {
          name: auth.currentUser?.displayName,
          isActive: true,
          isAdmin: false,
          createDate: new Date(),
        };

        if (d.exists()) {
          setUserData(d.data());
        } else {
          await setDoc(userDataRef, initUserData);
          setUserData(initUserData);
        }
      }
      setUser(user);
      setUserLoaded(true);
    });

    return () => unsub();
  }, []);

  if (!userLoaded) return <div>Loading session data... </div>;

  return (
    <AppContext.Provider
      value={{
        user,
        userData,
      }}
    >
      <BrowserRouter>
        <div>
          <TopNav />
          {user ? (
            <Routes>
              <Route path="/" element={<List />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          ) : (
            <div>Please login</div>
          )}
        </div>
      </BrowserRouter>
    </AppContext.Provider>
  );
}
