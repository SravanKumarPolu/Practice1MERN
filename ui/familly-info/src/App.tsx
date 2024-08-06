import { useEffect, useState } from "react";
import "./App.css";

interface Member {
  id: string;
  name: string;
  work: string;
}

function App() {
  const [members, setMembers] = useState<Member[]>([]);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberWork, setNewMemberWork] = useState("");
  const API_URL = "http://localhost:5038/";

  useEffect(() => {
    refreshMembers();
  }, []);

  const refreshMembers = async () => {
    try {
      const response = await fetch(API_URL + "api/familly/GetInfo");
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error("Error fetching familly:", error);
    }
  };
  const addClick = async () => {
    try {
      await fetch(API_URL + "api/familly/AddMembers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newMemberName,
          work: newMemberWork,
        }),
      });
      refreshMembers();
      setNewMemberName("");
      setNewMemberWork("");
    } catch (error) {
      console.error("Error adding Employee:", error);
    }
  };
  const deleteClick = async (id: string) => {
    try {
      await fetch(API_URL + `api/familly/DeleteMembers?id=${id}`, {
        method: "DELETE",
      });
      refreshMembers();
    } catch (error) {
      console.error("Error delete member:", error);
    }
  };
  return (
    <>
      <h2 className="font-semibold text-3xl py-5 text-center">FAMILY Info</h2>

      <div className="flex flex-col md:flex-row gap-5 items-center justify-center text-center w-full">
        <input
          className="w-full md:w-80 px-2 py-1 text-black rounded-sm shadow-md"
          id="newMemberName"
          placeholder="Name..."
          type="text"
          onChange={(e) => setNewMemberName(e.target.value)}
        />
        <input
          className="w-full md:w-80 px-2 py-1 text-black rounded-sm shadow-md"
          id="newMemberWork"
          placeholder="Work..."
          type="text"
          onChange={(e) => setNewMemberWork(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600 shadow-sm"
          onClick={addClick}>
          + Add Member
        </button>
      </div>

      {members.map((member) => (
        <div
          key={member.id}
          className="flex text-lg flex-col md:flex-row items-center justify-center text-center gap-5 w-full">
          <span>{member.name}</span>
          <span>{member.work}</span>

          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:bg-red-600  shadow-sm"
            onClick={() => deleteClick(member.id)}>
            Delete
          </button>
        </div>
      ))}
    </>
  );
}

export default App;
