import React, { useState, useEffect } from "react";
import { database } from "../firebase";
import { ref, onValue, update } from "firebase/database";

const PendingApprovals = ({ currentUserId }) => {
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    // Fetch pending requests where seniorApproval is "pending"
    const requestsRef = ref(database, "compOffRequests");
    onValue(requestsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const pending = Object.entries(data).flatMap(([userId, userRequests]) =>
          Object.entries(userRequests)
            .filter(
              ([_, request]) =>
                request.approvalFrom === currentUserId &&
                request.seniorApproval === "pending" // Only show pending approvals
            )
            .map(([requestId, request]) => ({
              id: requestId,
              userId,
              ...request,
            }))
        );
        setPendingRequests(pending);
      }
    });
  }, [currentUserId]);

  const handleApproval = (requestId, userId, approved) => {
    const requestRef = ref(database, `compOffRequests/${userId}/${requestId}`);
    update(requestRef, {
      seniorApproval: approved ? "approved" : "rejected", // Update seniorApproval to approved/rejected
      approvedBy: currentUserId,
      approvalTimestamp: Date.now(),
    })
      .then(() => {
        alert(`Request ${approved ? "approved" : "rejected"} successfully!`);
      })
      .catch((error) => {
        console.error("Error updating request:", error);
        alert("Failed to update request. Please try again.");
      });
  };

  return (
    <div className="bg-[#e4c1f9] p-4 rounded-[5px] mt-4">
      <h2 className="text-center text-2xl font-bold mb-4">Pending Approvals</h2>
      {pendingRequests.length === 0 ? (
        <p className="text-center">No pending requests</p>
      ) : (
        <ul className="space-y-4">
          {pendingRequests.map((request) => (
            <li key={request.id} className="bg-white p-4 rounded shadow">
              <p>
                <strong>Date:</strong>{" "}
                {new Date(request.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Reason:</strong> {request.reason}
              </p>
              <p>
                <strong>Half Day:</strong> {request.isHalfDay ? "Yes" : "No"}
              </p>
              <p>
                <strong>Requested By:</strong> {request.requestedBy}
              </p>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() =>
                    handleApproval(request.id, request.userId, true)
                  }
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() =>
                    handleApproval(request.id, request.userId, false)
                  }
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PendingApprovals;
