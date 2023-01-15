const express = require('express');
const { ObjectId } = require('mongodb');
const client = require('./db');
const axios = require("axios");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get('/', (req, res) => {
    console.log("GetRecipeSuggestions");
    try {
        axios
        .get(
            "https://recipexerver.onrender.com/BusinessSearchByLocationCategories?limit=1&state=NY"
        )
        .then(async (response) => {
            console.log(response.data);
            //{name:'',phone:'',url:'',citystate:'',categories:'',review_count:0};
            const data = response.data[0];
            const lead =  {
                            xname:data.name,
                            xphone:data.phone,
                            xurl:`${data.url}`,
                            citystate: data.citystate,
                            categories:data.categories,
                            review_count:data.review_count,
                            review_count:data.review_count,
                            zip:data.zip,
                            rating:data.rating
                          };
            client.db("xbusiness")
                    .collection("lead")
                    .insertOne(lead).then(result => {
                        res.status(201).json({
                        message: `Successfully inserted lead: ${result.insertedId}`
                    });
        })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
    });  
    } catch (error) {
        console.error(error);
    }
});
app.post('/leads', (req, res) => {
  const lead = req.body;
  client.db("xbusiness").collection("lead").insertOne(lead)
    .then(result => {
      res.status(201).json({
        message: `Successfully inserted lead: ${result.insertedId}`
      });
    })
    .catch(err => {
      res.status(500).json({
        message: err
      });
    });
});
app.get('/leads', (req, res) => {
    client.db("xbusiness").collection("lead").find().toArray()
      .then(leads => {
        res.status(200).json(leads);
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  });
  app.put('/leads/:id', (req, res) => {
    const id = req.params.id;
    const newData = req.body;
    client.db("xbusiness").collection("lead").updateOne({ _id: ObjectId(id) }, { $set: newData })
      .then(result => {
        if (result.matchedCount > 0) {
          res.status(200).json({
            message: `Successfully updated lead with id: ${id}`
          });
        } else {
          res.status(404).json({
            message: `No lead found with id: ${id}`
          });
        }
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  });
  app.delete('/leads/:id', (req, res) => {
    const id = req.params.id;
    client.db("xbusiness").collection("lead").deleteOne({ _id: ObjectId(id) })
      .then(result => {
        if (result.deletedCount > 0) {
          res.status(200).json({
            message: `Successfully deleted lead with id: ${id}`
          });
        } else {
          res.status(404).json({
            message: `No lead found with id: ${id}`
          });
        }
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  });
    
  
app.listen(3000, () => {
    console.log('http://localhost:3000/');
    console.log('http://localhost:3000/leads');
  });
  