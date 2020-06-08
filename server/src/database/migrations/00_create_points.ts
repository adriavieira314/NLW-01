import Knex from 'knex';

//criar tabela
export async function up(knex: Knex) {
        //points é o nome da tabela
        return knex.schema.createTable('points', table => {
            table.increments('id').primary(); //chave primaria que é incrementado ao ser add novo point
            table.string('image').notNullable();
            table.string('name').notNullable();
            table.string('email').notNullable();
            table.string('whatsapp').notNullable();
            table.decimal('latitude').notNullable();
            table.decimal('longitude').notNullable();
            table.string('city').notNullable();
            table.string('uf', 2).notNullable();
        });
}

//deletar tabela
export async function down(knex: Knex) {
    return knex.schema.dropTable('points');
}