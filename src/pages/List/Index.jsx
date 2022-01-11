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
  orderBy,
} from "firebase/firestore";
import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AppContext from "../../util/context";
import { auth, fstore } from "../../util/fire";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-monokai";
import { format, sub } from "date-fns";
import QUESTIONS from "../../data/questions.json";
import CodeSubmission from "./CodeSubmission";
import Button from "../../components/Button";
import CompletedTable from "./CompletedTable";
import AdminTable from "./AdminTable";
import Tr from "./Tr";
import ToDoTable from "./ToDoTable";

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
  let [student, setStudent] = useState(undefined);

  useEffect(() => {
    if (userData?.isAdmin && params.get("id")) {
      setStudentId(params.get("id"));
      loadStudent(params.get("id"));
    } else if (user) {
      setStudentId(user.uid);
    }
  }, [userData, user, params]);

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

  async function loadStudent(id) {
    let studentData = await getDoc(doc(fstore, "user_data", id));
    setStudent(studentData.data());
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

  let questions = QUESTIONS.map((v, i) => ({ ...v, id: i }));
  let sorted = useMemo(() => {
    // if (params.get("level"))
    //   ret = ret.filter((v) => v.data().level === params.get("level"));
    let ret = [...questions];
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
        window.location.reload();
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
        <div className="flex">
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
          <div className="flex-1"></div>
          {userData?.isAdmin && (
            <Link
              className={
                "bg-white py-1 px-2 rounded-lg drop-shadow active:drop-shadow-none mx-5"
              }
              to="/admin"
            >
              Admin Page →
            </Link>
          )}
        </div>
      ) : (
        <Button onClick={() => signInWithGoogle()} className={"m-3"}>
          Log In
        </Button>
      )}
      {userData?.isAdmin && params.get("id") && (
        <div className="text-xl mx-4 mb-2">{student?.name + "'s List"}</div>
      )}
      <hr />
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
      {userData && (
        <div>
          <CompletedTable
            setShowSubmit={setShowSubmit}
            questions={questions}
            setQId={setQId}
            submissions={submissions}
            updateSubmission={updateSubmission}
            qId={qId}
            Tr={Tr}
          />
          <hr className="my-3" />
          {userData?.isAdmin && params.get("id") ? (
            <div>
              <AdminTable
                setShowSubmit={setShowSubmit}
                setQId={setQId}
                submissions={submissions}
                updateSubmission={updateSubmission}
                qId={qId}
                Tr={Tr}
                sortBy={sortBy}
                sortOrder={sortOrder}
                sortField={sortField}
                sorted={sorted}
                userData={userData}
              />
            </div>
          ) : (
            //ToDo List
            <ToDoTable
              setShowSubmit={setShowSubmit}
              questions={questions}
              setQId={setQId}
              submissions={submissions}
              updateSubmission={updateSubmission}
              qId={qId}
              Tr={Tr}
            />
          )}
        </div>
      )}
    </div>
  );
}
