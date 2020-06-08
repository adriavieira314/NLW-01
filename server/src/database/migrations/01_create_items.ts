import Knex from 'knex';

//criar tabela
export async function up(knex: Knex) {
        //points é o nome da tabela
        return knex.schema.createTable('items', table => {
            table.increments('id').primary(); //chave primaria que é incrementado ao ser add novo point
            table.string('image').notNullable();
            table.string('title').notNullable();
        });
}

//deletar tabela
export async function down(knex: Knex) {
    return knex.schema.dropTable('items');
}