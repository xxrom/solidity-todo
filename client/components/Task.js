import { BsFillTrashFill } from "react-icons/bs";

const Task = ({ text, handleDelete }) => {
  return (
    <div className="flex items-center text-white">
      <div className=" bg-[#031956] text-[#b6c7db] flex w-[70%] rounded-[15px] mb-[10px] flex-1">
        <div className="flex items-center justify-between w-full p-[20px] text-xl">
          {text}
        </div>
      </div>
      <BsFillTrashFill
        onClick={handleDelete}
        className="text-2xl cursor-pointer ml-3 mr-3"
      />
    </div>
  );
};

export default Task;
