const mongoose = require("mongoose");
const shortUrl = require("./models/shortUrl");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const express = require("express");
const shortid = require("shortid");


dotenv.config({path:".env"});
connectDB();

const app = express();
 

//used to parse the json object
app.use(bodyParser.json());

//used to parse the strings passed from url
app.use(express.urlencoded({extended: false}))


//used when html need to communicate with backend without react
app.set("view engine","ejs")

app.use(express.static(__dirname + '/public'));


app.post("/removeUrl", async (req, res) => {
    const { name } = req.body;
  
    try {
      const reqUrl = await shortUrl.findOne({ shortId: name });
  
      if (reqUrl === null) {
        console.log("Link not found");
      } else {
        // Use await without the callback
        await shortUrl.deleteOne({ shortId: reqUrl.shortId });
  
        console.log("Item deleted");
      }
  
      res.redirect("/");
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
    }
  });
  
app.get('/',async(req,res)=>{
    const shortAllUrls = await shortUrl.find({});

    res.render('index',{allUrls: shortAllUrls})
})

app.post("/shortUrls", async(req,res)=>{
    const shortId = shortid.generate();
    await shortUrl.create({
        shortId: shortId,
        redirectURL: req.body.myUrl,
        visitHistory: []
    });

    res.redirect("/");
})


app.get("/:customUrl",async (req,res)=>{
 const shortId = req.params.customUrl;
  const entry = await shortUrl.findOneAndUpdate(
    {
      shortId: shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
})

app.listen(process.env.PORT || 3000,(req,res)=>{
    console.log("Server running at port 3000");
});
