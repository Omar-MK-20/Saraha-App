import express from 'express';
import { bootstrap } from "./app.bootstrap.js";

const app = await bootstrap();

export default app;