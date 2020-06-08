import express, { response } from 'express';
import { celebrate, Joi } from 'celebrate';

//importando classe
import PointsController from './Controllers/pointsController';
import ItemsController from './Controllers/itemsController';

const pointsController = new PointsController(); //instanciando
const itemsController = new ItemsController(); //instanciando

//bibliotecas para uploads de imagens
import multer from 'multer';
import multerConfig from './config/multer';

//as rotas do arquivo principal ficam acessiveis para outros arquivos
const routes = express.Router(); 
const upload = multer(multerConfig);

//RETORNA DADOS DA TABELA ITEMS
routes.get('/items', itemsController.index);

//RETORNA DADOS DA TABELA POINTS
routes.get('/points', pointsController.index);

//FAZENDO BUSCA DE UM PONTO ESPECIFICO
routes.get('/points/:id', pointsController.show);

// CRIANDO POINTS
//recebendo uma unica imagem
routes.post(
    '/points',
    upload.single('image'),
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            whatsapp: Joi.number().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().max(2),
            items: Joi.string().required(),
        })
    }, {
        abortEarly: false
    }),
    pointsController.create
);


export default routes;