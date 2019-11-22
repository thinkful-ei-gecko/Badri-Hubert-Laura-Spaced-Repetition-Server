const express = require('express');
const LanguageService = require('./language-service');
const { requireAuth } = require('../middleware/jwt-auth');

const jsonBodyParser = express.json();
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
  })

languageRouter
  .post('/guess', jsonBodyParser, async (req, res, next) => {
    const db = req.app.get('db');

    const {guess} = req.body;
    let currentWord;
    let isCorrect;

    if (!guess) {
      return res.status(400).json({error: `Missing 'guess' in request body`})
    }

    try {
      let head = await LanguageService.getHead(db, req.user.id)
      currentWord = await LanguageService.getOriginalWord(db, req.language.id, head.nextWord)
      // if (currentWord.next === null) {
      //   LanguageService.resetHead(db)
      // }
      req.language.head = currentWord.next;
      isCorrect = currentWord.translation.toLowerCase() === guess.toLowerCase()

      if(isCorrect) {
        currentWord.memory_value *=2;
        currentWord.correct_count++;
        req.language.total_score++;
      } else {
        currentWord.memory_value = 1;
        currentWord.incorrect_count++;
      }
      await LanguageService.updateLanguage(db, req.language.id, req.language)

      let newID = currentWord.id;
      let tempWord;

      for(let i=0; i<currentWord.memory_value; i++) {
        tempWord = await LanguageService.getNextWord(db, newID);
        newID = tempWord.id;
      }

      //tempWord = currentWord

      currentWord.next = tempWord.next;
      tempWord.next = currentWord.id;
      await LanguageService.updateWord(db, currentWord.id, currentWord);
      await LanguageService.updateWord(db, tempWord.id, tempWord);
    } catch(e) {
      next(e)
    }

    LanguageService.getHead(db, req.user.id)
      .then(result => {
        result.totalScore = req.language.total_score;
        result.wordCorrectCount = currentWord.correct_count;
        result.wordIncorrectCount = currentWord.incorrect_count;
        result.answer = currentWord.translation;
        result.isCorrect = isCorrect;
        return res.status(200).json(result)
      })
      .catch(e => next(e))
  })

module.exports = languageRouter;
