// src/cors.d.ts
declare module 'cors' {
    import { RequestHandler } from 'express';
  
    function cors(options?: cors.CorsOptions): RequestHandler;
  
    namespace cors {
      interface CorsOptions {
        origin?: boolean | string | RegExp | (string | RegExp)[] | CustomOrigin;
        methods?: string | string[];
        allowedHeaders?: string | string[];
        exposedHeaders?: string | string[];
        credentials?: boolean;
        maxAge?: number;
        preflightContinue?: boolean;
        optionsSuccessStatus?: number;
      }
  
      type CustomOrigin = (requestOrigin: string | undefined, callback: (err: Error | null, origin?: boolean | string | RegExp | (string | RegExp)[]) => void) => void;
    }
  
    export = cors;
  }