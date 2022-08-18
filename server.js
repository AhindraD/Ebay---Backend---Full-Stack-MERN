const express = require('express');
const mongoose = require('mongoose');

const DB_URL = "mongodb+srv://apptest:apptest1234@cluster0.1u9xnky.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(DB_URL, {
    useUnifiedTopology: true,
    useNewURLParser: true,
})
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log(err))

//All routes import
const authRouter = require('./routes/auth');
const app = express();

//MIddleWare usage
app.use(express.json());

//Router related usage
app.use('/auth', authRouter);


app.listen(8000);