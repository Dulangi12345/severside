import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import cors from 'cors';

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
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', (req, res) => {
  res.send("Hello World");
});

router.post('/api', async (req, res) => {
  try {
    const response = await axios.post(`${API_SERVICE_URL}/api/sch/payments`, req.body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(response.data);
    console.log('External Server Status Code:', response.status);
    if (response.status === 201) {
      res.json(response.data);
    } else {
      res.status(response.status).json({ error: "Unexpected status code", statusCode: response.status });
    }
  } catch (error) {
    console.error(error);
    if (error.response) {
      const statusCode = error.response.status;
      res.status(statusCode).json({ error: "External Server Error", statusCode });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
