import React, { useState } from "react";
import "./index.css";

const namesList = [
  "Emon: Cutting",
  "Khorshed: U-1",
  "Mashum: U-1",
  "Ahsan: U-2",
  "Murad: U-3",
  "Mahfuz: U-3",
  "Imran: U-4",
  "Sajeed: U-4",
];

const initialRow = {
  capacity: "",
  method: "",
  kaizen: "",
  punctuality: "",
  behaviour: "",
  discipline: "",
};

export default function EvaluationApp() {
  const [rows, setRows] = useState(
    namesList.map((name) => ({ name, ...initialRow }))
  );
  const [submitted, setSubmitted] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const getTotal = (row) => {
    return Object.values(row)
      .slice(1)
      .reduce((sum, val) => sum + (val === "" ? 0 : parseInt(val)), 0);
  };

  const getAverage = (row) => {
    const values = Object.values(row).slice(1).filter((v) => v !== "");
    if (!values.length) return 0;
    const sum = values.reduce((a, b) => a + parseInt(b), 0);
    return (sum / values.length).toFixed(2);
  };

  const getColor = (val) => {
    switch (parseInt(val)) {
      case 0:
        return "#ffcccc";
      case 1:
        return "#ffd6cc";
      case 2:
        return "#ffe6cc";
      case 3:
        return "#fff5cc";
      case 4:
        return "#e6ffcc";
      case 5:
        return "#ccffcc";
      default:
        return "#fff";
    }
  };

  const validateForm = () => {
    return rows.every((row) =>
      Object.values(row).slice(1).every((val) => val !== "")
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setModalMessage("⚠️ Please fill all ratings before submitting.");
      setSubmitted(true);
      return;
    }

    try {
      const formData = new URLSearchParams();
      formData.append("name", rows.map((r) => r.name).join(","));
      formData.append("capacity", rows.map((r) => r.capacity).join(","));
      formData.append("method", rows.map((r) => r.method).join(","));
      formData.append("kaizen", rows.map((r) => r.kaizen).join(","));
      formData.append("punctuality", rows.map((r) => r.punctuality).join(","));
      formData.append("behaviour", rows.map((r) => r.behaviour).join(","));
      formData.append("discipline", rows.map((r) => r.discipline).join(","));

      await fetch(
        "https://script.google.com/macros/s/AKfycbyam7S7V1uT9HzXpUsrpjMAq-vGFBTsEB58rTMsOTHwlKbi_REWU4d3pPi9uz89cuLo/exec",
        {
          method: "POST",
          mode: "no-cors",
          body: formData,
        }
      );

      setModalMessage("🎉 Your evaluation has been submitted successfully!");
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error(error);
      setModalMessage("❌ Submission failed. Please try again.");
      setSubmitted(true);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>IE Executive Evaluation</h2>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Capacity</th>
              <th>Method</th>
              <th>Kaizen</th>
              <th>Punctuality</th>
              <th>Behaviour</th>
              <th>Discipline</th>
              <th>Total</th>
              <th>Avg</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td>{row.name}</td>
                {Object.keys(initialRow).map((field) => (
                  <td key={field}>
                    <select
                      value={row[field]}
                      onChange={(e) => handleChange(i, field, e.target.value)}
                      style={{ background: getColor(row[field]) }}
                    >
                      <option value="">--</option>
                      {[0, 1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </td>
                ))}
                <td>{getTotal(row)}</td>
                <td>{getAverage(row)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <button className="btn" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>

      {/* Modal */}
      {submitted && (
        <div className="modal-overlay">
          <div className="thankyou card">
            <p>{modalMessage}</p>
            <button className="btn" onClick={() => setSubmitted(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}