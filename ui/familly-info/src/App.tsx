import { useEffect, useState } from "react";
import "./App.css";

interface Member {
  id: string;
  name: string;
  work: string;
  salary: number;
  image?: string;
}

function App() {
  const [members, setMembers] = useState<Member[]>([]);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberWork, setNewMemberWork] = useState("");
  const [newMemberSalary, setNewMemberSalary] = useState("");
  const [newMemberImage, setNewMemberImage] = useState<File | null>(null);

  const [editMemberId, setEditMemberId] = useState<string | null>(null);
  const [editMemberName, setEditMemberName] = useState("");
  const [editMemberWork, setEditMemberWork] = useState("");
  const [editMemberSalary, setEditMemberSalary] = useState("");
  const [editMemberImage, setEditMemberImage] = useState<File | null>(null);
  const [editMemberImageUrl, setEditMemberImageUrl] = useState<
    string | undefined
  >(undefined);

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
      console.error("Name, Work, and Salary are required.");
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

  const editClick = (member: Member) => {
    setEditMemberId(member.id);
    setEditMemberName(member.name);
    setEditMemberWork(member.work);
    setEditMemberSalary(member.salary.toString());
    setEditMemberImageUrl(member.image);
    setEditMemberImage(null); // Reset image file input
  };

  const updateMember = async () => {
    const formData = new FormData();
    formData.append("name", editMemberName);
    formData.append("work", editMemberWork);
    formData.append("salary", editMemberSalary);
    if (editMemberImage) {
      formData.append("image", editMemberImage);
    } else if (editMemberImageUrl) {
      // If no new image, add the existing image URL to the formData
      formData.append("existingImage", editMemberImageUrl);
    }

    try {
      await fetch(API_URL + `api/familly/UpdateMembers?id=${editMemberId}`, {
        method: "PUT",
        body: formData,
      });
      refreshMembers();
      setEditMemberId(null);
      setEditMemberName("");
      setEditMemberWork("");
      setEditMemberSalary("");
      setEditMemberImage(null);
      setEditMemberImageUrl(undefined);
    } catch (error) {
      console.error("Error updating member:", error);
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
          id="newMemberSalary"
          placeholder="Salary..."
          type="number"
          value={newMemberSalary}
          onChange={(e) => setNewMemberSalary(e.target.value)}
        />
        <input
          className="w-full md:w-80 px-2 py-1 text-black rounded-sm shadow-md"
          id="newMemberImage"
          type="file"
          onChange={(e) =>
            setNewMemberImage(e.target.files ? e.target.files[0] : null)
          }
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
          {editMemberId === member.id ? (
            <>
              {editMemberImageUrl && !editMemberImage && (
                <img
                  src={`data:image/png;base64,${editMemberImageUrl}`}
                  alt={editMemberName}
                  className="w-16 h-16 rounded-full mr-4"
                />
              )}
              <input
                className="w-full md:w-80 px-2 py-1 text-black rounded-sm shadow-md"
                id="editMemberName"
                placeholder="Name..."
                type="text"
                value={editMemberName}
                onChange={(e) => setEditMemberName(e.target.value)}
              />
              <input
                className="w-full md:w-80 px-2 py-1 text-black rounded-sm shadow-md"
                id="editMemberWork"
                placeholder="Work..."
                type="text"
                value={editMemberWork}
                onChange={(e) => setEditMemberWork(e.target.value)}
              />
              <input
                className="w-full md:w-80 px-2 py-1 text-black rounded-sm shadow-md"
                id="editMemberSalary"
                placeholder="Salary..."
                type="number"
                value={editMemberSalary}
                onChange={(e) => setEditMemberSalary(e.target.value)}
              />
              <input
                className="w-full md:w-80 px-2 py-1 text-black rounded-sm shadow-md"
                id="editMemberImage"
                type="file"
                onChange={(e) =>
                  setEditMemberImage(e.target.files ? e.target.files[0] : null)
                }
              />
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:bg-green-600 shadow-sm"
                onClick={updateMember}>
                Update Member Info
              </button>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 items-center text-center sm:text-left">
                {member.image && (
                  <div className="flex justify-center items-center sm:justify-start">
                    <img
                      src={`data:image/png;base64,${member.image}`}
                      alt={member.name}
                      className="w-16 h-16 rounded-full mr-4 "
                    />
                  </div>
                )}
                <span className=" w-40 overflow-x-auto ">{member.name}</span>
                <span className="w-40 overflow-x-auto ">{member.work}</span>
                <span className="w-40 overflow-x-auto ">₹{member.salary}</span>
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 focus:outline-none focus:bg-yellow-600 shadow-sm mr-2"
                  onClick={() => editClick(member)}>
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:bg-red-600 shadow-sm"
                  onClick={() => deleteClick(member.id)}>
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </>
  );
}

export default App;
