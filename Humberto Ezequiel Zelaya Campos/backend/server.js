import express from 'express';
import connectDB from './database/mongodb.js';
import musicRoutes from './routes/MusicRoutes.js';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = 3000;


app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

connectDB();
app.use('/', musicRoutes);

app.get('/', (req, res) => res.send('¡Hola Mundo!'));

app.listen(port, () => console.log(`Ejecutando en http://localhost:${port}`));