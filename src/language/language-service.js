const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id })
  },

  getHead(db, user_id) {
    return db
      .from('language')
      .select(
        'original AS nextWord',
        'language.total_score as totalScore',
        'correct_count AS wordCorrectCount',
        'incorrect_count AS wordIncorrectCount'
        )
      .innerJoin('word', 'language.head', 'word.id')
      .where('language.user_id', user_id)
      .first()
  },

  getOriginalWord(db, language_id, original) {
    return db
      .from('word')
      .select('*')
      .where({ original, language_id})
      .first()
  },

  updateWord(db, id, newWord) {
    return db
      .from('word')
      .update(newWord)
      .where({ id })
  },

  updateLanguage(db, id, newLang) {
    return db
      .from('language')
      .update(newLang)
      .where({id})
  },

  resetHead(db){
    return db
      .from('language')
      .update(1)
      .where({head})
  }

}

module.exports = LanguageService;
