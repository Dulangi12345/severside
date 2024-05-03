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
const apiKey = 'KCBAE725KPTCGANOKA902101207'

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



const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'method': 'POST'
};

// router.post('/api', async (req, res) => {
//   try {
//     const response = await got.post(`${API_SERVICE_URL}/api/sch/payments`, {
//       json: req.body,
//     });
//     res.json(response.body);
//   } catch (error) {
//     console.error(error);

//     if (error.response) {
//       const statusCode = error.response.statusCode;
//       res.status(statusCode).json({ error: "External Server Error", statusCode });
//     } else {
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   }
// });
 

app.post('/api', async (req, res) => {
  const dataStream  = got.stream({
    url: `${API_SERVICE_URL}/api/sch/payments`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req.body),

  });

  dataStream.on('response', (response) => {
    res.set(response.headers);
  }
  )
  pipeline(dataStream, res, (err) => {

    if (err) {
      console.error(err);
      res.sendStatus(500);
    }
  });
});


// router.post('/api', async (req, res) => {
//   try {
//     await got.post(`${API_SERVICE_URL}/api/sch/payments`  ,req,{
//       headers: headers,
//     }).then(response => {
//       res.json(response.body);
//     }
//     );
//   } catch (error) {
//     console.error(error);

//     if (error.response) {
//       const statusCode = error.response.statusCode;
//       res.status(statusCode).json({ error: "External Server Error", statusCode });
//     } else {
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   }
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

