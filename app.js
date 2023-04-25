require("dotenv").config({})
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(express.json());
app.use(cors())
app.use(morgan("tiny"))

const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Todo = mongoose.model('Todo', todoSchema);

app.get('/todos', async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

app.post('/todos', async (req, res) => {
    const { text } = req.body;
    const todo = new Todo({ text });
    await todo.save();
    res.json(todo);
});

app.put('/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    const todo = await Todo.findByIdAndUpdate(id, { text }, { new: true });
    res.json(todo);
});

app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;
    await Todo.findByIdAndDelete(id);
    res.sendStatus(204);
});

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB CONNECTED");

        app.on("error", (err) => {
            console.log("ERROR: ", err);
            throw err;
        });

        const onListening = () => {
            console.log(`Listening on ${process.env.PORT}`);
        };

        app.listen(process.env.PORT, onListening);
    } catch (err) {
        console.log("ERROR ", err);
        // throw err;
    }
})();