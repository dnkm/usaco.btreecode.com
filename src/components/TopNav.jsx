import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useContext } from "react";
import { Link } from "react-router-dom";
import AppContext from "../util/context";
import { auth } from "../util/fire";
import Button from "./Button";

const ADMIN_MENUS = [
  ["Admin Page", "/admin"],
  ["Home", "/"],
];

export default function TopNav() {
  const { user, userData } = useContext(AppContext);
  return (
    <div className="bg-gray-800 text-white p-2">
      <div className="container mx-auto flex items-center">
        <img
          src="https://i.imgur.com/IuJpm6D.png"
          alt=""
          className="h-5 mr-2"
        />
        <div>BTREE USACO PREP SHEET</div>
        <div className="flex-1"></div>
        <div>
          {user ? <UserMenu user={user} userData={userData} /> : <GuestMenu />}
        </div>
      </div>
    </div>
  );
}

function UserMenu({ user, userData }) {
  function doSignout() {
    signOut(auth);
  }
  return (
    <div>
      {userData?.isAdmin && <AdminMenu />}
      <Button onClick={doSignout}>Log Out</Button>
    </div>
  );
}

function AdminMenu() {
  return (
    <div className="inline-flex space-x-5 mx-5">
      {ADMIN_MENUS.map(([text, link]) => (
        <Link to={link} key={text}>{text}</Link>
      ))}
    </div>
  );
}

function GuestMenu() {
  function signInWithGoogle() {
    signInWithPopup(auth, new GoogleAuthProvider());
  }
  return (
    <div>
      <Button onClick={() => signInWithGoogle()}>Log In</Button>
    </div>
  );
}
