import express, { Express } from 'express';
import lightningRouter from './routes/lightning.routes';

const app: Express = express();

app.use(express.json());
app.use(lightningRouter);

app.get('/health', (req, res) => {
  res.json({ error: 'API up and running!' });
});

app.all("/{*splat}", (req, res) => {
  res.status(404).send();
});

export default app;
