import { Handler as ErrorHandler } from "./app/exceptions/Handler.js";
import { Handler as HttpHandler } from "./app/http/Handler.js";
import { ServiceProvider } from "./app/providers/ServiceProvider.js";
import { Router } from "./routes/Router.js";
import express from "express";

const app = express();

new ServiceProvider(app).boot();
new HttpHandler(app);
new Router(app);
new ErrorHandler(app);

export default app;
