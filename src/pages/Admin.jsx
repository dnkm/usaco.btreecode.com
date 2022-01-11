import { format } from "date-fns";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../util/context";
import { auth, fstore } from "../util/fire";
import List from "./List/Index";

export default function Admin() {
  const { user, userData } = useContext(AppContext);
  let navigate = useNavigate();
  let [students, setStudents] = useState([]);

  useEffect(() => {
    if (userData) {
      if (userData.isAdmin) {
        loadStudents();
      } else {
        navigate(`/`);
      }
    }
  }, [user, userData]);

  async function loadStudents() {
    let ref = collection(fstore, "user_data");
    let q = query(ref, where("isActive", "==", true));
    let { docs } = await getDocs(q);
    setStudents(docs);
  }

  function setStudent(stdId) {
    navigate("/?id=" + stdId);
  }

  return (
    <div className="flex flex-col p-10">
      <h1 className="text-lg font-bold">{"Admin Page"}</h1>
      <div>Student List:</div>
      <div className="flex py-1 w-full justify-between">
        <button>Name</button>
        <button>Created Date</button>
      </div>
      <div>
        {students.map((s) => (
          <button
            key={s.id}
            className="flex py-1 hover:bg-gray-200 w-full justify-between px-1"
            onClick={() => setStudent(s.id)}
          >
            <div>{s.data().name}</div>
            <div>{format(s.data().createDate.toDate(), "MM/dd/yyyy")}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
