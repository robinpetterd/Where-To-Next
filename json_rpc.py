# -*- coding: utf-8 -*-
#
# Copyright 2010, 2011 Florian Glanzner (fgl), Tobias Rodäbel
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""JsonRpcHandler webapp.RequestHandler for TyphoonAE and Google App Engine.

See specs:
  - http://groups.google.com/group/json-rpc/web/json-rpc-2-0
  - http://groups.google.com/group/json-rpc/web/json-rpc-over-http

This version does not support:
  - *args, **kwargs and default-values are not allowed for Service Methods
  - handles only HTTP POST
  - JSON-RPC Version < 2.0 (same as 1.2) not supported

TODOs:
  - more Comments
  - Examples (doctest?)
  - Factor out handler methods to reuse in other frameworks
"""

from google.appengine.ext import webapp, db
from google.appengine.api import users
from inspect import getargspec
import cgi
import logging
import json as simplejson
import sys
import traceback
import time
import datetime



JSON_RPC_KEYS = frozenset(['method', 'jsonrpc', 'params', 'id'])


def modelrowtodict(row):
  properties = row.properties().items()
  rowdict = {}
  for field, value in properties:
    # handle the different model field types
    if isinstance(getattr(row, field), datetime.datetime):
      rowdict[field]=time.mktime(getattr(row, field).timetuple())
    elif isinstance(getattr(row, field), users.User):
      rowdict[field]=getattr(row, field).email()
    elif isinstance(getattr(row, field), db.Model):
      rowdict[field]=modelrowtodict(getattr(row, field))
    else:
      #logging.error(getattr(row, field))
      rowdict[field] = getattr(row, field)
  rowdict['key']=row.key().id()
  return rowdict
  
def modelfetchtoarray(fetched):
  output=[]
  for row in fetched:
    output.append(modelrowtodict(row))  
  return output


def ServiceMethod(fn):
    """Decorator to mark a method of a JsonRpcHandler as ServiceMethod.

    This exposes methods to the RPC interface.

    :param function fn: A function.
    :returns: A function.

    TODO:
        - Warn when applied to underscore methods
    """

    fn.IsServiceMethod = True
    return fn


class JsonRpcError(Exception):
    """Baseclass for all JSON-RPC Errors.

    Errors are described in the JSON-RPC 2.0 specs, related HTTP Status
    Codes are described in the json-rpc-over-http proposal.
    """
    code = 0
    message = None
    status = 500

    def __init__(self, message=None):
        if message is not None:
            self.message = message

    def __str__(self):
        return(self.message)

    def __repr__(self):
        return '%s("%s")' % (str(self.__class__.__name__), self.message)

    def getJsonData(self):
        error = {
            'code' : self.code ,
            'message' : '%s: %s' %
                (str(self.__class__.__name__),
                str(self.message))}
        return error

        
class ParseError(JsonRpcError):
    """Invalid JSON was received by the server.

    An error occurred on the server while parsing the JSON text.
    """

    code = -32700
    message = 'Parse error'


class InvalidRequestError(JsonRpcError):
    """The JSON sent is not a valid Request object."""

    code = -32600
    message = 'Invalid Request'
    status = 400


class MethodNotFoundError(JsonRpcError):
    """The method does not exist / is not available."""

    code = -32601
    message = 'Method not found'
    status = 404


class InvalidParamsError(JsonRpcError):
    """Invalid method parameter(s)."""

    code = -32602
    message = 'Invalid params'


class InternalError(JsonRpcError):
    """Internal JSON-RPC error."""

    code = -32603
    message = 'Internal error'


class ServerError(JsonRpcError):
    """Base Class for implementation-defined Server Errors.

    The Error Code must be between -32099..-32000
    """

    code = -32000
    message = 'Server Error'


class JsonRpcMessage(object):
    """A single JSON-RPC message.

    :param dict json: The JSON-RPC message Python representation.
    """

    def __init__(self, json=None):
        super(JsonRpcMessage, self).__init__()
        self.message_id = None
        self.notification = False
        self.error = None
        self.result = None
        if json is not None:
            self.from_json(json)

    def from_json(self, json):
        """Parses a single JSON-RPC message.

        :param dict json: The JSON-RPC message Python representation.
        """
        try:
            if not isinstance(json, dict):
                raise InvalidRequestError(
                        'Invalid JSON-RPC Message; must be an object')

            if not set(json.keys()) <= JSON_RPC_KEYS:
                raise InvalidRequestError('Invalid members in request object')

            if not ('jsonrpc' in json and json['jsonrpc'] == '2.0'):
                raise InvalidRequestError('Server supports JSON-RPC 2.0 only')

            if 'method' not in json:
                raise InvalidRequestError('No method specified')

            if not isinstance(json['method'], basestring):
                raise InvalidRequestError('Method must be a string')

            self.method_name = json['method']

            if 'params' in json:
                params = json['params']
                if not isinstance(params, (dict, list, tuple)):
                    raise InvalidRequestError(
                            "'params' must be an array or object")
                self.params = params

            if 'id' not in json:
                self.notification = True
            else:
                self.message_id = json['id']
        except InvalidRequestError, ex:
            self.error = ex
            logging.error('Encountered invalid json message')


class JsonRpcHandler(webapp.RequestHandler):
    """Subclass this handler to implement a JSON-RPC handler.

    Annotate methods with @ServiceMethod to expose them and make them callable
    via JSON-RPC. Currently methods with *args or **kwargs are not supported
    as service-methods. All parameters have to be named explicitly.
    """
    
    #def __init__(self):
    #    webapp.RequestHandler.__init__(self)

    def post(self):
        self.handle_request()

    def handle_request(self):
        """Handles POST request."""

        self.response.headers['Content-Type'] = 'application/json-rpc'
        try:
            logging.debug("Raw JSON-RPC: %s", self.request.body)
            messages, batch_request = self.parse_body(self.request.body)
        except (InvalidRequestError, ParseError), ex:
            logging.error(ex)
            self.error(ex.status)
            body = self._build_error(ex)
            self.response.out.write(simplejson.dumps(body))
        else:
            for msg in messages:
                self.handle_message(msg)

            responses = self.get_responses(messages)
            if len(responses) == 0:
                # Only notifications were sent
                self.error(204)
                return

            if batch_request:
                #TODO Which http_status to set for batches?
                self.error(200)
                body = [r[1] for r in responses]
                self.response.out.write(simplejson.dumps(body))
            else:
                if len(responses) != 1:
                    # This should never happen
                    raise InternalError()   # pragma: no cover
                status, body = responses[0]
                self.error(status)
                self.response.out.write(simplejson.dumps(body))

    def get_responses(self, messages):
        """Gets a list of responses from all 'messages'.

        Responses are a tuple of HTTP-status and body.
        A response may be None if the message was a notification and will be
        excluded from the returned list.

        :param list messages: JSON messages.
        :returns: List of responses.
        """

        responses = []
        for msg in messages:
            resp = self.get_response(msg)
            if resp is not None:
                responses.append(resp)
        return responses

    def handle_message(self, msg):
        """Executes a message.

        The method of the message is executed.
        Errors and/or results are written back to the message.

        :param dict msg: A JSON-RPC message.
        """

        if msg.error != None:
            return
        else:
            try:
                method = self.get_service_method(msg.method_name)
                params = getattr(msg, 'params', None)
                msg.result = self.execute_method(method, params)
            except (MethodNotFoundError, InvalidParamsError, ServerError), ex:
                logging.error(ex)
                msg.error = ex
            except Exception, ex:
                logging.error(ex)
                ex = InternalError("Error executing service method")
                ex.data = ''.join(traceback.format_exception(*sys.exc_info()))
                msg.error = ex

    def parse_body(self, body):
        """Parses the body of POST request.

        Validates for correct JSON and returns a tuple with a list of JSON-RPC
        messages and wether the request was a batch-request.
        Raises ParseError and InvalidRequestError.

        :param string body: The HTTP body.
        """

        try:
            json = simplejson.loads(body)
        except ValueError:
            raise ParseError()

        messages = []
        if isinstance(json, (list, tuple)):
            if len(json) == 0:
                raise InvalidRequestError('Recieved an empty batch message')
            batch_request = True
            for obj in json:
                msg = JsonRpcMessage(obj)
                messages.append(msg)

        if isinstance(json, (dict)):
            batch_request = False
            msg = JsonRpcMessage(json)
            messages.append(msg)
        return messages, batch_request

    def get_response(self, msg):
        """Gets the response object for a message.

        Returns a tuple of a HTTP-status and a json object or None.
        The JSON object may be a JSON-RPC error object or a result object.
        None is returned if the message was a notification.

        :param dict msg: A JSON-RPC message.
        :returns: Tuple with status and result.
        """
        if msg.notification:
            return None
        elif msg.error:
            return (msg.error.status, 
                    self._build_error(msg.error, msg.message_id))
        elif msg.result:
            return (200, self._build_result(msg))
        else:   # pragma: no cover
            # Should never be reached
            logging.warn('Message neither contains an error nor a result')

    def _build_error(self, err, message_id=None):
        return {'jsonrpc':'2.0',
                'error':err.getJsonData(),
                'id':message_id}

    def _build_result(self, msg):
        return {'jsonrpc':'2.0',
                'result':msg.result,
                'id':msg.message_id}

    def execute_method(self, method, params):
        """Executes the RPC method.

        :param function method: A method object.
        :param params: List, tuple or dictionary with JSON-RPC parameters.
        """
        args, varargs, varkw, defaults = getargspec(method)
        if varargs or varkw:
            raise InvalidParamsError(
                "Service method definition must not have variable parameters")
        args_set = set(args[1:])
        if params is None:
            if not len(args_set) == 0:
                raise InvalidParamsError(
                    "Wrong number of parameters; "
                    "expected %i but 'params' was omitted "
                    "from JSON-RPC message" % (len(args_set)))
            return method()
        elif isinstance(params, (list, tuple)):
            if not len(args_set) == len(params):
                raise InvalidParamsError(
                    "Wrong number of parameters; "
                    "expected %i got %i" % (len(args_set),len(params)))
            return method(*params)
        elif isinstance(params, dict):
            paramset = set(params)
            if not args_set == paramset:
                raise InvalidParamsError(
                    "Named parameters do not "
                    "match method; expected %s" % (str(args_set)))
            params = self.decode_dict_keys(params)
            return method(**params)

    def get_service_method(self, meth_name):
        # TODO use inspect.getmembers()?
        f = getattr(self, meth_name, None)
        if (f == None or not hasattr(f, 'IsServiceMethod')
                or not getattr(f, 'IsServiceMethod') == True):
            raise MethodNotFoundError('Method %s not found' % meth_name)
        return f

    def decode_dict_keys(self, d):
        """Convert all keys in dict d to str.

        Python does not allow unicode keys in dictionaries.

        :param dict d: A JSON-RPC message.
        """
        try:
            r = {}
            for (k, v) in d.iteritems():
                r[str(k)] = v
            return r
        except UnicodeEncodeError:  # pragma: no cover
            # Unsure which error is the correct to raise here.
            # Actually this code will probably never be reached
            # because "wrong" parameters will be filtered out
            # and returned as InvalidParamsError() and methods cant
            # have non-ascii parameter names.
            raise InvalidRequestError("Parameter-names must be ASCII")
