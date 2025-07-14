/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('tasks', function(table){
    table.increments('id').primary();
    table.string('title', 100).notNullable();
    table.text('description');
    table.timestamp('deadline_date');
    table.string('telegram_chat_id', 64).notNullable();
    table.boolean('reminder').defaultTo(false);
    table.boolean('completed').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now())

  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('tasks')
};
