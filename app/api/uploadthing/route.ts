import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

// Exporta rotas para o Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter, // Define o FileRouter criado anteriormente
});
