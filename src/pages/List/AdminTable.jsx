import { useContext } from "react";
import { auth } from "../../util/fire";

export default function AdminTable({
  setShowSubmit,
  setQId,
  submissions,
  updateSubmission,
  qId,
  Tr,
  userData,
  sortBy,
  questions,
}) {
  let sorted = [...questions].map((q) => ({
    ...q,
    submission: submissions.find((sub) => sub.qid === q.id),
  }));

  // q (30) + assigned + code:   30 - 2000
  // q (30) + assigned:          30 - 1000
  // q (30) :                    30

  sorted.sort((a, b) => {
    let aPt =
      (a.submission ? -1000 : 0) +
      (a.submission?.date ? -1000 : 0) +
      (a.difficulty || 999);
    let bPt =
      (b.submission ? -1000 : 0) +
      (b.submission?.date ? -1000 : 0) +
      (b.difficulty || 999);
    return aPt - bPt;
  });

  return (
    <table className="table-1">
      <thead>
        <tr>
          {"status,✓,help,site,level,name,difficulty,,"
            .split(",")
            .map((v, i) => (
              <th key={i} className="capitalize">
                <div>{v.replace("_", " ")}</div>
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
            submissions={submissions}
            updateSubmission={updateSubmission}
            isSelected={qId === q.id}
            isAdmin={userData.isAdmin}
          />
        ))}
      </tbody>
    </table>
  );
}
