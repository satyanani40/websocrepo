from pymongo import MongoClient

class WeberDB(object):
  db=None
  def __init__(self):
      client = MongoClient()
      self.db = client['test']

  def update_search(self,keywordsList,id):

      return self.db.searchActivity.update({'keywords':{'$in' : keywordsList}},{'$inc':{'newResults':1},'$push':{'matchedPosts':id }},False, multi=True)

  def collection_names(self):
      return self.db.collection_names()

  def find_document(self, collection, field, value):
      criteria = {'object.'+field: value}
      attrs = self.db[collection].find_one(criteria)
      return attrs

  def find_documents(self, collection, field, value):
      criteria = {'object.'+field: value}
      attrs = self.db[collection].find(criteria)
      return attrs

  def find_all_documents(self, collection):
      attrs = self.db[collection].find()
      return attrs

  def insert(self, collection, document):
      self.db[collection].insert(document)