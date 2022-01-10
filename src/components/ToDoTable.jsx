import { auth } from "../fire";

export default function ToDoTable({
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
      <div>Assigned Problems</div>
      <table border="1">
        <thead>
          <tr>
            {(auth.currentUser
              ? "id,site,level,name,difficulty,due date"
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
            .filter((s) => !s.date)
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
                isAssigned={true}
              />
            ))}
        </tbody>
      </table>
    </div>
  );
}
