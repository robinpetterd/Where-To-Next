from json_rpc import JsonRpcHandler, ServiceMethod, modelfetchtoarray, modelrowtodict
import json
from google.appengine.api import users
from gqlencode import GqlEncoder
from google.appengine.ext import db
from models import Quest
import logging

        
class RPCHandler(JsonRpcHandler):
    """Handles Remote Procedure Calls.

    No need to define post().
    """

    @ServiceMethod
    def listQuests(self):
      qs=Quest.all()
      qs.order('name')
      listResults=modelfetchtoarray(qs.fetch(500))
      if len(listResults)>0:
        return listResults
      else:
        return True

    @ServiceMethod
    def showQuest(self, key):
      return modelrowtodict(Quest.get_by_id(int(key)))


class RPCEditHandler(JsonRpcHandler):

    @ServiceMethod
    def listMyQuests(self):
      qs=Quest.all()
      qs.filter('creator =',users.get_current_user())
      qs.order('name')
      listResults=modelfetchtoarray(qs.fetch(500))
      if len(listResults)>0:
        return listResults
      else:
        return True
      
    @ServiceMethod
    def addeditQuest(self, params):
      if params.has_key("key"):
        q=Quest.get_by_id(int(params["key"]))
        if not(q.creator==users.get_current_user()):
          return False
        q.name=params["name"]
      else:
        q=Quest(creator=users.get_current_user(), name=params["name"])
      
      q.desc=params["desc"]
      q.points=params["points"]
      q.tags=params["tags"]
      if params.has_key("opthotcold"):
        q.opthotcold="checked"
      else:
        q.opthotcold=""
      if params.has_key("optmap"):
        q.optmap="checked"
      else:
        q.optmap=""
      if params.has_key("optarrows"):
        q.optarrows="checked"
      else:
        q.optarrows=""
      if params.has_key("optdraft"):
        q.optdraft="checked"
      else:
        q.optdraft=""
      q.put()
      return True

    @ServiceMethod
    def deleteQuest(self, key):
      q=Quest.get_by_id(int(key))
      if qs.creator==users.get_current_user():
        q.delete()
        return True
      else:
        return False
      