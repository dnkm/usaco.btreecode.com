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
      <table border="1" className="table-fixed">
        <thead>
          <tr>
            {"id,completed,site,level,name,difficulty,submission,date"
              .split(",")
              .map((v, i) => (
                <th
                  key={i}
                  style={{
                    textTransform: "capitalize",
                  }}
                  className="px-4 "
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
