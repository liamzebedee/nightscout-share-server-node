# nightscout-share-server-node

Bridges Nightscout data into a Dexcom Share server compatible API. It's the opposite of the bridges you usually find, and is realistically a bespoke hack for looping (see [this issue](https://github.com/LoopKit/Loop/issues/1134)). 

This is a fork of the https://github.com/Andrei0105/NightscoutShareServer, reimplemented simply in Node.js/Express and with a Dockerfile that works (TM).

## Install.

### Heroku

```sh
$ heroku create

Creating app... done, ⬢ blah-blah-blah
https://blah-blah-blah.herokuapp.com/ | https://git.heroku.com/blah-blah-blah.git

$ git push heroku master

# Now configure NIGHTSCOUT_ENDPOINT_URL in the "Config vars" of Heroku dashboard.
```

### Personal VPS.

```
docker build -t nightscout-dexy .
docker run -e NIGHTSCOUT_ENDPOINT_URL=https://NIGHTSCOUT_INSTANCE.herokuapp.com -p 80:80 nightscout-dexy
```

## Usage.

```sh
# Authentication endpoint.
$ curl -X POST localhost/ShareWebServices/Services/General/LoginPublisherAccountByName
{"data":"satoshiwasblack"}

# Glucose data endpoint.
$ curl -X POST --header "Content-Type:application/json" -d "{\"sessionId\": \"\", \"minutes\": 1440, \"maxCount\": 50}" localhost/ShareWebServices/Services/Publisher/ReadPublisherLatestGlucoseValues
[{"Value":166,"Trend":4,"WT":"/Date(1594971176487)/"},{"Value":165,"Trend":4,"WT":"/Date(1594970876470)/"},{"Value":165,"Trend":4,"WT":"/Date(1594970576494)/"},{"Value":164,"Trend":4,"WT":"/Date(1594970276523)/"},{"Value":164,"Trend":4,"WT":"/Date(1594969976587)/"},{"Value":162,"Trend":3,"WT":"/Date(1594969676568)/"},{"Value":157,"Trend":4,"WT":"/Date(1594969376505)/"},{"Value":153,"Trend":3,"WT":"/Date(1594969076527)/"}]}]
```