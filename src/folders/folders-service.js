const xss = require('xss')

const FoldersService = {
    getAllFolders (knex) {
      return knex
        .from('folders')
        .select('*')
    },
    insertFolder (knex, newFolder) {
      return knex
        .insert(newFolder)
        .into('folders')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
    getById (knex, id) {
      return knex
        .from('folders')
        .select('*')
        .where('id', id)
        .first()
    },
    deleteFolder (knex, id) {
      return knex
        .from('folders')
        .where({ id })
        .delete()
    },
    updateFolder (knex, id, changes) {
      return knex
        .from('folders')
        .where({ id })
        .update(changes)
    },
    serializeFolder(folder) {
    return {
        id: folder.id,
        name: xss(folder.name)
    }
    },
  }
  
  module.exports = FoldersService