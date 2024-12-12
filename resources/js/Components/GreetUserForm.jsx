import React, { useState } from "react";

const GreetUserForm = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8008/greet-user/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message); // Display the message from Django
        //Insert database store
        
      } else {
        setMessage(result.error || "An error occurred.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("Failed to fetch message.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Enter your name:
          <input
            type="text"
            value={name}
            onChange={handleChange}
            placeholder="Your Name"
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      <h1>{message}</h1>
    </div>
  );
};

export default GreetUserForm;
