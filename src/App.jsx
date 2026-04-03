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
  communication: "",
  collaboration: "",
  attitude: "",
  professionalism: "",
  personality: "",
  discipline: "",
  positive: "",
  negative: "",
};

export default function EvaluationApp() {
  const [rows, setRows] = useState(
    namesList.map((name) => ({ name, ...initialRow })),
  );
  const [submitted, setSubmitted] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // ✅ Active cell state
  const [activeCell, setActiveCell] = useState({ row: null, col: null });

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
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
      [
        "communication",
        "collaboration",
        "attitude",
        "professionalism",
        "personality",
        "discipline",
      ].every((field) => row[field] !== ""),
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
      formData.append(
        "communication",
        rows.map((r) => r.communication).join(","),
      );
      formData.append(
        "collaboration",
        rows.map((r) => r.collaboration).join(","),
      );
      formData.append("attitude", rows.map((r) => r.attitude).join(","));
      formData.append(
        "professionalism",
        rows.map((r) => r.professionalism).join(","),
      );
      formData.append("personality", rows.map((r) => r.personality).join(","));
      formData.append("discipline", rows.map((r) => r.discipline).join(","));
      formData.append("positive", rows.map((r) => r.positive).join(","));
      formData.append("negative", rows.map((r) => r.negative).join(","));

      await fetch(
        "https://script.google.com/macros/s/AKfycbyTXB-rIWhQ6NIcvgarsArnozgXXkr3dDY1IR5GasTtRGbnq-wllttdp6mT5NAcVqBkDw/exec",
        {
          method: "POST",
          mode: "no-cors",
          body: formData,
        },
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

  const fields = [
    "communication",
    "collaboration",
    "attitude",
    "professionalism",
    "personality",
    "discipline",
  ];

  return (
    <div className="container">
      <div className="card">
<h2 className="cool-title">Pretty Group | IE Evaluation</h2>

        <table>
          <thead>
            <tr>
              <th>Names</th>
              <th>Communication</th>
              <th>Collaboration</th>
              <th>Attitude</th>
              <th>Professionalism</th>
              <th>Personality</th>
              <th>Discipline</th>
              <th>Positive Points</th>
              <th>Negative Points</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td>{row.name}</td>

                {fields.map((field, colIndex) => (
                  <td
                    key={field}
                    className={
                      activeCell.row === i && activeCell.col === colIndex
                        ? "active-cell"
                        : activeCell.row === i
                          ? "active-row"
                          : activeCell.col === colIndex
                            ? "active-col"
                            : ""
                    }
                  >
                    <select
                      value={row[field]}
                      onFocus={() => setActiveCell({ row: i, col: colIndex })}
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

                {/* Positive */}
                <td
                  className={
                    activeCell.row === i && activeCell.col === 6
                      ? "active-cell"
                      : activeCell.row === i
                        ? "active-row"
                        : activeCell.col === 6
                          ? "active-col"
                          : ""
                  }
                >
                  <textarea
                    value={row.positive}
                    onFocus={() => setActiveCell({ row: i, col: 6 })}
                    onChange={(e) =>
                      handleChange(i, "positive", e.target.value)
                    }
                    placeholder="Write..."
                    rows={2}
                  />
                </td>

                {/* Negative */}
                <td
                  className={
                    activeCell.row === i && activeCell.col === 7
                      ? "active-cell"
                      : activeCell.row === i
                        ? "active-row"
                        : activeCell.col === 7
                          ? "active-col"
                          : ""
                  }
                >
                  <textarea
                    value={row.negative}
                    onFocus={() => setActiveCell({ row: i, col: 7 })}
                    onChange={(e) =>
                      handleChange(i, "negative", e.target.value)
                    }
                    placeholder="Write..."
                    rows={2}
                  />
                </td>
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
