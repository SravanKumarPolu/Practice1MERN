import { useEffect, useState } from "react";
import "./App.css";

interface Member {
  id: string;
  name: string;
  work: string;
}

function App() {
  const [members, setMembers] = useState<Member[]>([]);
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
  const deleteClick = async (id: string) => {
    try {
      await fetch(API_URL + `api/todoapp/DeleteNotes?id=${id}`, {
        method: "DELETE",
      });
      refreshMembers();
    } catch (error) {
      console.error("Error delete note:", error);
    }
  };
  return (
    <>
      <h2 className="font-semibold text-3xl py-5 text-center">FAMILY Info</h2>

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
