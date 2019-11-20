const express = require('express');
const LanguageService = require('./language-service');
const { requireAuth } = require('../middleware/jwt-auth');

const languageRouter = express.Router();

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({ error: `You don't have any languages` })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  });

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords( req.app.get('db'), req.language.id );

      res.json({ language: req.language, words })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    try {
      const head = await LanguageService.getHead(
        req.app.get('db'),
        req.user.id
      )
      res.json(head)
      next()
    } catch (e) {
      next(e)
    }
    // LanguageService.getHead(
    //   req.app.get('db'),
    //   req.user.id
    // )
    //   .then(head => res.status(200).json(head))
    //   .catch(next)
  })

languageRouter
  .post('/guess', (req, res, next) => {
    const db = req.app.get('db');
    let { guess } = req.body;
    let currentWord;

    if (!guess) {
      return res.status(400).json({error: `Missing 'guess' in request body`})
    }

    try {
      let head = await LanguageService.getHead(db, req.user.id)
      currentWord = await LanguageService.getOriginalWord(db, req.language.id, head.nextWord)
      correct = currentWord.translation.toLowerCase() === guess.toLowerCase()

      if(correct) {
        currentWord.memory_value *=2;
        currentWord.correct_count++;
        req.language.total_score++

      } else {
        currentWord.memory_value = 1;
        currentWord.incorrect_count++;
      }
    } catch(e) {
      next(e)
    }
  })

module.exports = languageRouter;
