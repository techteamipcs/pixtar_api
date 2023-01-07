const express = require('express');
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors     = require("cors");
const path  = require('path');
var https = require('https');
var fs = require('fs');
dotenv.config();

var options = {
   key: fs.readFileSync('../../ssl/privatekey.key'),
   cert: fs.readFileSync('../../ssl/certificate.pem')
};

// Connect to db

mongoose.connect(process.env.DB_CONNECT, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },(err) => {
    if(err) {
      console.log('connection err', err);
    } else {
      console.log('Database connected');
    }
});

// import routes
const userRoutes    = require("./routes/others/user");
const homeRoutes    = require("./routes/home/home");
const blogRoutes    = require("./routes/blog/blog");
const commentRoutes = require("./routes/comment/comment");
const careerRoutes  = require("./routes/career/career");
const projectRoutes  = require("./routes/project/project");
const businesscardRoutes  = require("./routes/business-card/business-card");

app.use(express.json());
app.use(cors());
app.use("/api/users",userRoutes);
app.use("/api/home",homeRoutes);
app.use("/api/blog",blogRoutes);
app.use("/api/comment",commentRoutes);
app.use("/api/career",careerRoutes);
app.use("/api/project",projectRoutes);
app.use("/api/businesscard",businesscardRoutes);

app.use('/public/', express.static(path.join(__dirname, 'public')));

// simple route
app.get("/", (req, res) => {
  res.send(
    `<h1 style='text-align: center'>
          Wellcome to Myadmin Backend 
          <br><br>
          <b style="font-size: 182px;">😃👻</b>
      </h1>`
  );
});

https.createServer(options, app).listen(3000,() => console.log("App running in port 3000 !"));

// app.listen(3000,() => console.log("App running in port 3000 !"));
