import { useState } from "react";
import WrongNetworkMessage from "../components/WrongNetworkMessage";
import ConnectWalletButton from "../components/ConnectWalletButton";
import TodoList from "../components/TodoList";
import { TaskContractAddress } from "../config";
// Builded ABI
import TaskAbi from "../../blockchain/build/contracts/TaskContract.json";
import { ethers } from "ethers";
/* 
const tasks = [
  { id: 0, taskText: 'clean', isDeleted: false }, 
  { id: 1, taskText: 'food', isDeleted: false }, 
  { id: 2, taskText: 'water', isDeleted: true }
]
*/

const Home = () => {
  const [correctNetwork, setCorrectNetwork] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");

  // Calls Metamask to connect wallet on clicking Connect Wallet button
  const connectWallet = async () => {
    try {
      console.log(window);
      if (typeof window.ethereum === "undefined") {
        console.log("MetaMask is not installed!");
        alert("MetaMask is not installed!");
        return;
      }

      if (!window.ethereum) {
        console.log("Metamask not detected");
      }
      const { ethereum } = window;

      // get chainId like network (Goerly test network)
      let chainId = await ethereum.request({ method: "eth_chainId" });

      console.log(`Connected to chain: ${chainId}`);

      const goerlyChainId = "0x5";

      if (chainId !== goerlyChainId) {
        console.log("You are not connected to the Goerly tesetnet!");
        alert("You are not connected to the Goerly testnet!");
        setCorrectNetwork(false);
        return;
      } else {
        setCorrectNetwork(true);
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log(`Found account ${accounts[0]}`);
      setCurrentAccount(accounts[0]);
      setIsUserLoggedIn(true);
    } catch (error) {
      console.log(error);
    }
  };

  // Just gets all the tasks from the contract
  const getAllTasks = async () => {};

  // Add tasks from front-end onto the blockchain
  const addTask = async (e) => {};

  // Remove tasks from front-end by filtering it out on our "back-end" / blockchain smart contract
  const deleteTask = (key) => async () => {};

  return (
    <div className="bg-[#97b5fe] h-screen w-screen flex justify-center py-6">
      {!isUserLoggedIn ? (
        <ConnectWalletButton connectWallet={connectWallet} />
      ) : "is this the correct network?" ? (
        <TodoList />
      ) : (
        <WrongNetworkMessage />
      )}
    </div>
  );
};

export default Home;
