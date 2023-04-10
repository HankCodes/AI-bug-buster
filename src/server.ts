import express from 'express';
import webhookRouter from './routes/webhookRoutes';

const app = express();
const port = 3000;

app.use(webhookRouter)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
