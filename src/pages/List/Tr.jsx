import { format } from "date-fns";
import { useContext, useState } from "react";
import AppContext from "../../util/context";
import Button from "../../components/Button";
import { useSearchParams } from "react-router-dom";

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
  const [params] = useSearchParams();

  const submission = submissions?.find((v) => v.qid === q.id);
  let [disable, setDisable] = useState(true);
  let [showDate, setShowDate] = useState(false);

  function displayComplete() {
    return `${submission.date ? "✅" : ""}${submission.lh ? "LH" : ""}${
      submission.ih ? "IH" : ""
    }`;
  }

  function assign(ev) {
    ev.preventDefault();
    if (params.get("id")) {
      if (ev.target.dueDate.value === "") {
        let date = new Date();
        date = date.setDate(date.getDate() + 7);
        updateSubmission({
          uid: params.get("id"),
          qid: q.id,
          data: {
            dueDate: format(date, "yyyy-MM-dd"),
          },
        });
      } else {
        updateSubmission({
          uid: params.get("id"),
          qid: q.id,
          data: {
            dueDate: ev.target.dueDate.value,
          },
        });
      }
    }
  }

  return (
    <tr>
      {isAdmin && (
        <>
          {submission ? (
            <td>{submission?.date ? "Completed" : "Assigned"}</td>
          ) : (
            <td className="text-xs relative">
              {showDate && (
                <div className="absolute rounded-lg bg-white drop-shadow z-10 mt-7">
                  <form onSubmit={assign} className="flex flex-col">
                    <input className="" type="date" name="dueDate" />
                    <Button
                      onClick={() => {
                        setDisable(true);
                      }}
                      disable={disable}
                    >
                      +
                    </Button>
                  </form>
                </div>
              )}
              <Button onClick={() => setShowDate(!showDate)}>Assign</Button>
            </td>
          )}
        </>
      )}
      <td className="text-center">{q.id}</td>
      {userData && !isAssigned && (
        <td className="px-5">{submission && displayComplete()}</td>
      )}
      <td className="text-center">{site}</td>
      <td className="text-center">{level}</td>
      <td className="text-center">{name}</td>
      <td className="text-center">{difficulty}</td>
      {userData && isAssigned && (
        <td
          className={
            format(new Date(), "yyyy-MM-dd") > submission.dueDate
              ? "text-red-500"
              : ""
          }
        >
          {submission.dueDate}
        </td>
      )}
      {userData && !isAdmin && (
        <td className="text-center">
          {submission && submission.date ? (
            <Button onClick={() => submit()}>View Code</Button>
          ) : (
            <Button onClick={() => submit()}>submit</Button>
          )}
        </td>
      )}
      {isCompleted && (
        <td className="flex justify-center">
          {format(submission.date.toDate(), "MM-dd")}
        </td>
      )}
      {isAdmin && params.get("id") && (
        <td>
          <Button
            onClick={() =>
              updateSubmission({
                uid: params.get("id"),
                qid: q.id,
                data: {
                  lh: true,
                },
              })
            }
          >
            LH
          </Button>
        </td>
      )}
      {isAdmin && params.get("id") && (
        <td>
          <Button
            onClick={() =>
              //console.log(question?.date.toDate !== undefined ?  "defined" : "undefined")
              updateSubmission({
                uid: params.get("id"),
                qid: q.id,
                data: {
                  ih: true,
                },
              })
            }
          >
            IH
          </Button>
        </td>
      )}
    </tr>
  );
}
