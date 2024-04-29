import express from 'express';
import bodyParser from 'body-parser';
import got from 'got';
import cors from 'cors'


const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const API_SERVICE_URL = 'https://secure.myfees.lk';
const router = express.Router();
const PORT = process.env.PORT || 6001;



app.use(router);
app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin: *');
  res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
  next();
});

var corsOptions = {
  origin: 'https://startling-duckanoo-c5860c.netlify.app',
  optionsSuccessStatus: 200 
}

app.get('/', (req, res) => {
  res.send("Hello World");
});


router.post('/api', async (req, res) => {
  try {
    const response = await got.post(`${API_SERVICE_URL}/api/sch/payments`, {
      json: req.body,
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json',
      },

    });
    
    console.log(response.body);
    console.log('External Server Status Code:', response.statusCode);
    if(response.statusCode === 201){
    const jsonRes =JSON.stringify(response.body);
    res.send(jsonRes);
    }else{
      res.status(response.statusCode).json({ error: "Unexpected status code", statusCode: response.statusCode });
    }

    
  } catch (error) {
    console.error(error);
    if (error.response) {
      const statusCode = error.response.statusCode;
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