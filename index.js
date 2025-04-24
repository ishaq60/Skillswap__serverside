require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000; // FIXED here

// Middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vu8ej.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Skill server running");
});

const courseCollection = client.db("Skillswap").collection("courses");
const enrollCourseCollection = client.db("Skillswap").collection("enrollCourse");
const mentorlistCollection = client.db("Skillswap").collection("mentorlist");
const PublicReviewlistCollection = client.db("Skillswap").collection("PublicReview");


app.get("/course", async (req, res) => {
  const result = await courseCollection.find().toArray();
  res.send(result);
});

//popular data

app.get("/courses/top", async (req, res) => {
    try {
      const topCourses = await courseCollection
        .find()
        .sort({ total_students_enrolled: -1 })
        .limit(3)
        .toArray(); // ✅ this is important!
      res.send(topCourses);
    } catch (error) {
      console.error("Error fetching top courses:", error);
      res.status(500).json({ message: "Error fetching top courses" });
    }
  });
  
  //single course
  app.get('/courses/:id', async (req, res) => {
    const id = req.params.id;
  
  
    const query = { _id: new ObjectId(id) };
    const result = await courseCollection.findOne(query);
    
    res.send(result);
  });
  
  
app.get('/course/:category',async(req,res)=>{
  const category=req.params

  const result=await courseCollection.find(category).toArray()
  res.send(result)
})
  
app.post('/enroll',async(req,res)=>{
  const enrollCourse=req.body
const result=await enrollCourseCollection.insertOne(enrollCourse)
res.send(result)
})
  
//get enrollinf data

app.get('/enroll/:email', async (req, res) => {
  const email = req.params.email;

  try {
    const query = { email };
    const result = await enrollCourseCollection.find(query).toArray();
    res.send(result)
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

//all metor lsit

app.get('/mentor/',async(req,res)=>{
  const result=await mentorlistCollection.find().toArray()
  res.send(result)
})
 //mentor details

 app.get('/mentorDetails/:id',async(req,res)=>{
  const id=req.params.id
  console.log(id)
  const query={_id:new ObjectId(id)}
  const result=await mentorlistCollection.findOne(query)
  res.send(result)
 })
//review collection of public

app.get('/publicreview',async(req,res)=>{
  const result=await PublicReviewlistCollection.find().toArray()
  res.send(result)
})






app.listen(port, () => {
  console.log(`Skill server is running on port: ${port}`);
});
