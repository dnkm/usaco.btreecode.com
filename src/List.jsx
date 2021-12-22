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
  const { userData } = useContext(AppContext);
  let [showSubmit, setShowSubmit] = useState(false);
  let [completed, setCompleted] = useState([]);
  let [submitted, setSubmitted] = useState([]);
  let [qId, setQId] = useState();
  let [text, setText] = useState(`//paste your code here`);

  useEffect(() => {
    // getDocs(collection(fstore, "usaco_questions"))
    //   .then((ss) => ss.docs)
    //   .then(setQuestions);
    setSubmitted([]);
  }, [userData]);

  // async function loadUser(id) {
  //   let d = await getDoc(doc(fstore, "user_data", id));
  //   setSubmitted(d.data().questions);
  // }

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

  async function submitCode(uid, qid) {
    let date = new Date();
    // code submissions
    let entry = {
      uid,
      qid,
      code: text,
    };

    addDoc(collection(fstore, "usaco-codes"), entry);

    let curDoc = await getDoc(doc(fstore, "usaco-results", uid));
    let results = [];
    if (curDoc.exists) {
      results = curDoc.data().results;
    }

    let existingRecord = results.find((d) => d.qid === qid);

    if (existingRecord && existingRecord.date ) {
      alert("You have already submitted for this question");
      return;
    }
    // if (!existingRecord)
      
    // else


    // let questions = [...submitted, entry2];
    // updateDoc(doc(fstore, "user_data", uid), { questions });
    // setSubmitted(questions);
    // setShowSubmit(false);
    // setText("");
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
          <button onClick={() => submitCode(auth.currentUser.uid, qId)}>
            submit
          </button>
        </div>
      )}
      <table border="1">
        <thead>
          <tr>
            <th>#</th>
            {(auth.currentUser
              ? "completed,site,level,name,difficulty,,,submission,date"
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
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Tr({ q, submit, submitted, i }) {
  const { level, name, site } = q;
  const { userData } = useContext(AppContext);
  let [difficulty, setDifficulty] = useState(q.difficulty);
  let [date, setDate] = useState();
  let [question, setQuestion] = useState([]);

  useEffect(() => {
    if (submitted) {
      setQuestion();
      submitted.forEach((sub) => {
        if (sub.qId === q.id) {
          setQuestion(sub);
        }
      });
    }
  }, [submitted]);

  function changeDifficulty(inc) {
    // updateDoc(doc(fstore, "usaco_questions", q.id), {
    //   difficulty: increment(inc)
    // });
    // setDifficulty(difficulty + inc);
    //how to update the state
  }

  return (
    <tr>
      <td>{i}</td>
      {userData && <td>{question && "check"}</td>}
      <td>{site}</td>
      <td>{level}</td>
      <td>{name}</td>
      <td>{difficulty}</td>
      {userData && (
        <>
          <td>{question?.LH ? "LH check" : "LH"}</td>
          <td>{question?.LH ? "LH check" : "LH"}</td>
          <td>
            <button onClick={() => submit()}>submit</button>
          </td>
          <td>
            {question
              ? format(
                  question.date.toDate !== undefined
                    ? question.date.toDate()
                    : question.date,
                  "MM-dd"
                )
              : ""}
          </td>
        </>
      )}

      {userData?.isAdmin && (
        <td>
          <button onClick={() => changeDifficulty(1)}>⬆</button>
        </td>
      )}
      {userData?.isAdmin && (
        <td>
          <button onClick={() => changeDifficulty(-1)}>↓</button>
        </td>
      )}
    </tr>
  );
}
