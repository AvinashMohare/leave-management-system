// import React, { useState, useEffect } from "react";
// import { database } from "../firebase";
// import { ref, push, set, onValue } from "firebase/database";

// const CompOffRequestForm = ({ currentUserId, onRequestSubmitted }) => {
//   const [date, setDate] = useState("");
//   const [reason, setReason] = useState("");
//   const [approvalFrom, setApprovalFrom] = useState("");
//   const [isHalfDay, setIsHalfDay] = useState(false);
//   const [employees, setEmployees] = useState([]);
//   const [formError, setFormError] = useState("");

//   useEffect(() => {
//     // Fetch employees for the dropdown
//     const employeesRef = ref(database, "employees");
//     onValue(employeesRef, (snapshot) => {
//       const data = snapshot.val();
//       const employeeList = Object.entries(data).map(([id, employee]) => ({
//         id,
//         name: employee.name,
//       }));
//       setEmployees(employeeList);
//     });
//   }, []);

//   const validateForm = () => {
//     if (!date || !reason.trim() || !approvalFrom) {
//       setFormError("Please fill in all fields");
//       return false;
//     }
//     setFormError("");
//     return true;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     const compOffRequest = {
//       date,
//       reason: reason.trim(),
//       approvalFrom,
//       isHalfDay,
//       status: "pending",
//       timestamp: Date.now(),
//       requestedBy: currentUserId,
//     };

//     const newCompOffRequestRef = push(
//       ref(database, `compOffRequests/${currentUserId}`)
//     );

//     set(newCompOffRequestRef, compOffRequest)
//       .then(() => {
//         alert("CompOff request submitted successfully!");
//         // Reset form
//         setDate("");
//         setReason("");
//         setApprovalFrom("");
//         setIsHalfDay(false);
//         setFormError("");
//         onRequestSubmitted();
//       })
//       .catch((error) => {
//         console.error("Error submitting CompOff request:", error);
//         setFormError("Failed to submit CompOff request. Please try again.");
//       });
//   };

//   return (
//     <div className="bg-[#4cc9f0] p-4 rounded-[5px]">
//       <h2 className="text-center text-2xl font-bold mb-4">Request Comp Off</h2>
//       {formError && (
//         <div className="text-red-500 font-bold mb-2">{formError}</div>
//       )}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block mb-1">Date:</label>
//           <input
//             type="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             className="w-full p-2 rounded"
//             required
//           />
//         </div>
//         <div>
//           <label className="block mb-1">Reason:</label>
//           <textarea
//             value={reason}
//             onChange={(e) => setReason(e.target.value)}
//             className="w-full p-2 rounded resize-none"
//             rows={3}
//             required
//           />
//         </div>
//         <div>
//           <label className="block mb-1">Approval From:</label>
//           <select
//             value={approvalFrom}
//             onChange={(e) => setApprovalFrom(e.target.value)}
//             className="w-full p-2 rounded"
//             required
//           >
//             <option value="">Select an employee</option>
//             {employees.map((employee) => (
//               <option key={employee.id} value={employee.id}>
//                 {employee.name}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label className="flex items-center">
//             <input
//               type="checkbox"
//               checked={isHalfDay}
//               onChange={(e) => setIsHalfDay(e.target.checked)}
//               className="mr-2"
//             />
//             Half Day
//           </label>
//         </div>
//         <button
//           type="submit"
//           className="w-full bg-[#fb5607] text-white p-2 rounded font-bold hover:bg-[#fa4f05]"
//         >
//           Submit CompOff Request
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CompOffRequestForm;

import React, { useState, useEffect } from "react";
import { database } from "../firebase";
import { ref, push, set, onValue } from "firebase/database";

const CompOffRequestForm = ({ currentUserId, onRequestSubmitted }) => {
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [approvalFrom, setApprovalFrom] = useState("");
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    // Fetch employees for the dropdown
    const employeesRef = ref(database, "employees");
    onValue(employeesRef, (snapshot) => {
      const data = snapshot.val();
      const employeeList = Object.entries(data).map(([id, employee]) => ({
        id,
        name: employee.name,
      }));
      setEmployees(employeeList);
    });
  }, []);

  const validateForm = () => {
    if (!date || !reason.trim() || !approvalFrom) {
      setFormError("Please fill in all fields");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const compOffRequest = {
      date,
      reason: reason.trim(),
      approvalFrom,
      isHalfDay,
      status: "pending",
      timestamp: Date.now(),
      requestedBy: currentUserId,
      seniorApproval: "pending",
      managerApproval: "pending",
    };

    const newCompOffRequestRef = push(
      ref(database, `compOffRequests/${currentUserId}`)
    );

    set(newCompOffRequestRef, compOffRequest)
      .then(() => {
        alert("CompOff request submitted successfully!");
        // Reset form
        setDate("");
        setReason("");
        setApprovalFrom("");
        setIsHalfDay(false);
        setFormError("");
        onRequestSubmitted();
      })
      .catch((error) => {
        console.error("Error submitting CompOff request:", error);
        setFormError("Failed to submit CompOff request. Please try again.");
      });
  };

  return (
    <div className="bg-[#4cc9f0] p-4 rounded-[5px]">
      <h2 className="text-center text-2xl font-bold mb-4">Request Comp Off</h2>
      {formError && (
        <div className="text-red-500 font-bold mb-2">{formError}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Reason:</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2 rounded resize-none"
            rows={3}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Approval From (Senior):</label>
          <select
            value={approvalFrom}
            onChange={(e) => setApprovalFrom(e.target.value)}
            className="w-full p-2 rounded"
            required
          >
            <option value="">Select an employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isHalfDay}
              onChange={(e) => setIsHalfDay(e.target.checked)}
              className="mr-2"
            />
            Half Day
          </label>
        </div>
        <button
          type="submit"
          className="w-full bg-[#fb5607] text-white p-2 rounded font-bold hover:bg-[#fa4f05]"
        >
          Submit CompOff Request
        </button>
      </form>
    </div>
  );
};

export default CompOffRequestForm;
