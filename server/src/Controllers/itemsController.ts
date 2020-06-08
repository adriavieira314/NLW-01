import { Request, Response } from 'express';
import knex from '../database/connection'; //conexao com o banco de dados

class ItemsController {
    async index(equest: Request, response: Response) {
        const items = await knex('items').select('*'); //SELECT * FROM TABLE items
    
        // retorna a image como o endereço da imagem
        const serializedItems = items.map(item => {
            return {
                id: item.id,
                title: item.title,
                image: `http://192.168.1.10:3333/uploads/${item.image}`
            };
        });
        
        return response.json(serializedItems);
    }
}

export default ItemsController;