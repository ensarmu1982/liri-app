var env = require("dotenv").config();
var keys = require('./keys');
var request = require("request");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// Store all of the arguments in an array
// Takes in all of the command line arguments
var nodeArgs = process.argv;

//first check what is called in nodeArgs movie, spotify, twitter or other
//use if-else to call the movie, spotify or twitter function 
var selectedLiri = nodeArgs[2];

// Based on the selectedLiri  we run the appropriate APP
if (selectedLiri  === "my-tweets") {
  twitterApp();
}
else if (selectedLiri  === "spotify-this-song") {
    value = process.argv.slice(3);
    spotifyAPP(value);
}
else if (selectedLiri  === "do-what-it-says") {
    //read from file random.txt spotify-this-song,"I Want it That Way"
    defaultSong();
}

else {
    // else if (selectedLiri  === "movie-this") 
    // If no song is provided then program will default to "The Sign" by Ace of Base
    movieApp();
}

//OMDB APP
//node liri.js movie-this '<movie name here>'
function movieApp(){
    // Create an empty variable for holding the movie name
    var movieName = "";

    // Loop through all the words in the node argument
    // And do a little for-loop magic to handle the inclusion of "+"s
    if (nodeArgs[3] === undefined){
        movieName = "The+Sign";
    }
    else{
        var movieName= process.argv.slice(3)
    }

    // Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(error, response, body) {

        //check if movie name selected for the tomatoRate
        if (nodeArgs[3] === undefined){
                var tomatoRate = 0;
        } 
        else{
            var tomatoRate = 1;
        }

        // If the request is successful
        if (!error && response.statusCode === 200) {
            var data = JSON.parse(body);
            // Parse the body of the site and recover
            console.log("=======================================");
            console.log("\nMovie Title: " + data.Title + "\nRelease Year: " + data.Released + "\nIMDB Rating: " + data.imdbRating+
            "\n" + data.Ratings[tomatoRate].Source + ": " + data.Ratings[tomatoRate].Value + "\nCountry produced: " + data.Country +
            "\nLanguage: " + data.Language +"\nPlot: " + data.Plot + "\nActors: " + data.Actors);
            console.log("=======================================");
        }
        storeLogs(body);
    });
}

//TWITTER  APP
// `node liri.js my-tweets`
// This will show your last 20 tweets and when they were created at in your terminal/bash window.
// Twitter Node Program
function twitterApp() {
    var params = {q: 'EnsarmuShino'};
    var countLimit = 20; 

    client.get('search/tweets', params, function (error, tweets, response) {
      console.log("\n=======================================");
      if(error) throw error;
      var count = tweets.statuses.length;
      var i = 0;
      while ((count <= countLimit)  && (i < count)) {
        console.log("Created: " + tweets.statuses[i].created_at + "   Tweets: " + tweets.statuses[i].text);
        i++;
      }
      console.log("=======================================");
    });
  };

//SPOTIFY APP HERE
// node liri.js spotify-this-song '<song name here>'
// Will show the following information about the song in your terminal/bash window
//   * Artist(s) * The song's name  * A preview link of the song from Spotify  * The album that the song is from

function spotifyAPP(value) {

  spotify.search({ type: 'track', query: value }, function (err, data) {
    if (err) {
      return console.log('Error: ' + err);
    }
    console.log("\n Artist(s): " + data.tracks.items[0].album.artists[0].name);
    console.log("\n A preview link of song from Spotify: " + data.tracks.items[0].external_urls.spotify);
    console.log("\n Song name: " + data.tracks.items[0].name);
    console.log("\n Album: " + data.tracks.items[0].album.name);
  });
};


//READ FORM "random.txt" file. to set the defaultSong
// It's important to include the "utf8" parameter or the code will provide stream data (garbage)
// The code will store the contents of the reading inside the variable "data"

function defaultSong(){
    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
          return console.log(error);
        }
        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");
        var value = dataArr[1].slice();
        // console.log(value);
        //call spotify with new value
        spotifyAPP(value);
      });      
}

function storeLogs(value){

    
    // We then store the textfile filename given to us from the command line
    
    // var textFile = JSON.parse(value);
    var textFile = value;


    // We then append the contents "Hello Kitty" into the file
    // If the file didn't exist then it gets created on the fly.
    fs.appendFile("log.txt", ("\n" + textFile + "\n"), function(err) {

    // If an error was experienced we say it.
    if (err) {
        console.log(err);
    }

    // If no error is experienced, we'll log the phrase "Content Added" to our node console.
    else {
        console.log("Content Added!");
    }

    });

}
