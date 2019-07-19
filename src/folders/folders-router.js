const path = require('path')
const express = require('express')
const FoldersService = require('./folders-service')
const folderRouter = express.Router()
const jsonParser = express.json()
const xss = require('xss')

const serializeFolder = folder => ({
    id: folder.id,
    name: xss(folder.name)
  })

folderRouter
  .route('/')
  .get((req, res, next) => {
    FoldersService.getAllFolders(req.app.get('db'))
      .then(folders => {
        res.json(folders.map(serializeFolder))
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { name } = req.body
    const newFolder = { name }
    if (!name) {
      return res
        .status(400)
        .json({
          error: { message: `You must include a name to create a folder` }
        })
    }

    FoldersService.insertFolder(
      req.app.get('db'),
      newFolder
    )
      .then(folder => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${folder.id}`))
          .json(serializeFolder(folder))
      })
      .catch(next)
  })

folderRouter
  .route('/:folder_id')
  .all((req, res, next) => {

    FoldersService.getById(
      req.app.get('db'),
      req.params.folder_id
    )
      .then(folder => {
        if (!folder) {
          return res
            .status(404)
            .json({
              error: { message: `Folder not found` }
            })
        }
        res.folder = folder
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeFolder(res.folder))
  })
  .delete((req, res, next) => {
    FoldersService.deleteFolder(
      req.app.get('db'),
      req.params.folder_id
    )
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { name } = req.body
    const changedFolder = { name }

    if (!name) {
        return res.status(400).json({
          error: {
            message: `A folder needs a name`
          }
        })
      }

    FoldersService.updateFolder(
      req.app.get('db'),
      req.params.folder_id,
      changedFolder
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })


module.exports = folderRouter