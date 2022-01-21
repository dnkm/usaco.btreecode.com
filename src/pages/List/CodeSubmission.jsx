import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import AceEditor from "react-ace";
import Button from "../../components/Button";
import { fstore } from "../../util/fire";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-monokai";

export default function CodeSubmission({
  close,
  updateSubmission,
  uid,
  qid,
  userData,
}) {
  let [type, setType] = useState("java");
  let [code, setCode] = useState(`Checking your previous submission....`);
  let [loading, setLoading] = useState(true);
  let [exists, setExists] = useState(true);

  useEffect(() => {
    if (typeof qid === "undefined") return;

    getDocs(
      query(
        collection(fstore, "usaco-codes"),
        where(`uid`, "==", uid),
        where(`qid`, "==", qid)
      )
    ).then((snapshot) => {
      let docs = snapshot.docs;

      if (docs.length === 0) {
        setCode(``);
        setExists(false);
        setLoading(true);
        return;
      }

      setLoading(false);
      if (docs[0].data().code) {
        setCode(docs[0].data().code);
        setExists(true);
      } else {
        setExists(false);
      }
    });

    getDocs(
      query(
        collection(fstore, "usaco-submissions"),
        where(`uid`, "==", uid),
        where(`qid`, "==", qid)
      )
    ).then((snapshot) => {
      let docs = snapshot.docs;

      if (docs.length >= 1) {
        setLoading(false);
        if (docs[0].data().status === "revoked") {
          setExists(false);
        }
      }
    });
  }, [qid, uid]);

  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center z-10"
      style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
      onClick={close}
    >
      <div
        onClick={(ev) => ev.stopPropagation()}
        className="w-11/12 h-5/6 bg-white rounded p-3 flex flex-col"
      >
        <div className="space-x-2">
          <button
            onClick={() => setType("java")}
            className={
              "px-2 py-1 rounded-lg " +
              (type === "java"
                ? "bg-gray-700 text-yellow-400"
                : "text-white bg-gray-700 drop-shadow-md")
            }
          >
            JAVA
          </button>
          <button
            onClick={() => setType("python")}
            className={
              "px-2 py-1 text-white rounded-lg " +
              (type === "python"
                ? "bg-gray-700 text-yellow-400"
                : "text-white bg-gray-700 drop-shadow-md")
            }
          >
            PYTHON
          </button>
        </div>
        <div className="my-2 flex-1">
          <AceEditor
            mode={type}
            theme="monokai"
            width={"100%"}
            height="100%"
            onChange={setCode}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
            value={code}
            readOnly={loading || exists}
          />
        </div>
        <div className="space-x-2 flex">
          <Button onClick={close} bgColor="gray-700" textColor="white">
            close
          </Button>
          <Button
            bgColor={exists ? "gray-300" : "gray-700"}
            textColor="white"
            onClick={() => {
              updateSubmission({
                uid,
                qid,
                code,
                data: { date: new Date(), status: "submitted" },
              });
            }}
            disabled={exists}
          >
            {exists ? "already submitted" : "Submit"}
          </Button>
          <div className="flex-1"></div>
          {userData.isAdmin && exists && !loading && (
            <>
              <Button
                bgColor="gray-700"
                textColor="white"
                onClick={() => {
                  updateSubmission({
                    uid,
                    qid,
                    code,
                    data: { status: "approved" },
                  });
                }}
              >
                Approve
              </Button>
              <Button
                bgColor="gray-700"
                textColor="white"
                onClick={() => {
                  updateSubmission({
                    uid,
                    qid,
                    code,
                    data: { status: "revoked" },
                  });
                }}
              >
                Revoke
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
