export default function CompletedTable({
  setShowSubmit,
  questions,
  setQId,
  submissions,
  updateSubmission,
  qId,
  Tr,
}) {
  let sorted = [...submissions];
  sorted.sort((a, b) => {
    return b.date - a.date;
  });
  return (
    <table border="1" className="table-1">
      <thead>
        <tr>
          {"✓,help,site,level,name,difficulty,submission,date"
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
        {sorted
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
  );
}
