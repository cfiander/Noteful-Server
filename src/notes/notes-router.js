const path = require('path')
const express = require('express')
const NotesService = require('./notes-service')
const notesRouter = express.Router()
const jsonParser = express.json()

notesRouter
  .route('/')
  .get((req, res, next) => {
    NotesService.getAllnotes(req.app.get('db'))
      .then(notes => {
        res.json(notes.map(NotesService.serializeNote))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { name, folder_id, content, modified } = req.body
    const newNote = { name, folder_id, content }

    for (const [key, value] of Object.entries(newNote)) {
      if (value == null) {
        return res
          .status(400)
          .json({
            error: {
              message: `Missing '${key}' in new note`
            }
          })
      }
    }
    newNote.modified = modified

    NotesService.insertNote(
      req.app.get('db'),
      newNote
    )
      .then(note => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${note.id}`))
          .json(serializeNote(note))
      })
      .catch(next)
  })

notesRouter
  .route('/:note_id')
  .all((req, res, next) => {
    NotesService.getById(
      req.app.get('db'),
      req.params.note_id
    )
      .then(note => {
        if (!note) {
          return res.status(404).json({
            error: { message: `Note not found` }
          })
        }
        res.note = note
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeNote(res.note))
  })
  .delete((req, res, next) => {
    NotesService.deleteNote(
      req.app.get('db'),
      req.params.note_id
    )
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { name, content } = req.body
    const changes = { name, content }

    const numberOfValues = Object.values(changes).filter(Boolean).length
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Notes must include name and content`
        }
      })
    }
    NotesService.updateNote(
      req.app.get('db'),
      req.params.note_id,
      changes
    )
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = notesRouter
