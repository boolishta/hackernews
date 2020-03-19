export const updateSearchTopStoriesState = (hits, page) => (prevState) => {
  const { searchKey, results } = prevState;
  const oldHits = results && results[searchKey] 
    ? results[searchKey].hits 
    : [];
  const updateHits = [ //объединяем старые и новые истории
    ...oldHits,
    ...hits
  ]
  return { 
    results: { 
      ...results, 
      [searchKey]: { hits: updateHits, page } //сохраняем результат с ключом searchKey
    },
    isLoading: false
  };
}