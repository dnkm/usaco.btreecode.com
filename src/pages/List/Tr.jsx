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
  const { userData } = useContext(AppContext);
  const [params] = useSearchParams();

  const submission = submissions?.find((v) => v.qid === q.id);
  let [disable, setDisable] = useState(true);
  let [showDate, setShowDate] = useState(false);

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
            status: "assigned",
          },
        });
      } else {
        updateSubmission({
          uid: params.get("id"),
          qid: q.id,
          data: {
            dueDate: ev.target.dueDate.value,
            status: "assigned",
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
            <td>{submission?.status}</td>
          ) : (
            <td className="text-xs relative">
              {showDate && (
                <div className="absolute rounded-lg bg-white drop-shadow z-10 mt-7">
                  <form onSubmit={assign} className="flex flex-col">
                    <input className="" type="date" name="dueDate" />
                    <Button
                      onClick={() => {
                        setDisable(true);
                        setShowDate(false);
                      }}
                      disable={disable}
                    >
                      +
                    </Button>
                  </form>
                </div>
              )}
              <Button
                onClick={() => {
                  setShowDate(!showDate);
                }}
              >
                Assign
              </Button>
            </td>
          )}
        </>
      )}
      {userData && !isAssigned && (
        <>
          <td>
            {submission?.date && (
              <>
                {submission?.status !== "revoked" ? (
                  <SmallBox classNames={`bg-green-300 text-green-700`}>
                    ✓
                  </SmallBox>
                ) : (
                  <SmallBox classNames={`bg-red-300 text-red-700`}>X</SmallBox>
                )}
              </>
            )}
          </td>
          <td className="">
            <div className="flex space-x-1 justify-center">
              {submission?.lh && (
                <SmallBox classNames={`bg-pink-300 text-pink-600`}>
                  Logic
                </SmallBox>
              )}
              {submission?.ih && (
                <SmallBox classNames={`bg-pink-300 text-pink-600`}>
                  Code
                </SmallBox>
              )}
            </div>
          </td>
        </>
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
        <td>
          <div className="flex justify-center">
            {format(submission.date.toDate(), "MM-dd")}
          </div>
        </td>
      )}
      {isAdmin && (
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
      {isAdmin && (
        <td>
          <Button
            onClick={() =>
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

function SmallBox({ children, classNames }) {
  return (
    <div
      className={`h-5 flex justify-center items-center text-sm p-0.5 ${classNames}`}
    >
      {children}
    </div>
  );
}
