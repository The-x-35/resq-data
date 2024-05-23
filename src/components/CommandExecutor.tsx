import React, { useState } from 'react';
import './CommandExecutor.css';

const CommandExecutor: React.FC = () => {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command }),
      });
      const data = await response.json();
      setOutput(data.output);
    } catch (error) {
      setOutput('Error executing command');
    }
  };

  return (
    <div className="command-executor">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Enter command"
          required
        />
        <button type="submit">Execute</button>
      </form>
      <div className="output-box">
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default CommandExecutor;
