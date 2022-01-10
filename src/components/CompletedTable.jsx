import { auth } from "../fire";

export default function CompletedTable({
  setShowSubmit,
  questions,
  setQId,
  submissions,
  updateSubmission,
  qId,
  Tr,
}) {
  return (
    <div>
      <div>Completed</div>
      <table border="1">
        <thead>
          <tr>
            {(auth.currentUser
              ? "id,completed,site,level,name,difficulty,submission,date"
              : "id,site,level,name,difficulty"
            )
              .split(",")
              .map((v, i) => (
                <th
                  key={i}
                  style={{
                    textTransform: "capitalize",
                  }}
                >
                  {v.replace("_", " ")}{" "}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {submissions
            .filter((s) => s.date)
            .map((sub) => questions[sub.qid])
            .map((q) => (
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
                isCompleted={true}
              />
            ))}
        </tbody>
      </table>
    </div>
  );
}
