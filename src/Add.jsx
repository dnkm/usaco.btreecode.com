import { addDoc, collection } from "firebase/firestore";
import { fstore } from "./fire";
import "./styles.css";

let text = `usaco,2014 December,bronze1,Marathon,
usaco,2014 December,bronze2,Crosswords,
usaco,2014 December,bronze3,Cow Jog,
usaco,2014 December,bronze4,Learning by Example,
usaco,2014 December,silver1,Piggyback,
usaco,2014 December,silver2,Marathon,
usaco,2014 December,silver3,Cow Jog,
usaco,2014 December,gold1,Guard Mark,
usaco,2014 December,gold2,Marathon,
usaco,2014 December,gold3,Cow Jog,
usaco,2015 January,bronze1,Cow Routing,
usaco,2015 January,bronze2,Cow Routing II,
usaco,2015 January,bronze3,It's All About the Base,
usaco,2015 January,bronze4,Meeting Time,
usaco,2015 January,silver1,Stampede,
usaco,2015 January,silver2,Cow Routing,
usaco,2015 January,silver3,Meeting Time,
usaco,2015 January,gold1,Cow Rectangles,
usaco,2015 January,gold2,Moovie Mooving,
usaco,2015 January,gold3,Grass Cownoisseur,
usaco,2015 February,bronze1,Censoring,
usaco,2015 February,bronze2,COW,
usaco,2015 February,bronze3,Cow Hopscotch,
usaco,2015 February,silver1,Censoring,
usaco,2015 February,silver2,Cow Hopscotch,
usaco,2015 February,silver3,Superbull,
usaco,2015 February,gold1,Cow Hopscotch,
usaco,2015 February,gold2,Censoring,
usaco,2015 February,gold3,Fencing the Herd,
usaco,2015 Open,bronze1,Moocryption,
usaco,2015 Open,bronze2,Bessie Gets Even,
usaco,2015 Open,bronze3,Trapped in the Haybales,
usaco,2015 Open,bronze4,Palindromic Paths,
usaco,2015 Open,silver1,Bessie Goes Moo,
usaco,2015 Open,silver2,Trapped in the Haybales,
usaco,2015 Open,silver3,Bessie's Birthday Buffet,
usaco,2015 Open,gold1,Googol,
usaco,2015 Open,gold2,Palindromic Paths,
usaco,2015 Open,gold3,Trapped in the Haybales,
usaco,2015 December,bronze1,Fence Painting,
usaco,2015 December,bronze2,Speeding Ticket,
usaco,2015 December,bronze3,Contaminated Milk,
usaco,2015 December,silver1,Switching on the Lights,
usaco,2015 December,silver2,High Card Winds,
usaco,2015 December,silver3,Breed Counting,
usaco,2015 December,gold1,High Card Low Card,
usaco,2015 December,gold2,Fruit Feast,
usaco,2015 December,gold3,Bessie's Dream,
usaco,2015 December,platinum1,Max Flow,
usaco,2015 December,platinum2,High Card Low Card,
usaco,2015 December,platinum3,Counting Haybales,
usaco,2016 January,bronze1,Promotion Counting,
usaco,2016 January,bronze2,Angry Cows,
usaco,2016 January,bronze3,Mowing the Field,
usaco,2016 January,silver1,Angry Cows,
usaco,2016 January,silver2,Subsequences Summing to Sevens,
usaco,2016 January,silver3,Build Gates,
usaco,2016 January,gold1,Angry Cows,
usaco,2016 January,gold2,Radio Contact,
usaco,2016 January,gold3,Lights Out,
usaco,2016 January,platinum1,Fort Moo,
usaco,2016 January,platinum2,Mowing the Field,
usaco,2016 January,platinum3,Lights Out,
usaco,2016 February,bronze1,Milk Pails,
usaco,2016 February,bronze2,Circular Barn,
usaco,2016 February,bronze3,Load Balancing,
usaco,2016 February,silver1,Circular Barn,
usaco,2016 February,silver2,Load Balancing,
usaco,2016 February,silver3,Milk Pails,
usaco,2016 February,gold1,Circular Barn,
usaco,2016 February,gold2,Circular Barn Revisited,
usaco,2016 February,gold3,Fenced In,
usaco,2016 February,platinum1,Load Balancing,
usaco,2016 February,platinum2,Fenced In,
usaco,2016 February,platinum3,Circular Barn,
usaco,2016 Open,bronze1,Diamond Collector,
usaco,2016 Open,bronze2,Bull in a China shop,
usaco,2016 Open,bronze3,Field Reduction,
usaco,2016 Open,silver1,Field Reduction,
usaco,2016 Open,silver2,Diamond Collector,
usaco,2016 Open,silver3,Closing the Farm,
usaco,2016 Open,gold1,Splitting the Field,
usaco,2016 Open,gold2,Closing the Farm,
usaco,2016 Open,gold3,248,
usaco,2016 Open,platinum1,262144,
usaco,2016 Open,platinum2,Bull in a China Shop,
usaco,2016 Open,platinum3,Landscaping,
usaco,2016 December,bronze1,Square Pasture,
usaco,2016 December,bronze2,Block Game,
usaco,2016 December,bronze3,The Cow-Signal,
usaco,2016 December,silver1,Counting Haybales,
usaco,2016 December,silver2,Cities and States,
usaco,2016 December,silver3,Moocast,
usaco,2016 December,gold1,Moocast,
usaco,2016 December,gold2,Cow Checklist,
usaco,2016 December,gold3,Lasers and Mirrors,
usaco,2016 December,platinum1,Lots of Triangles,
usaco,2016 December,platinum2,Team Building,
usaco,2016 December,platinum3,Robotic Cow Herd,
usaco,2017 January,bronze1,Don't Be Last!,
usaco,2017 January,bronze2,"Hoof, Paper, Scissors",
usaco,2017 January,bronze3,Cow Tipping,
usaco,2017 January,silver1,Cow Dance Show,
usaco,2017 January,silver2,"Hoof, Paper, Scissors",
usaco,2017 January,silver3,Secret Cow Code,
usaco,2017 January,gold1,Balanced Photo,
usaco,2017 January,gold2,"Hoof, Paper, Scissors",
usaco,2017 January,gold3,Cow Navigation,
usaco,2017 January,platinum1,Promotion Counting,
usaco,2017 January,platinum2,Building a Tall Barn,
usaco,2017 January,platinum3,Subsequence Reversal,
usaco,2017 February,bronze1,Why Did the Cow Cross the Road,
usaco,2017 February,bronze2,Why Did the Cow Cross the Road II,
usaco,2017 February,bronze3,Why Did the Cow Cross the Road III,
usaco,2017 February,silver1,Why Did the Cow Cross the Road,
usaco,2017 February,silver2,Why Did the Cow Cross the Road II,
usaco,2017 February,silver3,Why Did the Cow Cross the Road III,
usaco,2017 February,gold1,Why Did the Cow Cross the Road,
usaco,2017 February,gold2,Why Did the Cow Cross the Road II,
usaco,2017 February,gold3,Why Did the Cow Cross the Road III,
usaco,2017 February,platinum1,Why Did the Cow Cross the Road,
usaco,2017 February,platinum2,Why Did the Cow Cross the Road II,
usaco,2017 February,platinum3,Why Did the Cow Cross the Road III,
usaco,2017 Open,bronze1,The Lost Cow,
usaco,2017 Open,bronze2,Bovine Genomics,
usaco,2017 Open,bronze3,Modern Art,
usaco,2017 Open,silver1,Paired Up,
usaco,2017 Open,silver2,Bovine Genomics,
usaco,2017 Open,silver3,Where's Bessie?,
usaco,2017 Open,gold1,Bovine Genomics,
usaco,2017 Open,gold2,Modern Art 2,
usaco,2017 Open,platinum1,Modern Art,
usaco,2017 Open,platinum2,Switch Grass,
usaco,2017 Open,platinum3,COWBASIC,
usaco,2017 December,bronze1,Blocked Billboard,
usaco,2017 December,bronze2,The Bovine Shuffle,
usaco,2017 December,bronze3,Milk Measurement,
usaco,2017 December,silver1,My Cow Ate My Homework,
usaco,2017 December,silver2,Milk Measurement,
usaco,2017 December,silver3,The Bovine Shuffle,
usaco,2017 December,gold1,A Pie for a Pie,
usaco,2017 December,gold2,Barn Painting,
usaco,2017 December,gold3,Haybale Feast,
usaco,2017 December,platinum1,Standing Out from the Herd,
usaco,2017 December,platinum2,Pushing a Box,
usaco,2017 December,platinum3,Greedy Gift Takers,
usaco,2018 January,bronze1,Blocked Billboard II,
usaco,2018 January,bronze2,Lifeguards,
usaco,2018 January,bronze3,Out of Place,
usaco,2018 January,silver1,Lifeguards,
usaco,2018 January,silver2,Rental Service,
usaco,2018 January,silver3,MooTube,
usaco,2018 January,gold1,MooTube,
usaco,2018 January,gold2,Cow at Large,
usaco,2018 January,gold3,Stamp Painting,
usaco,2018 January,platinum1,Lifeguards,
usaco,2018 January,platinum2,Cow at Large,
usaco,2018 January,platinum3,Sprinklers,
usaco,2018 February,bronze1,Teleportation,
usaco,2018 February,bronze2,Hoofball,
usaco,2018 February,bronze3,Taming the Herd,
usaco,2018 February,silver1,Rest Stops,
usaco,2018 February,silver2,Snow Boots,
usaco,2018 February,silver3,Teleportation,
usaco,2018 February,gold1,Snow Boots,
usaco,2018 February,gold2,Directory Traversal,
usaco,2018 February,gold3,Taming the Herd,
usaco,2018 February,platinum1,Slingshot,
usaco,2018 February,platinum2,New Barns,
usaco,2018 February,platinum3,Cow Gymnasts,
usaco,2018 Open,bronze1,Team Tic Tac Toe,
usaco,2018 Open,bronze2,Milking Order,
usaco,2018 Open,bronze3,Family Tree,
usaco,2018 Open,silver1,Out of Sorts,
usaco,2018 Open,silver2,Lemonade Line,
usaco,2018 Open,silver3,Multiplayer Moo,
usaco,2018 Open,gold1,Out of Sorts,
usaco,2018 Open,gold2,Milking Order,
usaco,2018 Open,gold3,Talent Show,
usaco,2018 Open,platinum1,Out of Sorts,
usaco,2018 Open,platinum2,Train Tracking,
usaco,2018 Open,platinum3,Disruption,
usaco,2018 December,bronze1,Mixing Milk,
usaco,2018 December,bronze2,The Bucket List,
usaco,2018 December,bronze3,Back and Forth,
usaco,2018 December,silver1,Convention,
usaco,2018 December,silver2,Convention II,
usaco,2018 December,silver3,Mooyo Mooyo,
usaco,2018 December,gold1,Fine Dining,
usaco,2018 December,gold2,Cowpatibility,
usaco,2018 December,gold3,Teamwork,
usaco,2018 December,platinum1,Balance Beam,
usaco,2018 December,platinum2,Sort It Out,
usaco,2018 December,platinum3,The Cow Gathering,
usaco,2019 January,bronze1,Shell Game,
usaco,2019 January,bronze2,Sleepy Cow Sorting,
usaco,2019 January,bronze3,Guess the Animal,
usaco,2019 January,silver1,Grass Planting,
usaco,2019 January,silver2,Icy Perimeter,
usaco,2019 January,silver3,Mountain View,
usaco,2019 January,gold1,Cow Poetry,
usaco,2019 January,gold2,Sleepy Cow Sorting,
usaco,2019 January,gold3,Shortcut,
usaco,2019 January,platinum1,Redistricting,
usaco,2019 January,platinum2,Exercise Route,
usaco,2019 January,platinum3,Train Tracking 2,
usaco,2019 February,bronze1,Sleepy Cow Herding,
usaco,2019 February,bronze2,The Great Revegetation,
usaco,2019 February,bronze3,Measuring Traffic,
usaco,2019 February,silver1,Sleepy Cow Herding,
usaco,2019 February,silver2,Painting the Barn,
usaco,2019 February,silver3,The Great Revegetation,
usaco,2019 February,gold1,Cow Land,
usaco,2019 February,gold2,Dishwashing,
usaco,2019 February,gold3,Painting the Barn,
usaco,2019 February,platinum1,Cow Dating,
usaco,2019 February,platinum2,Moorio Kart,
usaco,2019 February,platinum3,Mowing Mischief,
usaco,2019 Open,bronze1,Bucket Brigade,
usaco,2019 Open,bronze2,Milk Factory,
usaco,2019 Open,bronze3,Cow Evolution,
usaco,2019 Open,silver1,Left Out,
usaco,2019 Open,silver2,Cow Steeplechase II,
usaco,2019 Open,silver3,Fence Planning,
usaco,2019 Open,gold1,Snakes,
usaco,2019 Open,gold2,I Would Walk 500 Miles,
usaco,2019 Open,gold3,Balancing Inversions,
usaco,2019 Open,platinum1,Tree Boxes,
usaco,2019 Open,platinum2,Compound Escape,
usaco,2019 Open,platinum3,Valleys,
usaco,2019 December,bronze1,Cow Gymnastics,
usaco,2019 December,bronze2,Where Am I?,
usaco,2019 December,bronze3,Livestock Lineup,
usaco,2019 December,silver1,MooBuzz,
usaco,2019 December,silver2,Meetings,
usaco,2019 December,silver3,Milk Visits,
usaco,2019 December,gold1,Milk Pumping,
usaco,2019 December,gold2,Milk Visits,
usaco,2019 December,gold3,Moortal Cowmbat,
usaco,2019 December,platinum1,Greedy Pie Eaters,
usaco,2019 December,platinum2,Bessie's Snow Cow,
usaco,2019 December,platinum3,Tree Depth,
usaco,2020 January,bronze1,Word Processor,
usaco,2020 January,bronze2,Photoshoot,
usaco,2020 January,bronze3,Race,
usaco,2020 January,silver1,Berry Picking,
usaco,2020 January,silver2,Loan Repayment,
usaco,2020 January,silver3,Wormhole Sort,
usaco,2020 January,gold1,Time is Mooney,
usaco,2020 January,gold2,Farmer John Solves 3SUM,
usaco,2020 January,gold3,Springboards,
usaco,2020 January,platinum1,Cave Paintings,
usaco,2020 January,platinum2,Non-Decreasing Subsequences,
usaco,2020 January,platinum3,Falling Portals,
usaco,2020 February,bronze1,Triangles,
usaco,2020 February,bronze2,Mad Scientists,
usaco,2020 February,bronze3,Swapity Swap,
usaco,2020 February,silver1,Swapity Swapity Swap,
usaco,2020 February,silver2,Triangles,
usaco,2020 February,silver3,Clock Tree,
usaco,2020 February,gold1,Timeline,
usaco,2020 February,gold2,Help Yourself,
usaco,2020 February,gold3,Delegation,
usaco,2020 February,platinum1,Delegation,
usaco,2020 February,platinum2,Equilateral Triangle,
usaco,2020 February,platinum3,Help Yourself,
usaco,2020 Open,bronze1,Social Distancing I,
usaco,2020 Open,bronze2,Social Distancing II,
usaco,2020 Open,bronze3,Cowntact Tracing,
usaco,2020 Open,silver1,Social Distancing,
usaco,2020 Open,silver2,Cereal,
usaco,2020 Open,silver3,The Moo Particle,
usaco,2020 Open,gold1,Haircut,
usaco,2020 Open,gold2,Favorite Colors,
usaco,2020 Open,gold3,Exercise,
usaco,2020 Open,platinum1,Sprinklers 2: Return of the Alfafa,
usaco,2020 Open,platinum2,Exercise,
usaco,2020 Open,platinum3,Circus,
usaco,2020 December,bronze1,Do You Know Your ABCs?,
usaco,2020 December,bronze2,Daisy Chains,
usaco,2020 December,bronze3,Stuck in a Rut,
usaco,2020 December,silver1,Cowntagion,
usaco,2020 December,silver2,Rectangular Pasture,
usaco,2020 December,silver3,Stuck in a Rut,
usaco,2020 December,gold1,Replication,
usaco,2020 December,gold2,Bovine Genetics,
usaco,2020 December,gold3,Square Pasture,
usaco,2020 December,platinum1,Sleeping Cows,
usaco,2020 December,platinum2,Spaceship,
usaco,2020 December,platinum3,Cowmistry,
usaco,2021 January,bronze1,Uddered but not Herd,
usaco,2021 January,bronze2,Even More Odd Photos,
usaco,2021 January,bronze3,Just Stalling,
usaco,2021 January,silver1,Dance Mooves,
usaco,2021 January,silver2,No Time to Paint,
usaco,2021 January,silver3,Spaced Out,
usaco,2021 January,gold1,Uddered but not Herd,
usaco,2021 January,gold2,Telephone,
usaco,2021 January,gold3,Dance Mooves,
usaco,2021 January,platinum1,Sum of Distances,
usaco,2021 January,platinum2,Minimum Cost Paths,
usaco,2021 January,platinum3,Paint by Letters,
usaco,2021 February,bronze1,Year of the Cow,
usaco,2021 February,bronze2,Comfortable Cows,
usaco,2021 February,bronze3,Clockwise Fence,
usaco,2021 February,silver1,Comfortable Cows,
usaco,2021 February,silver2,Year of the Cow,
usaco,2021 February,silver3,Just Green Enough,
usaco,2021 February,gold1,Stone Game,
usaco,2021 February,gold2,Modern Art 3,
usaco,2021 February,gold3,Count the Cows,
usaco,2021 February,platinum1,No Time to Dry,
usaco,2021 February,platinum2,Minimizing Edges,
usaco,2021 February,platinum3,Counting Graphs,
usaco,2021 Open,bronze1,Acowdemia I,
usaco,2021 Open,bronze2,Acowdemia II,
usaco,2021 Open,bronze3,Acowdemia III,
usaco,2021 Open,silver1,Maze Tac Toe,
usaco,2021 Open,silver2,Do You Know Your ABCs?,
usaco,2021 Open,silver3,Acowdemia,
usaco,2021 Open,gold1,United Cows of Farmer John,
usaco,2021 Open,gold2,Portals,
usaco,2021 Open,gold3,Permutation,
usaco,2021 Open,platinum1,United Cows of Farmer John,
usaco,2021 Open,platinum2,Routing Schemes,
usaco,2021 Open,platinum3,Balanced Subsets,
`;

let text2 = `Hackerrank,Count Luck,https://www.hackerrank.com/challenges/count-luck/problem
SPOJ,CWC 2015,https://www.spoj.com/problems/CWC2015/
Google Kickstart,2020 Allocation,https://codingcompetitions.withgoogle.com/kickstart/round/000000000019ffc7/00000000001d3f56
Google Kickstart,2020 Plates,https://codingcompetitions.withgoogle.com/kickstart/round/000000000019ffc7/00000000001d40bb
code forces,Angry Student,https://codeforces.com/problemset/problem/1287/A
code forces,alternating subsequence,https://codeforces.com/problemset/problem/1343/C
SPOJ,busyman,https://www.spoj.com/problems/BUSYMAN/
SPOJ,ADAQUEUE,https://www.spoj.com/problems/ADAQUEUE/
SPOJ,STPAR,https://www.spoj.com/problems/STPAR/
SPOJ,ANARC09A,https://www.spoj.com/problems/ANARC09A/
SPOJ,minstack,https://www.spoj.com/problems/MINSTACK/
SPOJ,ONP,https://www.spoj.com/problems/ONP/
Google Kickstart,Robot Path Decoding,https://codingcompetitions.withgoogle.com/kickstart/round/000000000019ffc8/00000000002d83dc
Hackerrank,Stone Division,https://www.hackerrank.com/challenges/stone-division-2/problem
code forces,Vacation,http://codeforces.com/problemset/problem/698/A
Hackerrank,Password Cracker,https://www.hackerrank.com/challenges/password-cracker/problem
Hackerrank,Coin Change,https://www.hackerrank.com/challenges/coin-change/problem
Hackerrank,Max Sub Array,https://www.hackerrank.com/challenges/maxsubarray/problem
SPOJ,HOTELS,https://www.spoj.com/problems/HOTELS/
SPOJ,CRANS04,https://www.spoj.com/problems/CRAN04/
SPOJ,Arraysub,https://www.spoj.com/problems/ARRAYSUB/
SPOJ,Alien,https://www.spoj.com/problems/ALIEN/
Leetcode,,https://leetcode.com/problems/minimum-window-substring/
code forces,Books,https://codeforces.com/contest/279/problem/B
code forces,Cellular Network,https://codeforces.com/contest/702/problem/C
code forces,They're Everywhere,https://codeforces.com/problemset/problem/701/C
code forces,Garland,https://codeforces.com/problemset/problem/814/C
SPOJ,EKO,https://www.spoj.com/problems/EKO/
code forces,Good Subarrays,https://codeforces.com/contest/1398/problem/C
SPOJ,PT07Y,
SPOJ,CAM5,
SPOJ,ADASEA,
SPOJ,LASTSHOT,
Hackerrank,BFS Short Reach,https://www.hackerrank.com/challenges/bfsshortreach/problem
Hackerrank,Torque and dev,https://www.hackerrank.com/challenges/torque-and-development/problem
SPOJ,BENEFACT,
SPOJ,MICEMAZE,
SPOJ,HIGHWAYS,
SPOJ,GCPC11J,`;

export default function Add() {
  function submit2() {
    console.clear();
    let ar = [];

    text2
      .split("\n")
      //.slice(30, 40)
      .filter((x) => x)
      .forEach((line, i) => {
        let t = line.split(",");
        let obj = {
          site: t[0],
          name: t[1],
          link: t[2],
          date: new Date()
        };
        ar.push(addDoc(collection(fstore, "usaco_questions"), obj));
      });

    Promise.all(ar).then((results) => {
      console.log(results.map((r) => r.id));
    });
  }

  function submit() {
    console.clear();
    let ar = [];

    text
      .split("\n")
      // .slice(0, 100)
      .filter((x) => x)
      .forEach((line, i) => {
        let t = line.split(",");
        let obj = {
          site: t[0],
          sub_cat: t[2],
          name: t[1] + " " + t[3],
          level: t[2].substr(0, t[2].length - 1),
          date: new Date()
        };
        ar.push(addDoc(collection(fstore, "usaco_questions"), obj));
      });

    Promise.all(ar).then((results) => {
      console.log(results.map((r) => r.id));
    });
  }

  return (
    <div className="App">
      <button onClick={submit2}>submit</button>
    </div>
  );
}
