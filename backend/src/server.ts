import app from './app';
import { env } from './config/env';
import { connectDatabase } from './config/db';
import { logger } from './utils/logger';

const bootstrap = async (): Promise<void> => {
  try {
    await connectDatabase();
    app.listen(env.PORT, () => {
      logger.info(`Backend server running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${(error as Error).message}`);
    process.exit(1);
  }
};

void bootstrap();
