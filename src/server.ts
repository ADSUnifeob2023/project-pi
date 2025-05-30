import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import express from 'express';
import path from 'path';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public'))); 

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.get('/', (req, res) => {
  res.render('index', { title: 'Hey', message: 'Hello there!' });
});

const port = process.env.PORT || 3304;
app.listen(port, () => console.log(`Server is reuning ${port}`));