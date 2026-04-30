declare module 'xss-clean' {
  import { RequestHandler } from 'express';

  const middleware: () => RequestHandler;
  export default middleware;
}
