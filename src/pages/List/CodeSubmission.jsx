import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import AceEditor from "react-ace";
import Button from "../../components/Button";
import { fstore } from "../../util/fire";

export default function CodeSubmission({ close, updateSubmission, uid, qid }) {
  let [type, setType] = useState("java");
  let [code, setCode] = useState(`Checking your previous submission....`);
  let [loading, setLoading] = useState(true);

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
      if (docs.length === 0) setCode(``);
      else setCode(docs[0].data().code);
      setLoading(false);
    });
  }, [qid]);

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
            //value={text}
            width={"100%"}
            height="100%"
            onChange={setCode}
            name="UNIQUE_ID_OF_DIV"
            // editorProps={{ $blockScrolling: true }}
            value={code}
            readOnly={loading}
          />
        </div>
        <div className="space-x-2">
          <Button onClick={close} bgColor="gray-700" textColor="white">
            close
          </Button>
          <Button
            bgColor="gray-700"
            textColor="white"
            onClick={() => {
              updateSubmission({ uid, qid, code, data: { date: new Date() } });
            }}
          >
            submit
          </Button>
        </div>
      </div>
    </div>
  );
}
