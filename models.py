from google.appengine.ext import db

class Quest(db.Model):
  creator=db.UserProperty(required=True)
  name=db.StringProperty(required=True)
  desc=db.TextProperty()
  points=db.TextProperty()
  opthotcold=db.StringProperty()
  optmap=db.StringProperty()
  optarrows=db.StringProperty()
  tags=db.StringProperty()
  optdraft=db.StringProperty()
  datecreated=db.DateTimeProperty(auto_now_add=True)
  datemodified=db.DateTimeProperty(auto_now=True)

