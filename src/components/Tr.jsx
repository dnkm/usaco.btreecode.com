import { format } from "date-fns";
import { useContext, useState } from "react";
import AppContext from "../context";
import Button from "./Button";

export default function Tr({
  q,
  submit,
  submissions,
  updateSubmission,
  isSelected,
  isAdmin,
  isCompleted,
  isAssigned,
}) {
  const { level, name, site, difficulty } = q;
  const { userData, user } = useContext(AppContext);

  const submission = submissions?.find((v) => v.qid === q.id);
  let [disable, setDisable] = useState(true);

  function displayComplete() {
    return `${submission.date ? "✅" : ""}${submission.lh ? "LH" : ""}${
      submission.ih ? "IH" : ""
    }`;
  }

  function submit(ev) {
    ev.preventDefault();
    if (ev.target.dueDate.value === "") {
      let date = new Date();
      date = date.setDate(date.getDate() + 7);
      updateSubmission(user.uid, q.id, { dueDate: format(date, "yyyy-MM-dd") });
    } else {
      updateSubmission(user.uid, q.id, { dueDate: ev.target.dueDate.value });
    }
  }

  return (
    <tr
      style={{
        backgroundColor: isSelected ? "pink" : "white",
      }}
    >
      {isAdmin && (
        <>
          {submission ? (
            <>{submission?.date ? "Completed" : "Assigned"}</>
          ) : (
            <td className="text-xs cursor-pointer">
              <form onSubmit={submit}>
                <input type="date" name="dueDate" />
                <Button
                  onClick={() => {
                    setDisable(false);
                  }}
                  disable={disable}
                >
                  Assign
                </Button>
              </form>
            </td>
          )}
        </>
      )}
      <td className="">{q.id}</td>
      {userData && !isAssigned && (
        <td className="">{submission && displayComplete()}</td>
      )}
      <td className="">{site}</td>
      <td>{level}</td>
      <td>{name}</td>
      <td className="flex justify-center mx-2">{difficulty}</td>
      {userData && isAssigned && <td>{submission.dueDate}</td>}
      {userData && !isAdmin && (
        <td className="mx-4">
          {submission && submission.date ? (
            <Button onClick={() => submit()}>View Code</Button>
          ) : (
            <Button onClick={() => submit()}>submit</Button>
          )}
        </td>
      )}
      {isCompleted && <td>{format(submission.date.toDate(), "MM-dd")}</td>}
      {isAdmin && (
        <td>
          <Button
            onClick={() => updateSubmission(user.uid, q.id, { lh: true })}
          >
            LH
          </Button>
        </td>
      )}
      {isAdmin && (
        <td>
          <Button
            onClick={() =>
              //console.log(question?.date.toDate !== undefined ?  "defined" : "undefined")
              updateSubmission(user.uid, q.id, { ih: true })
            }
          >
            IH
          </Button>
        </td>
      )}
    </tr>
  );
}
