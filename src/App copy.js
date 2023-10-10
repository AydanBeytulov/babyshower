import "./App.css";
import Cookies from "universal-cookie";
import { useRef, useState, useEffect } from "react";
import { firestore } from "./firebase";
import { addDoc, collection, getDocs } from "@firebase/firestore";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function App() {
  const cookies = new Cookies();
  const cookieID = "voted7";

  const nameRef = useRef();

  const [voted, setVoted] = useState(cookies.get(cookieID));
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [boyVotes, setBoyVotes] = useState(0);
  const [girlVotes, setGirlVotes] = useState(0);

  const [boyPercents, setBoyPercents] = useState(50);
  const [girlPercents, setGirlPercents] = useState(50);

  async function getVotes() {
    const votesCol = collection(firestore, "votes");
    const votesSnapshot = await getDocs(votesCol);
    const votesList = votesSnapshot.docs.map((doc) => doc.data());
    return votesList;
  }

  const calculateVotes = () => {

    getVotes().then(function (response) {
      let bVotes = 0;
      let gVotes = 0;
      let tVotes = [];
      for (var key of Object.keys(response)) {
        if (response[key]) {
          tVotes.push(response[key]);

          if (response[key]["value"]) {
            if (response[key]["value"] === "b") {
              bVotes++;
            }

            if (response[key]["value"] === "g") {
              gVotes++;
            }
          }
        }
      }

      setBoyVotes(bVotes);
      setGirlVotes(gVotes);
      setVotes(tVotes);
      let total = bVotes + gVotes;

      let perce = bVotes / total;
      let percent = Math.round(perce * 100);

      setBoyPercents(percent);
      setGirlPercents(100 - percent);
    });
  };


  const voteBoy = () => {
    if (!nameRef.current.value) {
      // error
      return;
    }

    if (
      window.confirm(nameRef.current.value + " потвърдете гласа си за МОМЧЕ.")
    ) {
      vote("b");
    }
  };

  const voteGirl = () => {
    if (!nameRef.current.value) {
      // error
      return;
    }

    if (
      window.confirm(nameRef.current.value + " потвърдете гласа си за МОМИЧЕ.")
    ) {
      vote("g");
    }
  };

  const vote = (value) => {
    if (loading) {
      return;
    }

    setLoading(true);

    const ref = collection(firestore, "votes");
    try {
      addDoc(ref, {
        value: value,
        name: nameRef.current.value,
      });

      setVoted(true);
      cookies.set(cookieID, true);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateVotes();

    const interval = setInterval(() => {
      calculateVotes();
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  const VotesTable = () => {

    if (!loading && !voted) {
      return null;
    }

    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Име</TableCell>
              <TableCell align="right">Глас</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {votes.map((voteV, i) => (
              <TableRow
                key={i}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {voteV.name}
                </TableCell>
                <TableCell align="right">
                  {voteV.value === "b" ? "Момче" : ""}
                  {voteV.value === "g" ? "Момиче" : ""}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div className="App">
      <div
        className="container"
        id="voting-box"
        style={{ gridTemplateColumns: girlPercents + "% " + boyPercents + "%" }}
      >
        <div className="left">
          <div className="text">
            <span className="option-size" id="size-one">
              {girlVotes} гласа
            </span>
            <br />
            <span className="option-title" id="option-one">
              {girlPercents}%
            </span>
          </div>
        </div>
        <div className="right">
          <div className="text">
            <span className="option-size" id="size-two">
              {boyVotes} гласа
            </span>
            <br />
            <span className="option-title" id="option-two">
              {boyPercents} %
            </span>
          </div>
        </div>
      </div>
      {!loading && !voted &&
        <div>
             <div className="input_holder">
          <input
            id="outlined-basic"
            label="Outlined"
            ref={nameRef}
            variant="outlined"
          />
        </div>
        <div className="vote_holder">
          <div className="vote">
            <div className="girl" onClick={voteBoy}>
              <img alt="" src="https://www.pngmart.com/files/23/Baby-Boy-PNG-Clipart.png"></img>
            </div>
            <div className="boy" onClick={voteGirl}>
              <img alt=""  src="https://w7.pngwing.com/pngs/636/740/png-transparent-baby-shower-infant-child-hello-girl-child-heart-toddler.png"></img>
            </div>
          </div>
        </div>
        </div>
      }
   

      <VotesTable />
    </div>
  );
}

export default App;
