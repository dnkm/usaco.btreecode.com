import { format } from "date-fns";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../util/context";
import { fstore } from "../util/fire";

export default function Admin() {
  const { user, userData } = useContext(AppContext);
  let navigate = useNavigate();
  let [active, setActive] = useState([]);
  let [students, setStudents] = useState([]);

  useEffect(() => {
    if (!userData.isAdmin) {
      navigate(`/`);
    }
    loadStudents();
  }, [user, userData]);

  function setStudent(stdId) {
    navigate("/?id=" + stdId);
  }

  async function loadStudents() {
    let ref = collection(fstore, "user_data");
    let q = query(ref, where("isActive", "==", true));
    let { docs } = await getDocs(q);
    setActive(docs);
    setStudents(docs);
  }

  function search(ev) {
    ev.preventDefault();
    setActive(
      students.filter(
        (st) =>
          st.data().name.toLowerCase().indexOf(ev.target.value.toLowerCase()) >
          -1
      )
    );
    ev.target.reset();
  }

  return (
    <div className="flex flex-col p-10">
      <h1 className="text-lg font-bold">{"Admin Page"}</h1>
      <input
        type="text"
        name="search"
        className="w-full px-3 border-2"
        placeholder="search student"
        autoComplete="off"
        autoCapitalize="off"
        onChange={search}
      />
      <div className="flex py-1 w-full justify-between">
        <button>Name: </button>
        <button>Created Date</button>
      </div>
      <div className="">
        {active?.map((s) => (
          <button
            key={s.id}
            className="flex py-3 hover:bg-gray-200 w-full justify-between px-1 font-bold"
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
