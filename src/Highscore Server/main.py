#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
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
#
import webapp2
from webapp2_extras import json
from google.appengine.ext import db

# IN MY APP I'M RUNNING MY SERVER OFF GOOGLE APP ENGINE IF THERES A PROBLEM ACCESSING IT PLEASE E-MAIL
# b00234203@studentmail.uws.ac.uk AS IT MAY BE OVER THE DAILY QUOTA (unlikely but can't be too careful)

# the data model in this case our Highscore, has a score, player name and position on the score board
class Highscore(db.Model):
	score = db.IntegerProperty() # variables other than the key that the db model is composed of
	playerName = db.StringProperty() 
	def getHighscore(self):
		scoreMessage = { # compose what our db model message looks like
			"score": self.score,
			"position": self.key().name(),
			"playerName": self.playerName
		}
		return json.encode(scoreMessage) # encode it into a json message and return it

# returns all of the Highscores
class HighscoreRetriever(webapp2.RequestHandler):
	
	def get(self):
		callback = self.request.get('callback') # request callback function
		result = Highscore.all()              # get all the highscores
		self.response.headers['Content-Type'] = "application/json" # set header type to json
		if result.count(1): # checks if there actually is any results to send back before trying to send them
			json = '['                            #package highscore data
			for loc in result:
				json += loc.getHighscore() + ','
			json = json[:-1] + ']'
			self.response.write(callback + '(' + json + ')')    # return it back to the application that requested it

# adds a highscore value
class SendHighscore(webapp2.RequestHandler): # respond to /loc URL

	def get(self):
		sc = int(self.request.get('score'))      # get score
		name = self.request.get('playerName')    # get player name (not using this as our Unique value as we can have more than one same name)
		pos = self.request.get('name') # and position to use as our key as we'll only ever have 10 unique highscores at a time
		result = Highscore.get_or_insert(pos)   # creates or retrieves
		self.response.headers['Content-Type'] = "application/json" # setting the header type, required even for just recieving (Warning otherwise)
		result.playerName = name                        # and update player name, score and positin then add it to the database 
		result.position = pos
		result.score = sc
		result.put()


app = webapp2.WSGIApplication([
    ('/', HighscoreRetriever),
    ('/loc', SendHighscore)
], debug=True)
