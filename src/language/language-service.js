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
        'total_score AS totalScore',
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
  }
}

module.exports = LanguageService;
