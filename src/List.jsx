import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useMemo, useReducer, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import AppContext from "./context";
import { auth, fstore } from "./fire";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-monokai";
import { format } from "date-fns";
import QUESTIONS from "./data/questions.json";

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
  let [sortField, setSortField] = useState("name");
  let [sortOrder, setSortOrder] = useState(true);
  const [params] = useSearchParams();
  const { userData, user } = useContext(AppContext);
  let [showSubmit, setShowSubmit] = useState(false);
  let [completed, setCompleted] = useState([]);
  let [submitted, setSubmitted] = useState([]);
  let [qId, setQId] = useState();
  let [text, setText] = useState(`//paste your code here`);

  useEffect(() => {
    // getDocs(collection(fstore, "usaco_questions"))
    //   .then((ss) => ss.docs)
    //   .then(setQuestions);
    if (user) {
      loadSubmissions(user.uid);
    }
  }, [userData, user]);

  async function loadSubmissions(id) {
    let docRef = collection(fstore, "usaco-submissions");
    let q = query(docRef, where("uid", "==", id))
    let { docs } = await getDocs(q);
    setSubmitted(docs.map(d => d.data()));
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
    let ret = [...QUESTIONS];

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

  async function updateSubmission(uid, qid, data) {
    let c = collection(fstore, "usaco-submissions");
    let q = query(c, where("uid", "==", uid), where("qid", "==", qid));
    let { docs } = await getDocs(q);
    if (docs.length >= 1) {
      let d2 = docs[0];
      let d = doc(fstore, "usaco-submissions", d2.id);

      // update existing
      if (data.date && doc.data().date) { 
        alert("You have already submitted this");  
        return; 
      } else {
        updateDoc(d, data)
      }
    } else {
      // create a new
      addDoc(c, { uid, qid, ...data })
    }
  }

  async function submitCode(uid, qid) {

    // code submissions
    let entry = {
      uid,
      qid,
      code: text
    };
    addDoc(collection(fstore, "usaco-codes"), entry);
    setShowSubmit(false);
    setText(`//paste your code here`);
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
          <span>{userData?.name}</span>
          <Link to="/admin">{userData?.isAdmin ? " (admin)" : ""}</Link>
          <button
            onClick={() => {
              window.location.reload(false);
              signOut(auth);
            }}
          >
            Sign Out
          </button>
        </div>
      ) : (
        <button onClick={() => signInWithGoogle()}>Log In</button>
      )}
      {showSubmit && (
        <div>
          <AceEditor
            mode={"java"}
            theme="monokai"
            //value={text}
            width={"70%"}
            onChange={setText}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
            value={text}
          />
          <button onClick={() => setShowSubmit(false)}>close</button>
          <button onClick={() => {
            submitCode(user.uid, qId)
            updateSubmission(user.uid, qId, { date: new Date() })
          }}>
            submit
          </button>
        </div>
      )}
      <table border="1">
        <thead>
          <tr>
            <th>#</th>
            {(auth.currentUser
              ? "completed,site,level,name,difficulty,submission/date"
              : "site,level,name,difficulty"
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
                      if (sortOrder) return "⬆";
                      else return "↓";
                    }
                  })()}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((q, i) => (
            <Tr
              key={i}
              q={q}
              submit={() => {
                setShowSubmit(true);
                setQId(i);
              }}
              i={i}
              submitted={submitted}
              updateSubmission={updateSubmission}
              difficulty={q.difficulty}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Tr({ q, submit, submitted, i, updateSubmission, difficulty }) {
  const { level, name, site } = q;
  const { userData, user } = useContext(AppContext);
  let [question, setQuestion] = useState([]);

  useEffect(() => {
    setQuestion();
    if (submitted) {
      submitted.forEach((sub) => {
        if (sub.qid === i) {
          setQuestion(sub);
        }
      });
    }
  }, [submitted]);

  function displayComplete() {
    if (!question.date) return "";
    if (question.lh && question.ih) return "Both";
    if (question.lh) return "LH";
    if (question.ih) return "IH";
    return "complete";
  }

  return (
    <tr>
      <td>{i}</td>
      {userData && <td>{question && displayComplete()}</td>}
      <td>{site}</td>
      <td>{level}</td>
      <td>{name}</td>
      <td>{difficulty}</td>
      {userData && (
        <td>
          {
          //question &&
            // ? (
            //   <div>
            //     {format(
            //       question.date.toDate !== undefined
            //         ? question.date.toDate()
            //         : question.date,
            //       "MM-dd"
            //     )}
            //   </div>
            // ) : (
            <button onClick={() => submit()}>submit</button>
          }
        </td>
      )}
      {userData?.isAdmin && (
        <td>
          <button onClick={() => updateSubmission(user.uid, i, { lh: true })}>LH</button>
        </td>
      )}
      {userData?.isAdmin && (
        <td>
          <button onClick={() => updateSubmission(user.uid, i, { ih: true })}>IH</button>
        </td>
      )}
    </tr>
  );
}
