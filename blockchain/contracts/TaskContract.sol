// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/*
  - values with 'memory' mark - for temporary data and
      will be removed after function call, it's cheaper to use.
  - with 'storage' mark - they will be saved betwen function calls,
      expensive to use.
*/
/*
  js object in solidity will be map or struct

  tasks = [
    { id: uint, taskText: string, isDeleted: bool }, ...
  ]
*/
/*
  Deploy - deployed contract address
  ABI
*/

contract TaskContract {
  event AddTask(address recipientAddress, uint taskId);
  event DeleteTask(uint taskId, bool isDeleted);
  /*
    js = { id: 0, taskText: 'clean', idDeleted: false}
    solidity = Task(0, 'clean', false)
  */
  struct Task {
    uint id;
    string taskText;
    bool isDeleted;
  }

  // tasks = [Task, Task, ...]; private - only in this function TaskContract
  Task[] private tasks;

  /*
    Mapping taskId to address for each task ?? by calling taskToOwner ??
    So I will see only my tasks, not others tasks.
    Mapping two maps with tasks and with owners by id
    Inner join
  */
  mapping(uint256 => address) taskToOwner;

  /*
    Function for calling it from React apps
    string ?? memory ?? taskText
    bool isDeleted
    external - function without return
  */
  function addTask(string memory taskText, bool isDeleted) external {
    uint taskId = tasks.length;
    // msg - solidity global object, sender - address to where we are sending
    address recipientAddress = msg.sender;
    tasks.push(Task(taskId, taskText, isDeleted));
    taskToOwner[taskId] = recipientAddress;
    // Execute it in real blockChain ?
    emit AddTask(recipientAddress, taskId);
  }

  /*
    Get my tasks that are mine and not deleted
    ??for external use in React??
    view - ??
    return(Task[] memory) - ??
  */
  function getMyTasks() external view returns (Task[] memory) {
    // solidity we could specify size for array (Task[2] / Task[]2 / Task[](2))
    Task[] memory temporary = new Task[](tasks.length);
    uint counter = 0;

    for (uint i = 0; i < tasks.length; i++) {
      if (taskToOwner[i] == msg.sender && tasks[i].isDeleted == false) {
        temporary[counter] = tasks[i];
        counter++;
      }
    }

    /*
      We are sending only required amount of task.
      Maybe it is cheaper to execute in blockchain then.
    */
    Task[] memory result = new Task[](counter);
    for (uint i = 0; i < counter; i++) {
      result[i] = temporary[i];
    }

    return result;
  }

  function deleteTask(uint taskId, bool isDeleted) external {
    if (taskToOwner[taskId] == msg.sender) {
      tasks[taskId].isDeleted = isDeleted;
      // Execute it in real block chain ?
      emit DeleteTask(taskId, isDeleted);
    }
  }
}
