const express = require('express');
const Mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { resolve } = require('path');
const User = require("./schema")
require("dotenv").config();

const app = express();
const port = 3010;
const URI = process.env.URI;

app.use(express.static('static'));
app.use(express.json())

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

Mongoose.connect(URI)
.then(()=>{
  console.log("Database connected successfully")
  app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`)
  })
})
.catch((err)=>{
  console.log(`Error ${err}`)
});

app.get("/getUserDetails", async (req,res)=>{
  const userData = await User.find();
  res.status(200).json({
    Message: "All user data",
    Data: userData
  })
})

app.post("/postUserdetails", async (req,res)=>{
  try{
    const {name, mail, password} = req.body;

    if(!name || !mail || !password){
      res.status(400).json({
        Message: "All fields are required !"
      })
    } 

    const saltRound = 12;
    const hashedPassword = await bcrypt.hash(password, saltRound);

    const newUser = new User({
      name:name, mail:mail, password:hashedPassword
    });
    await newUser.save();
    res.status(201).json({
      Message: "New user added"
    })
  }
  catch(err){
    res.status(500).json({
      Message: "Error !",
      Error: err
    })
  }
})

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });
