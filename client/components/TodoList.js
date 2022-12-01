import Navbar from "./Navbar";
import Task from "./Task";
import { IoMdAddCircle } from "react-icons/io";

const TodoList = ({ tasks = [], input, addTask, setInput, deleteTask }) => (
  <div className="w-[70%] bg-[#354ea3] py-4 px-9 rounded-[30px] overflow-y-scroll">
    <Navbar />
    <h2 className="text-4xl bolder text-white pb-8">
      What&apos;s up, Nikita!!!
    </h2>
    <div className="py-3 text-[#7d99e9]">TODAY&apos;S TASKS</div>
    <form className="flex items-center justify-center">
      <input
        className="rounded-[10px] w-full p-[10px] border-none outline-none bg-[#031956] text-white mb-[10px]"
        placeholder="Add a task for today..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        // take input from the form here
      />
      <IoMdAddCircle
        // Add an onClick method
        onClick={addTask}
        className="text-[#ea0aff] text-[50px] cursor-pointer ml-[20px] mb-[10px]"
      />
    </form>
    <ul>
      {tasks?.map((task, index) =>
        task?.isDeleted ? null : (
          <Task
            text={task?.taskText}
            key={`${index}${task?.id}`}
            handleDelete={deleteTask(task?.id)}
          />
        )
      )}
    </ul>
  </div>
);

export default TodoList;
