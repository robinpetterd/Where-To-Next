import webapp2
#from google.appengine.ext.webapp import util
from jsonservice import RPCHandler, RPCEditHandler
import logging

class MainHandler(webapp2.RequestHandler):
    """The main handler."""

    def get(self):
        """Handles GET."""

        return webapp2.redirect('/pages/index.html?' + self.request.query_string)


application = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/rpc', RPCHandler),
    ('/rpcedit', RPCEditHandler)
], debug=True)

def main():
  run_wsgi_app(application)

if __name__ == '__main__':
  main()