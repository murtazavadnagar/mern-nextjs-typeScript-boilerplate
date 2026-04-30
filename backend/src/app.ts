import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import csurf from 'csurf';
import express, { Application, RequestHandler } from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import xssClean from 'xss-clean';
import { env } from './config/env';
import { errorHandler } from './middlewares/error.middleware';
import { notFoundHandler } from './middlewares/not-found.middleware';
import { globalRateLimiter } from './middlewares/rate-limit.middleware';
import { requestContextMiddleware } from './middlewares/request-context.middleware';
import { responseFormatter } from './middlewares/response.middleware';
import apiRoutes from './routes/v1';
import { morganStream } from './utils/logger';
import { swaggerSpec } from './config/swagger';

const app: Application = express();

app.use(requestContextMiddleware);
app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(xssClean());
app.use(hpp());
app.use(globalRateLimiter);
app.use(morgan('combined', { stream: morganStream }));
app.use(responseFormatter);

if (env.CSRF_ENABLED) {
  app.use(csurf({ cookie: true }) as unknown as RequestHandler);
}

if (env.ENABLE_SWAGGER) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

app.get('/health', (_req, res) => {
  res.success(
    {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
    'OK',
  );
});

app.use('/api/v1', apiRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
