import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import cors from 'cors';
import { pipeline } from 'stream';
import got from 'got';


const app = express();
app.use(cors()); // Apply CORS middleware

app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const API_SERVICE_URL = 'https://secure.myfees.lk';
const router = express.Router();
const PORT = process.env.PORT || 6001;

app.use(router);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, PATCH, DELETE');

  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', (req, res) => {
  res.send("Hello World");
});

router.post('/api', async (req, res) => {
  try {
    const response = await axios.post(`${API_SERVICE_URL}/api/sch/payments` ,req.body , {
      headers : {
        'Content-Type': 'application/json',

      }
    });
    res.send(response.json)


}catch(error) {
  console.error(error);

  res.status(500).json({ error: "Internal Server Error" });

}})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

