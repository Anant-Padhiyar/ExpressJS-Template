const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const router = express.Router();

// MongoDB Connection URI
const uri = process.env.MongoDB_Express;

if (!uri) {
  console.error("❌ MongoDB_Express URI is missing in .env file!");
  process.exit(1);
}

// CORS Configuration
const allowedOrigins = [
  process.env.DevServer,
  process.env.DeployServer,
];

const corsOptions = {
  origin: (origin, callback) => {
    // if (allowedOrigins.includes(origin)) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Client
let client;
async function connectToDB() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client;
}

console.log('hi')
// 🟢 **API Routes**
router.get("/", (req, res) => {
  res.send("API is running on Vercel!");
});

// **Route: Fetch ALL Category Names**
app.get('/', async (req, res) => {
  try {
      return res.json({'Message':'Ok ! /route'})
  } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: "Internal server error" });
  }
  });

// Comment it on deployment on vercel.
// Only Uncomment For Development
// const port = process.env.PORT || 4000; // Take PORT from .env or default to 4000

//   app.listen(port, () => {
//     console.log(`✅ Server running at http://localhost:${port}`);
//   });

// 🟢 **Error Handling Middleware**
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

// 🟢 **404 Handler**
app.use((req, res) => {
  res.status(404).send("Sorry, that route does not exist!");
});



// 🟢 **Export App for Vercel (NO app.listen)**
app.use("/api", router);
module.exports = app;


