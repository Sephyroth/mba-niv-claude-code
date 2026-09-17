import express, { Application } from 'express';

import usersRoutes from './routes/users.routes';
import ordersRoutes from './routes/orders.routes';
import paymentsRoutes from './routes/payments.routes';
import adminRoutes from './routes/admin.routes';
import productsRoutes from './routes/products.routes';
import profileRoutes from './routes/profile.routes';
import webhooksRoutes from './routes/webhooks.routes';
import healthRoutes from './routes/health.routes';

const app: Application = express();

app.use(express.json());

app.use(usersRoutes);
app.use(ordersRoutes);
app.use(paymentsRoutes);
app.use(adminRoutes);
app.use(productsRoutes);
app.use(profileRoutes);
app.use(webhooksRoutes);
app.use(healthRoutes);

const PORT = Number(process.env.PORT ?? 3000);

if (require.main === module) {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`demo-workflow API listening on port ${PORT}`);
  });
}

export default app;
