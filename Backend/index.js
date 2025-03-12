require('dotenv').config()
const express = require('express')
const cors = require('cors')
const routes = require('./routes/Routes')

const app = express()

app.use(express.json());
app.use(cors());
app.use("/api/route",routes)



app.listen(5000, () => console.log("Server running on port 5000"));