import "./App.css";
import Cookies from "universal-cookie";
import { useState, useEffect } from "react";
import { firestore } from "./firebase";
import { addDoc, collection, getDocs } from "@firebase/firestore";

import boy from "./images/boy.png"
import girl from "./images/girl.png"

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from '@mui/material/TextField';

function App() {

  
  const cookies = new Cookies();
  const cookieID = "voted9";

  const [voted, setVoted] = useState(cookies.get(cookieID));
  const [votes, setVotes] = useState([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const [boyVotes, setBoyVotes] = useState(0);
  const [girlVotes, setGirlVotes] = useState(0);

  const [boyPercents, setBoyPercents] = useState(50);
  const [girlPercents, setGirlPercents] = useState(50);

  const [nameError, setNameError] = useState(false);

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
          tVotes.unshift(response[key]);

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
    if (!name) {
      setNameError(true)
      return;
    }
    setNameError(false)
    if (
      window.confirm(name + " потвърдете гласа си за МОМЧЕ.")
    ) {
      vote("b");
    }
  };

  const voteGirl = () => {
    if (!name) {
      setNameError(true)
      return;
    }

    setNameError(false)

    if (
      window.confirm(name + " потвърдете гласа си за МОМИЧЕ.")
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
        name: name,
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
     // calculateVotes();
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  const VotesTable = () => {

    if (!loading && !voted) {
      return null;
    }

    return (
      <div className="table-holder">
        <TableContainer component={Paper}>
        <Table  aria-label="simple table">
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
                <TableCell >
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
      </div>
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
            <span className="option-title" >
              {girlPercents}% <br />
              {girlVotes} гласа
            </span>
          </div>
        </div>
        <div className="right">
          <div className="text">
            <span className="option-title">
              {boyPercents} % <br />
              {boyVotes} гласа
            </span>
          </div>
        </div>
      </div>

      {!loading && !voted && 
      
      <div className="voting-holder">
        <div className="vote-here">Гласувай тук:</div>
        <TextField className="voting-name" error={nameError} onChange={(e) => {setName(e.target.value)}} label="Име на гласуващия" variant="filled" helperText="Напишете Вашето име."/>
      
        <div className="vote">
            <div className="boy" onClick={voteBoy}> 
              <img alt="" src={boy}></img>
            </div>
            <div className="girl" onClick={voteGirl}>
              <img alt=""  src={girl}></img>
            </div>
          </div>
       </div>
        
      }


<VotesTable />
    </div>
  );
}

export default App;
