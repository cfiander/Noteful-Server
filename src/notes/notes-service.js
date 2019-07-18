const xss = require('xss')

const NotesService = {
    getAllnotes (knex) {
      return knex
        .select('*')
        .from('notes')
    },
    insertNote (knex, newNote) {
      return knex
        .insert(newNote)
        .into('notes')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    getById (knex, id) {
      return knex
        .from('notes')
        .select('*')
        .where('id', id)
        .first()
    },
    deleteNote (knex, id) {
      return knex
        .from('notes')
        .where({ id })
        .delete()
    },
    updateNote (knex, id, changes) {
      return knex
        .from('notes')
        .where({ id })
        .update(changes)
    },
    serializeNote(note) {
        return {
            id: note.id,
            name: xss(note.name),
            modified: note.modified,
            folder_id: note.folder_id,
            content: xss(note.content)
        }
    },
  }
  
  module.exports = NotesService
