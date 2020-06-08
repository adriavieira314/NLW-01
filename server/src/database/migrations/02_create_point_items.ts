import Knex from 'knex';

//criar tabela
export async function up(knex: Knex) {
        //points é o nome da tabela
        return knex.schema.createTable('point_items', table => {
            table.increments('id').primary(); //chave primaria que é incrementado ao ser add novo point
            
            //point_id vai criar uma chave estrangeira na tabela points no campo id
            table.integer('point_id')
               .notNullable()
               .references('id')
               .inTable('points');


            table.integer('item_id')
               .notNullable()
               .references('id')
               .inTable('items');
        });
}

//deletar tabela
export async function down(knex: Knex) {
    return knex.schema.dropTable('point_items');
}