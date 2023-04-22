const cors = require("cors");
const express = require("express");
const app = express();
const axios = require("axios");
const client = require("./db");
const { ObjectId } = require("mongodb");
const bodyParser = require("body-parser");

const createCsvWriter = require('csv-writer').createObjectCsvWriter;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.post("/AddDailyYouTubeTops", async (req, res) => {
  await client.connect();
  try {
    const DailyYouTubeTops = req.body.data;


    const collections = await client.db("xmarketing").listCollections().toArray();
    const DailyYouTubeTopsExist = collections.some(
      (collection) => collection.name === "DailyYouTubeTops"
    );
    if (!DailyYouTubeTopsExist) {
      await client.db("xmarketing").createCollection("DailyYouTubeTops");
      
    }
    await client.db("xmarketing").collection("DailyYouTubeTops").insertMany(DailyYouTubeTops);

    res.status(201).json({
      message: `Successfully inserted DailyYouTubeTops`,
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
app.get("/dequeue", async (req,res)=>{
  await client.connect();
  try{
    await client
    .db("xbusiness")
    .collection("queue")
    .find()
    .limit(1)
    .toArray()
    .then(async(queue) =>{
      //console.log(queue[0]);
      if(queue.length>0)
      {
        
        await client.db("xbusiness").collection("queue").deleteOne(queue[0]);
        res.status(200).send(encodeURI(queue[0].xurl));
      }
      else
      {
        res.status(200).send("done");
      }
    })
  } catch (err) {http://localhost:3001/BusinessSearch?location=Schenectady%20County%20NY&category=bankruptcy
    res.status(500).json({
      message: err.message,
    });
  } finally {
    if (client != undefined && client !== "undefined") {
      //client.close();
    }
  }
});
app.post("/addtoqueue", async (req, res) => {
  await client.connect();
  try {
    const queue = req.body.data;


    const collections = await client.db("xbusiness").listCollections().toArray();
    const yelpcatsExist = collections.some(
      (collection) => collection.name === "queue"
    );
    if (!yelpcatsExist) {
      await client.db("xbusiness").createCollection("queue");
      
    }
    await client.db("xbusiness").collection("queue").insertMany(queue.map(x=>{return {xurl:x}}));

    res.status(201).json({
      message: `Successfully inserted addtoqueue`,
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
app.get("/getskipcount", async (req,res)=>{
  await client.connect();
  try{
    await client
    .db("xbusiness")
    .collection("emailsSkipCount")
    .find()
    .sort({SkipCount:-1})
    .limit(1)
    .toArray()
    .then(async(emailSkips) =>{
     
      if(emailSkips.length>0)
      {
        res.status(200).send(emailSkips[0].SkipCount.toString());
      }
      else
      {
        res.status(200).send("0");
      }
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
});
app.get("/setreportskipcount", async (req, res) => {
  await client.connect();
  
  try { 
    const skip = parseInt(req.query?.skip??"0")+2000;
    const collections = await client.db("xbusiness").listCollections().toArray();
    const emailsSkipCountExist = collections.some(
      (collection) => collection.name === "reportskipcount"
    );

    if(emailsSkipCountExist)
    {
      await client
      .db("xbusiness")
      .collection("reportskipcount")
      .find()
      .sort({SkipCount:-1})
      .limit(1)
      .toArray()
      .then(async(emailSkips) =>{
      
        if(emailSkips.length>0)
        {
          var sk = skip;
              await client
              .db("xbusiness")
              .collection("reportskipcount")
              .insertOne({SkipCount:sk})
              .then((result) => {
               
              });
        }
        else
        {
          await client
          .db("xbusiness")
          .collection("reportskipcount")
          .insertOne({SkipCount:skip})
          .then((result) => {
           
          });
        }
      }) 
    }
    else
    {
      await client
      .db("xbusiness")
      .collection("reportskipcount")
      .insertOne({SkipCount:skip})
      .then((result) => {
        //console.log(`Skip Count Updated: ${result}`)   
      });
    }
    res.status(200).send(
     skip.toString()
    );
    
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
);
app.get("/GetLeadCount", async (req,res)=>{
  try{
    //console.log("calling connect");
    await client.connect();
    //console.log("connected");
    const count = await client
    .db("xbusiness")
    .collection("lead")
    .countDocuments();
    res.json({ count });
    //console.log(`The total number of documents in mycollection is: ${count}`);
  } catch (err) {
    //console.log("There was an error.");
    //console.log(err);
    res.status(500).json({
      message: err.message,
      stack: err.stack,
    });
  } finally {
    if (client != undefined && client !== "undefined") {
      //client.close();
    }}
  });
app.get("/getReportskipcount", async (req,res)=>{
  await client.connect();
  try{
    await client
    .db("xbusiness")
    .collection("reportskipcount")
    .find()
    .sort({SkipCount:-1})
    .limit(1)
    .toArray()
    .then(async(emailSkips) =>{
      //console.log(emailSkips);  
      if(emailSkips.length>0)
      {
        res.status(200).send(emailSkips[0].SkipCount.toString());
      }
      else
      {
        res.status(200).send("0");
      }
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
});
app.get("/findemails", async (req, res) => {
  await client.connect();
  
  try { 
    const skip = parseInt(req.query?.skip??"1")+1;
    const next = parseInt(req.query?.next??"1");
    const collections = await client.db("xbusiness").listCollections().toArray();
    const emailsSkipCountExist = collections.some(
      (collection) => collection.name === "emailsSkipCount"
    );

    if(emailsSkipCountExist)
    {
      await client
      .db("xbusiness")
      .collection("emailsSkipCount")
      .find()
      .sort({SkipCount:-1})
      .limit(1)
      .toArray()
      .then(async(emailSkips) =>{
        //console.log(emailSkips);
        if(emailSkips.length>0)
        {
          var sk = skip;
              await client
              .db("xbusiness")
              .collection("emailsSkipCount")
              .insertOne({SkipCount:sk})
              .then((result) => {
                //console.log(`Skip Count Updated: ${result}`)   
              });
        }
        else
        {
          await client
          .db("xbusiness")
          .collection("emailsSkipCount")
          .insertOne({SkipCount:skip})
          .then((result) => {
            //console.log(`Skip Count Updated: ${result}`)   
          });
        }
      }) 
    }
    else
    {
      await client
      .db("xbusiness")
      .collection("emailsSkipCount")
      .insertOne({SkipCount:skip})
      .then((result) => {
        //console.log(`Skip Count Updated: ${result}`)   
      });
    }  

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
        //console.log("{url:x.xurl}" + lead.xurl)
         const response = axios.get("https://pyyelp.onrender.com/findemail", { params })
         //const response = axios.get("http://127.0.0.1:5000/findemail", { params })
        return response;
        })
      ).then(async response=>
        {
          //console.log(response)
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
);
app.get("/ReloadCats", async (req, res) => {
  await client.connect();
  try {
    const response = await axios.get(
      "https://recipexerver.onrender.com/yelp/categoriesandaliases"
    );
    //console.log(response.data);
    const data = response.data;
    const db = client.db("xbusiness");
    const collections = await db.listCollections().toArray();
    const yelpcatsExist = collections.some(
      (collection) => collection.name === "cats"
    );
    if (yelpcatsExist) {
      //console.log("Collection 'yelpcats' exists");
      await db.collection("cats").drop();
    } else {
      //console.log("Collection 'yelpcats' does not exist");
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
    //console.log(`https://recipexerver.onrender.com/BusinessSearchByLocationCategories?location=${location}&category=${Category}&limit=1`);
    if(location==="" && Category ==="")
      throw new Error("location and category parameters are required! Those should be lower case");
      await axios
      .get(
       //`https://recipexerver.onrender.com/BusinessSearchByLocationCategories?location=${location}&category=${Category}&limit=1`
       //`http://localhost:3002/FullBusinessSearchByLocationCategories?location=${location}&category=${Category}&limit=1`
       `https://recipexerver.onrender.com/FullBusinessSearchByLocationCategories?location=${location}&category=${Category}&limit=1`
      ).then(async (response1) => 
      {     
        await axios
          .post(
          //`https://recipexerver.onrender.com/BusinessSearchByLocationCategories?location=${location}&category=${Category}&limit=1`
          //`http://localhost:3002/FindBusinessUrls?location=${location}`,
          `https://recipexerver.onrender.com/FindBusinessUrls?location=${location}`,
            {data:response1.data.businesses}
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
     
        //console.log(leads);
        await client
          .db("xbusiness")
          .collection("lead")
          //.insertOne(lead)
          .insertMany(leads)
          .then((result) => {
            res.status(201).json({
              message: `Successfully inserted leads ${result.insertedCount}`,
            });
          })
          .catch((err) => {
            res.status(500).json({
              message: err,
            });
          });
      });
    });
  } catch (error) {
    
    //console.error(error);
  } finally {
    if (client != undefined && client !== "undefined") {
      //client.close();
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
  const skip = parseInt(req.query.skip??"0");
  const limit = parseInt(req.query.limit??"25");
  await client.connect();
  try {
    await client
    .db("xbusiness")
    .collection("lead")
    .aggregate([{
      $lookup: {
      from: "emails",
      localField: "xurl",
      foreignField: "url",
      as: "emails"
      }
    }])
    .skip(skip)
    .limit(limit)
    .toArray()
    .then((leads) => res.status(200).json(leads))
    .catch((err) => res.status(500).json({message: err,}));
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
app.post("/addtoreportqueue", async (req, res) => {
  await client.connect();
  try {
    const x = req.body.data;

    const collections = await client.db("xbusiness").listCollections().toArray();

    const reportExisit = collections.some(
      (collection) => collection.name === "reports"
    );
    if (!reportExisit) {
      await client.db("xbusiness").createCollection("reports");
      
    }
    await client.db("xbusiness").collection("reports").insertOne({xurl:x.xurl,skip:x.skip,limit:x.limit,created:x.created});

    const yelpcatsExist = collections.some(
      (collection) => collection.name === "notifyreportsqueue"
    );
    if (!yelpcatsExist) {
      await client.db("xbusiness").createCollection("notifyreportsqueue");
      
    }
    await client.db("xbusiness").collection("notifyreportsqueue").insertOne({xurl:x.xurl});

    res.status(201).json({
      message: `Successfully inserted addtoreportqueue`,
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
app.get("/dequereport", async (req, res) => {
  await client.connect();
  try {
  
    await client.db("xbusiness").collection("notifyreportsqueue").find()
    .limit(1)
    .toArray()
    .then(async(queue) =>{
      //console.log(queue[0]);
      if(queue.length>0)
      {
        //console.log(encodeURI(queue[0].xurl));
        await client.db("xbusiness").collection("notifyreportsqueue").deleteOne(queue[0]);
        res.status(200).send(encodeURI(queue[0].xurl));
      }
      else
      {
        res.status(200).send("None");
      }
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
});
app.get("/ziptolatlon", async (req, res) => {
  await client.connect();
  try {
    const zip = parseInt(req.query.zip??"10040");
    const collections = await client.db("xbusiness").listCollections().toArray();

    const reportExisit = collections.some(
      (collection) => collection.name === "ziptolatlon"
    );
    if (!reportExisit) {
      await client.db("xbusiness").createCollection("ziptolatlon");
      await client.db("xbusiness").collection("ziptolatlon").createIndex({"zip":1},{unique:true}); // unique
    }     
      await axios.get(`https://recipexerver.onrender.com/ziptolatlon?zip=${zip.toString()}`).then(async result=>{
       await client.db("xbusiness").collection("ziptolatlon").insertOne(result.data).then( result=>{
        res.status(200).json(result);
      })
    })
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  } finally {
    if (client != undefined && client !== "undefined") {
      client.close();
    }
  }
});
app.get("/leadsziptolatlon", async (req, res) => {
  await client.connect();
  try {
    const zip = parseInt(req.query.zip??"10040");
    const collections = await client.db("xbusiness").listCollections().toArray();

    const reportExisit = collections.some(
      (collection) => collection.name === "ziptolatlon"
    );
    if (!reportExisit) {
      await client.db("xbusiness").createCollection("ziptolatlon");
      await client.db("xbusiness").collection("ziptolatlon").createIndex({"zip":1},{unique:true}); // unique
    }

const a = [];
  await client
  .db("xbusiness")
  .collection("lead")  
  .distinct('zip')
  .then(async(zips) => {
   const resp =  zips.filter(x=>x.length == 5).map(async zip=>{
       //console.log(`https://recipexerver.onrender.com/ziptolatlon?zip=${zip}`);
       return await axios.get(`https://recipexerver.onrender.com/ziptolatlon?zip=${zip}`).then(async result=>{
          //console.log(result)
         return await client.db("xbusiness").collection("ziptolatlon").insertOne(result.data)
             .then(ziptolatlon=>{
              //console.log("done!")
              a.push(ziptolatlon);
             }).catch(error=>//console.log(error));
      })
    })
    await Promise.all(resp).then(result=>{

      res.status(200).json(a);

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
app.get("/geoleads", async (req, res) => {
  const csvWriter = createCsvWriter({
    path: 'geoleads.csv',
    header: [
        {id: 'xname', title: 'xname'},
        {id: 'Latitude', title: 'Latitude'},
        {id: 'Longitude', title: 'Longitude'},
    ]
});
  await client.connect();
  try {
    await client
    .db("xbusiness")
    .collection("lead")
    .aggregate([
      {
        $lookup: {
        from: "ziptolatlon",
        localField: "zip",
        foreignField: "zip",
        as: "geoleads"
        }
      },
      {
        $match: { "geoleads.Latitude": { $ne: "N/A" } }
      },
      {
        $unwind: "$geoleads"
      },
      {
        $project: {
            _id: 0,
            xname: 1,
            Latitude: { $toDecimal: "$geoleads.Latitude" },
            Longitude: { $toDecimal: "$geoleads.Longitude" }
        }
    }
  ])
   
    .toArray()
    .then((geoleads) =>{

      csvWriter
      .writeRecords(geoleads)
      .then(() => {
        //console.log('...File written');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=geoleads.csv');
        res.download('./geoleads.csv', 'geoleads.csv');
      });
    })
    .catch((err) => res.status(500).json({message: err,}));
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

app.listen(3001, () => {
  //console.log("http://localhost:3001/");
  //console.log("http://localhost:3001/yelpcats");
  //console.log("http://localhost:3001/leads");
  //console.log("http://localhost:3001/ReloadCats");
  //console.log("http://localhost:3001/findemails?next=2&skip=0");
  //console.log("http://localhost:3001/addtoreportqueue?next=2&skip=0");
  //console.log("http://localhost:3001/getReportskipcount?skip=0");
  //console.log("http://localhost:3001/setreportskipcount?skip=0");
  //console.log("http://localhost:3001/ziptolatlon?zip=13039");
  //console.log("http://localhost:3001/leadsziptolatlon");
  //console.log("http://localhost:3001/geoleads");
  //console.log("http://localhost:3001/getleadcount");
});
