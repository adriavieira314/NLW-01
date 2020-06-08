//instalar @types/express pois algumas bibliotecas em ts precisa ser explicito o uso de tipagem
import express from 'express';
import cors from 'cors';
import routes from './routes';
import path from 'path';
import { errors } from 'celebrate';

const app = express();

app.use(cors()); //permite que todas as urls acessem meu app
//por padrão o express nao entede o formato json, usando essa função estamos dizendo que estamos usando json
app.use(express.json());
app.use(routes);

//caminho para as imagens de forma estatica
//dirname: src; entao eu volto para a pasta antes de src; e vou para uploads
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));

app.use(errors()); //lida com a forma que retornamos erro no frontend

app.listen(3333);
