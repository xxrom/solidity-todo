import { useState, useEffect } from "react";
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
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Auto login, if already connected before
    connectWallet();
  }, []);
  useEffect(() => {
    if (isUserLoggedIn) {
      getAllTasks();
    }
  }, [isUserLoggedIn]);

  // Calls Metamask to connect wallet on clicking Connect Wallet button
  const connectWallet = async () => {
    try {
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
        console.log("You are not connected to the Goerly testNet!");
        alert("You are not connected to the Goerly testNet!");
        setCorrectNetwork(false);

        return;
      } else {
        setCorrectNetwork(true);
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log(`Found account[0]: ${accounts[0]}`);
      // Using first one that we found (we could find more =)
      setCurrentAccount(accounts[0]);
      setIsUserLoggedIn(true);
    } catch (error) {
      console.log(error);
    }
  };

  // Just gets all the tasks from the contract
  const getAllTasks = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        // passing metaMask to WebProvider
        const provider = new ethers.providers.Web3Provider(ethereum);
        // Who just signed Metamask connection to site
        const signer = provider.getSigner();

        // TaskContract will contain all methods for todo app (add/del/getMyTasks)
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );

        const allTasks = await TaskContract.getMyTasks();

        setTasks(allTasks);
      } else {
        console.warn("ethereum object doesnot exist");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Add tasks from front-end onto the blockchain
  const addTask = async (e) => {
    e.preventDefault(); // avoid refresh page buy default

    let task = {
      taskText: input,
      isDeleted: false,
    };

    try {
      // ethereum - metaMask
      const { ethereum } = window;
      if (ethereum) {
        // passing metaMask to WebProvider
        const provider = new ethers.providers.Web3Provider(ethereum);
        // Who just signed Metamask connection to site
        const signer = provider.getSigner();
        /*
         * TaskContract will contain all methods for todo app (add/del/getMyTasks)
         * All methods will be promis
         */
        const TaskContract = new ethers.Contract(
          // our specific contract hash address that we generated
          TaskContractAddress,
          // Our ABI that we generated
          TaskAbi.abi,
          // User (hash?) for filtering tasks from blockchain
          signer
        );

        TaskContract.addTask(task.taskText, task.isDeleted)
          .then(() => {
            setTasks((tasks) => [...tasks, task]);
            console.log("Added task", task);
            setInput("");
          })
          .catch((err) => {
            console.warn(`Contract.addTask Error`, err);
          });
      } else {
        console.warn("ethereum does not exist");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // Remove tasks from front-end by filtering it out on our "back-end" / blockchain smart contract
  const deleteTask = (taskId) => async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        // passing metaMask to WebProvider
        const provider = new ethers.providers.Web3Provider(ethereum);
        // Who just signed Metamask connection to site
        const signer = provider.getSigner();

        // TaskContract will contain all methods for todo app (add/del/getMyTasks)
        const TaskContract = new ethers.Contract(
          TaskContractAddress,
          TaskAbi.abi,
          signer
        );

        const deletedTask = await TaskContract.deleteTask(taskId, true);
        console.log("Deleted task res: ", deletedTask);

        getAllTasks();
      } else {
        console.warn("ethereum object doesnot exist");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-[#97b5fe] h-screen w-screen flex justify-center py-6">
      {!isUserLoggedIn ? (
        <ConnectWalletButton connectWallet={connectWallet} />
      ) : correctNetwork ? (
        <TodoList
          input={input}
          setInput={setInput}
          addTask={addTask}
          getAllTasks={getAllTasks}
          deleteTask={deleteTask}
          tasks={tasks}
        />
      ) : (
        <WrongNetworkMessage />
      )}
    </div>
  );
};

export default Home;
