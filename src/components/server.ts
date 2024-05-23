import express from 'express';
import { exec } from 'child_process';
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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
