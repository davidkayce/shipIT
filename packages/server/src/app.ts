import express from 'express';
import bodyParser from 'body-parser';
import { router } from './controllers/decorators';

// Controllers
import './controllers/participant';
import './controllers/transaction';

const app = express();
const port = 5000;

app.use(bodyParser.urlencoded({
  extended: true,
  limit: '40mb'
}));
app.use(bodyParser.json({ limit: '40mb' }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.use(router);
app.listen(port, () => console.log('Server started in port' + port));

module.exports = app;