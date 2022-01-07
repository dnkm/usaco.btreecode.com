import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AppContext from "./context";
import { auth, fstore } from "./fire";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-monokai";
import { format } from "date-fns";
import QUESTIONS from "./data/questions.json";
import CodeSubmission from "./CodeSubmission";
import Button from "./components/Button";

function levelToNum(level) {
  switch (level) {
    case "bronze":
      return 1;
    case "silver":
      return 2;
    case "gold":
      return 3;
    default:
      return 4;
  }
}

export default function List() {
  let [sortField, setSortField] = useState("id");
  let [sortOrder, setSortOrder] = useState(true);
  const [params] = useSearchParams();
  const { userData, user } = useContext(AppContext);
  let [showSubmit, setShowSubmit] = useState(false);
  let [submissions, setSubmissions] = useState([]);
  let [qId, setQId] = useState(undefined);
  let [code, setCode] = useState(`//paste your code here`);
  let [studentId, setStudentId] = useState(undefined);
  let [studentList, setStudentList] = useState([]);

  useEffect(() => {
    if (userData?.isAdmin) {
      loadStudentList();
    } else if (user) {
      setStudentId(user.uid);
    }
  }, [userData, user]);

  useEffect(() => {
    if (studentId) {
      loadSubmissions(studentId);
    }
  }, [studentId]);

  useEffect(() => {
    if (!qId) return;
    // if (!studentId) return;

    getDocs(
      query(
        collection(fstore, "usaco-codes"),
        where(`uid`, "==", user.uid),
        where(`qid`, "==", qId)
      )
    ).then((snapshot) => {
      let docs = snapshot.docs;
      console.log("fetching code", docs.length);
      if (docs.length === 0) setCode(`//paste your code here`);
      else setCode(docs[0].data().code);
    });
  }, [qId]);

  async function loadStudentList() {
    let ref = collection(fstore, "user_data");
    let q = query(ref, where("isActive", "==", true));
    let { docs } = await getDocs(q);
    setStudentList(docs);
  }

  async function loadSubmissions(id) {
    let docRef = collection(fstore, "usaco-submissions");
    let q = query(docRef, where("uid", "==", id));
    let { docs } = await getDocs(q);
    setSubmissions(docs.map((d) => d.data()));
  }

  function sortBy(field) {
    if (sortField === field) setSortOrder((p) => !p);
    else {
      setSortField(field);
      setSortOrder(true);
    }
  }

  // function setLevel(lv) {
  //   navigate("/?level=" + lv);
  // }

  let sorted = useMemo(() => {
    let ret = QUESTIONS.map((v, i) => ({ ...v, id: i }));

    // if (params.get("level"))
    //   ret = ret.filter((v) => v.data().level === params.get("level"));

    if (sortField) {
      let comp = (a, b) =>
        (a[sortField] < b[sortField] ? -1 : 1) * (sortOrder ? 1 : -1);

      if (sortField === "level") {
        comp = (a, b) => {
          let aa = levelToNum(a.level);
          let bb = levelToNum(b.level);
          return (aa - bb) * (sortOrder ? 1 : -1);
        };
      }

      ret.sort(comp);
    }
    return ret;
  }, [sortField, sortOrder, params]);

  async function updateSubmission(uid, qid, data, doSubmitCode = false) {
    console.log("doSubmitCode", doSubmitCode);
    let c = collection(fstore, "usaco-submissions");
    let q = query(c, where("uid", "==", uid), where("qid", "==", qid));
    let { docs } = await getDocs(q);
    if (docs.length >= 1) {
      let d2 = docs[0];
      let d = doc(fstore, "usaco-submissions", d2.id);

      // update existing
      if (data.date && d2.data().date) {
        alert("You have already submitted this");
        return;
      } else {
        if (doSubmitCode) submitCode(uid, qid);
        updateDoc(d, data);
      }
    } else {
      // create a new
      if (doSubmitCode) submitCode(uid, qid);
      let { id } = await addDoc(c, { uid, qid, ...data });
      let newDoc = await getDoc(doc(c, id));
      setSubmissions((p) => [...p, newDoc.data()]);
    }
  }

  async function submitCode(uid, qid) {
    // code submissions
    let entry = {
      uid,
      qid,
      code: code,
    };
    addDoc(collection(fstore, "usaco-codes"), entry);
    setShowSubmit(false);
    setCode(`//paste your code here`);
  }

  function signInWithGoogle() {
    if (auth.currentUser !== null) {
      return;
    }
    signInWithPopup(auth, new GoogleAuthProvider())
      .then()
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  return (
    <div>
      {/* {"bronze,silver,gold".split(",").map((lv) => (
        <button key={lv} onClick={() => setLevel(lv)}>
          {lv}
        </button>
      ))} */}
      {userData ? (
        <div>
          <span className="mx-4">
            {(userData?.isAdmin ? "(Admin) " : "") + userData?.name}
          </span>
          <Button
            onClick={() => {
              window.location.reload(false);
              signOut(auth);
            }}
          >
            Sign Out
          </Button>
        </div>
      ) : (
        <Button onClick={() => signInWithGoogle()} className={"m-3"}>
          Log In
        </Button>
      )}
      <div>
        {userData?.isAdmin && (
          <div className="flex flex-wrap my-2">
            {studentList.map((u) => (
              <div
                key={u.id}
                className={
                  "mx-3 rounded-lg px-2 bg-white drop-shadow-none  " +
                  (u.id === studentId ? "bg-gray-200" : "hover:drop-shadow-md")
                }
              >
                <button onClick={() => setStudentId(u.id)}>
                  {u.data().name}
                </button>
              </div>
            ))}
          </div>
        )}
        <hr />
      </div>
      {showSubmit && (
        <CodeSubmission
          close={() => setShowSubmit(false)}
          code={code}
          setCode={setCode}
          updateSubmission={updateSubmission}
          uid={user.uid}
          qid={qId}
        />
      )}
      <table border="1">
        <thead>
          <tr>
            {(auth.currentUser
              ? "id,completed,site,level,name,difficulty,submission/date"
              : "id,site,level,name,difficulty"
            )
              .split(",")
              .map((v, i) => (
                <th
                  key={i}
                  onClick={() => sortBy(v)}
                  style={{
                    textTransform: "capitalize",
                    color: sortField === v ? "#c00c00" : "black",
                    cursor: "pointer",
                  }}
                >
                  {v.replace("_", " ")}{" "}
                  {(() => {
                    if (sortField === v) {
                      if (sortOrder) return "↑";
                      else return "↓";
                    }
                  })()}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((q) => (
            <Tr
              key={q.id}
              q={q}
              submit={() => {
                setShowSubmit(true);
                setQId(q.id);
              }}
              i={q.id}
              submissions={submissions}
              updateSubmission={updateSubmission}
              isSelected={qId === q.id}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Tr({ q, submit, submissions, i, updateSubmission, isSelected }) {
  const { level, name, site, difficulty } = q;
  const { userData, user } = useContext(AppContext);

  const submission = submissions?.find((v) => v.qid === i);

  function displayComplete() {
    let subdate =
      submission &&
      submission.date &&
      format(submission.date.toDate(), "MM-dd");

    return `${submission.date ? "✅" : ""}${submission.lh ? "💙" : ""}${
      submission.ih ? "💜" : ""
    }${submission?.date ? subdate : ""}`;
  }

  return (
    <tr
      style={{
        backgroundColor: isSelected ? "pink" : "white",
      }}
    >
      <td className="flex justify-center">{i}</td>
      {userData && <td>{submission && displayComplete()}</td>}
      <td className="flex justify-center">{site}</td>
      <td>{level}</td>
      <td>{name}</td>
      <td className="flex justify-center">{difficulty}</td>
      {userData && (
        <td>
          {submission && submission.date ? (
            <Button onClick={() => submit()}>View Code</Button>
          ) : (
            <Button onClick={() => submit()}>submit</Button>
          )}
        </td>
      )}
      {userData?.isAdmin && (
        <td>
          <Button onClick={() => updateSubmission(user.uid, i, { lh: true })}>
            LH
          </Button>
        </td>
      )}
      {userData?.isAdmin && (
        <td>
          <Button
            onClick={() =>
              //console.log(question?.date.toDate !== undefined ?  "defined" : "undefined")
              updateSubmission(user.uid, i, { ih: true })
            }
          >
            IH
          </Button>
        </td>
      )}
    </tr>
  );
}
