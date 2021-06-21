const express = require('express')
require('dotenv').config()
const cors = require('cors')
const ObjectID = require('mongodb').ObjectID
const port = 8000

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.buztu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express();
app.use(express.json())
app.use(cors())

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log(err)
  const jobCollection = client.db("JobLagbe").collection("Jobs");
  const employerCollection = client.db("JobLagbe").collection("employer");
  const approveJobCollection = client.db("JobLagbe").collection("approveJob");
  const adminCollection = client.db("JobLagbe").collection("admin");

  app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  app.get('/jobs', (req, res) => {
    jobCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })
  app.get('/approvejobs', (req, res) => {
    approveJobCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })

  app.get('/job/:id', (req, res) => {
    jobCollection.find({ _id: ObjectID(req.params.id) })
      .toArray((err, document) => {
        res.json(document[0]);
      })
  })
  app.get('/admin/approve/:id', (req, res) => {
    jobCollection.find({ _id: ObjectID(req.params.id) })
      .toArray((err, document) => {
        res.json(document[0]);
      })
  })

  app.get('/employer', (req, res) => {
    employerCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })
  app.post('/isadmin', (req, res) => {
    const email = req.body.email;
    adminCollection.find({ email: email })
      .toArray((err, admin) => {
        res.send(admin.length > 0);
      })
  })

  app.post('/addJob', (req, res) => {
    const newJobData = req.body;
    jobCollection.insertOne(newJobData)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })
  app.post('/addApproveJob', (req, res) => {
    const newApproveJobData = req.body;
    approveJobCollection.insertOne(newApproveJobData)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.post('/addemployer', (req, res) => {
    const newEmployer = req.body;
    employerCollection.insertOne(newEmployer)
      .then(result => {
        res.send(result.insertedCount > 0)
      })

  })

  app.post('/isemployer', (req, res) => {
    const email = req.body.email;
    employerCollection.find({ email: email })
      .toArray((err, admin) => {
        res.send(admin.length > 0);
      })
  })
  app.delete('/deleteJob/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    approveJobCollection.findOneAndDelete({ _id: id })
      .then(documents => res.send(!!documents.value))
  })
  app.post('/addadmin', (req, res) => {
    const newAdmin = req.body;
    adminCollection.insertOne(newAdmin)
      .then(result => {
        res.json(result.insertedCount > 0)
      })
  })


});


app.listen(process.env.PORT || port)