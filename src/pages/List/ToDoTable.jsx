import { auth } from "../../util/fire";

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
            {"id,site,level,name,difficulty,due date".split(",").map((v, i) => (
              <th
                key={i}
                style={{
                  textTransform: "capitalize",
                }}
                className="px-4"
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
