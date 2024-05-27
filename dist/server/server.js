"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const child_process_1 = require("child_process");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 5001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post('/execute', (req, res) => {
    const { command } = req.body;
    (0, child_process_1.exec)(command, (error, stdout, stderr) => {
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
app.use((0, cors_1.default)());
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
