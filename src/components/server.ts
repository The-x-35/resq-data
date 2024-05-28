import express from 'express';
import { exec, spawn } from 'child_process';
import cors from 'cors';

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

app.post('/execute', (req, res) => {
  const { command } = req.body;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.json({ output: `Error: ${error.message}` });
    }
    if (stderr) {
      return res.json({ output: `Stderr: ${stderr}` });
    }
    res.json({ output: stdout });
  });
});

app.post('/execute-stream', (req, res) => {
  const { command } = req.body;
  const process = spawn(command, { shell: true });

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  process.stdout.on('data', (data) => {
    res.write(data.toString());
  });

  process.stderr.on('data', (data) => {
    res.write(data.toString());
  });

  process.on('close', (code) => {
    res.end(`\nProcess exited with code ${code}`);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
