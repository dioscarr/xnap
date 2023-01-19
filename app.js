const cors = require("cors");
const express = require("express");
const app = express();
const axios = require("axios");
const client = require("./db");
const { ObjectId } = require("mongodb");
const bodyParser = require("body-parser");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());


app.get("/findemails", async (req, res) => {
  await client.connect();
  
  try { 
    const skip = parseInt(req.query?.skip??"0");
    const next = parseInt(req.query?.next??"1");
    
    await client
    .db("xbusiness")
    .collection("lead")
    // .find({xurl:'http://www.jimillingworthmillwork.com'})
    .find({xurl:{$ne:"N/A"}})
    .skip(skip)
    .limit(next)
    .toArray()
    .then((leads) => 
    {
      Promise.all(
        leads.filter(x=>x.xurl!=="N/A").map(async lead=>
        {
        const params = {url:lead.xurl}
        console.log("{url:x.xurl}" + lead.xurl)
         const response = axios.get("https://pyyelp.onrender.com/findemail", { params })
         //const response = axios.get("http://127.0.0.1:5000/findemail", { params })
        return response;
        })
      ).then(async response=>
        {
          console.log(response)
          if(response.length>0)
          {
            await client
            .db("xbusiness")
            .collection("emails")
            .insertMany(response.filter(x=>x.data.emails.length>0).map(x=>{return{url:x.data.url,emails:x.data.emails}}))
            .then((result) => {
                res.status(200).json(response.filter(x=>x.data.emails.length>0).map(x=>{return{url:x.data.url,emails:x.data.emails}}))              
            })
            .catch((err) => {
              res.status(500).json({
                message: err,
              });
            });

          }
        }
        ).catch(error=>res.status(500).json(error))
    })

    
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  } finally {
    if (client != undefined && client !== "undefined") {
      //client.close();
    }
  }
}
)


app.get("/ReloadCats", async (req, res) => {
  await client.connect();
  try {
    const response = await axios.get(
      "https://recipexerver.onrender.com/yelp/categoriesandaliases"
    );
    console.log(response.data);
    const data = response.data;
    const db = client.db("xbusiness");
    const collections = await db.listCollections().toArray();
    const yelpcatsExist = collections.some(
      (collection) => collection.name === "cats"
    );
    if (yelpcatsExist) {
      console.log("Collection 'yelpcats' exists");
      await db.collection("cats").drop();
    } else {
      console.log("Collection 'yelpcats' does not exist");
    }
    await db.createCollection("cats");
    await db.collection("cats").insertMany(data);
    //client.close();
    res.status(201).json({
      message: `Successfully inserted yelpcats`,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  } finally {
    //client.close();
  }
});
app.get("/yelpcats", async (req, res) => {
  await client.connect();
  try {
    await client
      .db("xbusiness")
      .collection("cats")
      .find()
      .toArray()
      .then((leads) => {
        res.status(200).json(leads);
      })
      .catch((err) => {
        res.status(500).json({
          message: err.message,
        });
      });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  } finally {
    //client.close();
  }
});
app.get("/", async (req, res) =>res.send("Hello World!"));
app.get("/BusinessSearch", async (req, res) => {
  await client.connect();
  try {
    const location = req.query?.location??"";
    const Category = req.query?.category??"";
    console.log(`https://recipexerver.onrender.com/BusinessSearchByLocationCategories?location=${location}&category=${Category}&limit=1`);
    if(location==="" && Category ==="")
      throw new Error("location and category parameters are required! Those should be lower case");
    
    await axios
      .get(
       `https://recipexerver.onrender.com/BusinessSearchByLocationCategories?location=${location}&category=${Category}&limit=1`
       // `http://localhost:3002/BusinessSearchByLocationCategories?location=${location}&category=${Category}&limit=1`
      )
      .then(async (response) => {
       // const randomIndex = Math.floor(Math.random() * response.data.length);
       // const data = response.data[randomIndex];
        const leads = response.data.map(data=>{return {
          xname: data.name,
          xphone: data.phone,
          xurl: `${data.url}`,
          citystate: data.citystate,
          categories: data.categories,
          review_count: data.review_count,
          review_count: data.review_count,
          zip: data.zip,
          rating: data.rating,
        }});
        console.log(leads);
        await client
          .db("xbusiness")
          .collection("lead")
          //.insertOne(lead)
          .insertMany(leads)
          .then((result) => {
            res.status(201).json({
              message: `Successfully inserted leads`,
            });
          })
          .catch((err) => {
            res.status(500).json({
              message: err,
            });
          });
      });
  } catch (error) {
    
    console.error(error);
  } finally {
    if (client != undefined && client !== "undefined") {
      client.close();
    }
  }
});
app.post("/leads", async (req, res) => {
  await client.connect();
  try {
    const lead = req.body;
    await client
      .db("xbusiness")
      .collection("lead")
      .insertOne(lead)
      .then((result) => {
        //client.close();
        res.status(201).json({
          message: `Successfully inserted lead: ${result.insertedId}`,
        });
      })
      .catch((err) => {
        res.status(500).json({
          message: err,
        });
      });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  } finally {
    if (client != undefined && client !== "undefined") {
      //client.close();
    }
  }
});
app.get("/leads", async (req, res) => {
  await client.connect();
  try {
    await client
      .db("xbusiness")
      .collection("lead")
      .find()
      .toArray()
      .then((leads) => {
        if (client != undefined && client !== "undefined") {
          //client.close();
        }
        res.status(200).json(leads);
      })
      .catch((err) => {
        res.status(500).json({
          message: err,
        });
      });
  } catch (err) {
    res.status(500).json({
      message: err,
    });
  } finally {
    if (client != undefined && client !== "undefined") {
      //client.close();
    }
  }
});
app.put("/leads/:id", async (req, res) => {
  await client.connect();
  try {
    const id = req.params.id;
    const newData = req.body;
    await client
      .db("xbusiness")
      .collection("lead")
      .updateOne({ _id: ObjectId(id) }, { $set: newData })
      .then((result) => {
        if (client != undefined && client !== "undefined") {
          //client.close();
        }
        if (result.matchedCount > 0) {
          res.status(200).json({
            message: `Successfully updated lead with id: ${id}`,
          });
        } else {
          res.status(404).json({
            message: `No lead found with id: ${id}`,
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: err,
        });
      });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  } finally {
    if (client != undefined && client !== "undefined") {
      if (client != undefined && client !== "undefined") {
        //client.close();
      }
    }
  }
});
app.delete("/leads/:id", async (req, res) => {
  await client.connect();
  try {
    const id = req.params.id;
    await client
      .db("xbusiness")
      .collection("lead")
      .deleteOne({ _id: ObjectId(id) })
      .then((result) => {
        if (client != undefined && client !== "undefined") {
          //client.close();
        }
        if (result.deletedCount > 0) {
          res.status(200).json({
            message: `Successfully deleted lead with id: ${id}`,
          });
        } else {
          res.status(404).json({
            message: `No lead found with id: ${id}`,
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          message: err,
        });
      });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  } finally {
    if (client != undefined && client !== "undefined") {
      //client.close();
    }
  }
});
app.listen(3001, () => {
  console.log("http://localhost:3001/");
  console.log("http://localhost:3001/yelpcats");
  console.log("http://localhost:3001/leads");
  console.log("http://localhost:3001/ReloadCats");
  console.log("http://localhost:3001/findemails?next=2&skip=0");
});
