import { useState, useEffect } from 'react';
import { ethers, utils } from "ethers";
import abi from "./contracts/Scores.json";

function App() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [userAddress, setUserAddress] = useState(null);
  const [inputValue, setInputValue] = useState({ name: "", fee: "", sid: "", score: ""});
  const [error, setError] = useState(null);

  const contractAddress = '0x60Df54079AB03cF03e319989e9E657c77765C2da';
  const contractABI = abi.abi;

  function StudentsList(props) {
    const students = props.students;
    const listItems = students.map((student) =>
      <tr>
        <td>{student.id}</td>
        <td width="20px"></td>
        <td>{student.name} </td>
        <td width="20px"></td>
        <td>{student.score}</td>
      </tr>
    );
    return (
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <td width="20px"></td>
            <th>Name</th>
            <td width="20px"></td>
            <th>Scores</th>
          </tr>
        </thead>
        <tbody>
          {listItems}
        </tbody>
      </table>
    );
  }

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        setIsTeacher(true);
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const account = accounts[0];
        setIsWalletConnected(true);
        setUserAddress(account);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const scoresContract = new ethers.Contract(contractAddress, contractABI, signer);
        scoresContract.on("ReleaseScores", function(_balance, _value){
            console.log("got event " + _balance + ' ' + _value);
        });
        console.log("Account Connected: ", account);

      } else {
        setError("Please install a MetaMask wallet to use our bank.");
        console.log("No Metamask detected");
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [isWalletConnected])

  return (
    <main className="main-container">
      <h2 className="headline"><span className="headline-gradient">Scores Contract Project</span></h2>
      <section className="customer-section px-10 pt-5 pb-10">
        {error && <p className="text-2xl text-red-700">{error}</p>}
      </section>
      {
        isTeacher && (
          <section className="bank-owner-section">
            <h2 className="text-xl border-b-2 border-indigo-500 px-10 py-4 font-bold">Students</h2>
            <div className="p-10">
              <StudentsList students={[{"id":"0x1111111111111111111111", "name":"aaa", "score":"11"}]} />
            </div>
            <h2 className="text-xl border-b-2 border-indigo-500 px-10 py-4 font-bold">Set SCORE</h2>
              <div className="p-10">
                <form className="form-style">
                  <input
                    type="text"
                    className="input-style"
                    onChange={() => {} }
                    name="bankName"
                    placeholder="Enter ID of a student"
                    value={inputValue.sid}
                  />
                  <input
                    type="text"
                    className="input-style"
                    onChange={() => {} }
                    name="bankName"
                    placeholder="Enter score of a student"
                    value={inputValue.score}
                  />
                  <button
                    className="btn-grey"
                    onClick={ () => {} }>
                    Set score of a student
                  </button>
                </form>
              </div>
          </section>
        )
      }
    </main>
  );
}
export default App;
