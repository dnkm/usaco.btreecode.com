import { useState } from "react";
import AceEditor from "react-ace";
import Button from "./components/Button";

export default function CodeSubmission({
  close,
  setCode,
  code,
  updateSubmission,
  uid,
  qid,
}) {
  let [type, setType] = useState("java");

  function changeType(ev) {
    ev.preventDefault();
    console.log(ev.target.type.value);
    setType(ev.target.type.value);
  }

  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center p-12 z-10"
      style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
      onClick={close}
    >
      <div onClick={(ev) => ev.stopPropagation()} className="w-11/12 h-5/6 ">
        <button
          onClick={() => setType("java")}
          className={
            "px-2 py-1 bg-white rounded-lg " +
            (type === "java" ? "bg-gray-300" : "drop-shadow-md")
          }
        >
          JAVA
        </button>
        <button
          onClick={() => setType("python")}
          className={
            "px-2 py-1 bg-white rounded-lg " +
            (type === "python" ? "bg-gray-300" : "drop-shadow-md")
          }
        >
          PYTHON
        </button>
        <AceEditor
          mode={type}
          theme="monokai"
          //value={text}
          width={"100%"}
          height="100%"
          onChange={setCode}
          name="UNIQUE_ID_OF_DIV"
          editorProps={{ $blockScrolling: true }}
          value={code}
        />
        <Button onClick={close}>close</Button>
        <Button
          onClick={() => {
            updateSubmission(uid, qid, { date: new Date() }, true);
          }}
          className={"mx-1"}
        >
          submit
        </Button>
      </div>
    </div>
  );
}
