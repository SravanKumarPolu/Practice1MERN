import { useEffect, useState } from "react";
import "./App.css";

interface Member {
  id: string;
  name: string;
  work: string;
  salary: number;
  image?: string; // Optional image field
}

function App() {
  const [members, setMembers] = useState<Member[]>([]);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberWork, setNewMemberWork] = useState("");
  const [newMemberSalary, setNewMemberSalary] = useState("");
  const [newMemberImage, setNewMemberImage] = useState<File | null>(null);
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
      console.error("Error fetching family:", error);
    }
  };

  const addClick = async () => {
    if (!newMemberName || !newMemberWork || !newMemberSalary) {
      console.error("Name and Work are required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", newMemberName);
    formData.append("work", newMemberWork);
    formData.append("salary", newMemberSalary);
    if (newMemberImage) {
      formData.append("image", newMemberImage);
    }

    try {
      const response = await fetch(API_URL + "api/familly/AddMembers", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      refreshMembers();
      setNewMemberName("");
      setNewMemberWork("");
      setNewMemberSalary("");
      setNewMemberImage(null);
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const deleteClick = async (id: string) => {
    try {
      await fetch(`${API_URL}api/familly/DeleteMembers?id=${id}`, {
        method: "DELETE",
      });
      refreshMembers();
    } catch (error) {
      console.error("Error deleting member:", error);
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
          value={newMemberName}
          onChange={(e) => setNewMemberName(e.target.value)}
        />
        <input
          className="w-full md:w-80 px-2 py-1 text-black rounded-sm shadow-md"
          id="newMemberWork"
          placeholder="Work..."
          type="text"
          value={newMemberWork}
          onChange={(e) => setNewMemberWork(e.target.value)}
        />
        <input
          className="w-full md:w-80 px-2 py-1 text-black rounded-sm shadow-md"
          id="newMemberImage"
          type="file"
          onChange={(e) =>
            setNewMemberImage(e.target.files ? e.target.files[0] : null)
          }
        />
        <input
          className="w-full md:w-80 px-2 py-1 text-black rounded-sm shadow-md"
          id="newMemberSalary"
          placeholder="Salary..."
          type="number"
          value={newMemberSalary}
          onChange={(e) => setNewMemberSalary(e.target.value)}
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
          className="flex text-lg flex-col md:flex-row items-center justify-center text-center gap-5 w-full border-b py-2">
          {member.image && (
            <img
              src={`data:image/png;base64,${member.image}`}
              alt={member.name}
              className="w-16 h-16 rounded-full"
            />
          )}
          <span>{member.name}</span>
          <span>{member.work}</span>
          <span>{member.salary}</span>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:bg-red-600 shadow-sm"
            onClick={() => deleteClick(member.id)}>
            Delete
          </button>
        </div>
      ))}
    </>
  );
}

export default App;
