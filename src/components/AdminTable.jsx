import { useContext } from "react";
import { auth } from "../fire";

export default function AdminTable({
  setShowSubmit,
  setQId,
  submissions,
  updateSubmission,
  qId,
  Tr,
  sortField,
  sortOrder,
  sorted,
  userData,
  sortBy,
}) {
  return (
    <div>
      <div>Problem List</div>
      <table border="1">
        <thead>
          <tr>
            {(auth.currentUser
              ? ",id,completed,site,level,name,difficulty"
              : "id,site,level,name,difficulty"
            )
              .split(",")
              .map((v, i) => (
                <th
                  key={i}
                  onClick={() => sortBy(v)}
                  style={{
                    textTransform: "capitalize",
                    color: sortField === v ? "#c00c00" : "black",
                    cursor: "pointer",
                  }}
                >
                  <div>
                    {v.replace("_", " ")}{" "}
                    {(() => {
                      if (sortField === v) {
                        if (sortOrder) return "↑";
                        else return "↓";
                      }
                    })()}
                  </div>
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
    </div>
  );
}
