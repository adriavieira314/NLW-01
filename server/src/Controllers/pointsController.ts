import { Request, Response } from 'express';
import knex from '../database/connection'; //conexao com o banco de dados

class PointsController {
    async index(request: Request, response: Response) {
        const { city, uf, items } = request.query;

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

        // retorna a image como o endereço da imagem
        const serializedPoints = points.map(point => {
            return {
                ...point,
                image: `http://192.168.1.10:3333/uploads/${point.image}`
            };
        });
        
        return response.json(serializedPoints);
    }

    async show(request: Request, response: Response) {
        const { id } = request.params; //capturando o id do parametro enviado na url

        //busque na tabela 'points' o primeiro dado onde o 'id' for igual a id
        const point = await knex('points').where('id', id).first();

        //se caso o ponto nao for encontrado, messagem de erro
        if(!point) {
            return response.status(400).json({ message: 'Point not found.' });
        }

        const items = await knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', id)
            .select('items.title');

        // retorna a image como o endereço da imagem
        const serializedPoint = {
            ...point,
            image: `http://192.168.1.10:3333/uploads/${point.image}`
        };

        //se for encontrado, retorna o point
        return response.json({ point: serializedPoint, items });
    }

    async create(request: Request, response: Response) {
        //requisitando os dados do body
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;
    
        // transaction: previne o funcionamento de um insert abaixo se em um deles der erro
        const trx = await knex.transaction();

        const point = {
            image: request.file.filename, //pegando a imagem do usuario
            name, //name: name
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        }
    
        //INSERINDO DADOS NOS CAMPOS DA TABELA points
        const insertedIds = await trx('points').insert(point);
    
        const point_id = insertedIds[0];
    
        // percorrendo o array que é o items
        const pointItems = items.split(',').map((item: string) => (item.trim())).map((item_id: number) => {
        return {
            item_id,
                point_id
            }
        });
    
        // INSERINDO OS ITEMS QUE UM PONTO COLETA NA TABELA point_items
        await trx('point_items').insert(pointItems);

        await trx.commit();
        
        return response.json({
            id: point_id,
            ...point
        });
    }
}

export default PointsController;