import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "idFicticio" }); // Função fictícia de autenticação

// FileRouter para sua aplicação, pode conter múltiplos FileRoutes
export const ourFileRouter = {
  // Defina quantos FileRoutes você quiser, cada um com um identificador único (routeSlug)
  imageUploader: f({
    image: {
      /**
       * Para a lista completa de opções e valores padrão, veja a referência da API de Rotas de Arquivos
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB", // Tamanho máximo do arquivo: 4MB
      maxFileCount: 10, // Quantidade máxima de arquivos: 1
    },
  })
    // Define permissões e tipos de arquivos para este FileRoute
    .middleware(async ({ req }) => {
      // Este código é executado no seu servidor antes do upload
      //const user = await auth(req);

      // puxando o status de usuario logado em uma função do lado do servidor
      const { getUser } = getKindeServerSession();
      const user = await getUser();

      // Se você lançar uma exceção, o usuário não poderá fazer o upload
      if (!user || user.email !== "biduzao.bidu21@gmail.com")
        throw new UploadThingError("Não autorizado");

      // O que for retornado aqui estará acessível em `onUploadComplete` como `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Este código É EXECUTADO NO SEU SERVIDOR após o upload

      console.log("Upload concluído para userId:", metadata.userId);

      console.log("URL do arquivo:", file.url);

      // O que for retornado aqui será enviado para o callback client-side `onClientUploadComplete`
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

// Tipo que define o FileRouter usado na aplicação
export type OurFileRouter = typeof ourFileRouter;
