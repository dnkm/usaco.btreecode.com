import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, fstore } from "./fire";
import List from "./List";

export default function Admin() {
  let [user, setUser] = useState();
  let [userList, setUserList] = useState([]);
  let [student, setStudent] = useState([]);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    let ref = collection(fstore, "user_data");
    let q = query(ref, where("isActive", "==", true));
    let { docs } = await getDocs(q);

    docs.forEach((d) => {
      if (d.id === auth.currentUser?.uid) {
        setUser(d);
      }
    });
    setUserList(docs);
  }

  async function loadStudent(id) {
    let snapshot = await getDoc(doc(fstore, "usaco-results", id));
    //console.log(snapshot.data().questions[0].qId);
    setStudent(snapshot.data().questions);
  }

  return (
    <div>
      {user?.data().isAdmin && (
        <div>
          {userList.map((u) => (
            <div key={u.id}>
              <button onClick={() => loadStudent(u.id)}>{u.data().name}</button>
            </div>
          ))}
        </div>
      )}
      <hr />
    </div>
  );
}
