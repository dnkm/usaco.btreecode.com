import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { fstore } from "../util/fire";

export default function Update() {
  async function update() {
    let ref = collection(fstore, "usaco_questions");

    let { docs } = await getDocs(ref);

    docs.forEach((d) => {
      let diff = d.data().sub_cat;
      let diffOne = 0;

      let diffTen = 30;
      if (d.data().level === "bronze") diffTen = 0;
      if (d.data().level === "silver") diffTen = 10;
      if (d.data().level === "gold") diffTen = 20;
      if (diff.substr(diff.length - 1, diff.length) === "1") diffOne = 1;
      if (diff.substr(diff.length - 1, diff.length) === "2") diffOne = 4;
      if (diff.substr(diff.length - 1, diff.length) === "3") diffOne = 7;
      let final = diffTen + diffOne;
      updateDoc(doc(fstore, "usaco_questions", d.id), { difficulty: final });
    });
  }

  return (
    <div className="App">
      <button onClick={update}>Update</button>
    </div>
  );
}
