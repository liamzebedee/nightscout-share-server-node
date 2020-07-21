
## Install.

```
docker build -t nightscout-dexy .
docker run -e NIGHTSCOUT_ENDPOINT_URL=https://NIGHTSCOUT_INSTANCE.herokuapp.com -p 80:80 nightscout-dexy
```

## Testing

```sh
$ curl -X POST localhost/ShareWebServices/Services/General/LoginPublisherAccountByName

{"data":"satoshiwasblack"}

$ curl -X POST --header "Content-Type:application/json" -d "{\"sessionId\": \"\", \"minutes\": 1440, \"maxCount\": 50}" localhost/ShareWebServices/Services/Publisher/ReadPublisherLatestGlucoseValues
[{"Value":166,"Trend":4,"WT":"/Date(1594971176487)/"},{"Value":165,"Trend":4,"WT":"/Date(1594970876470)/"},{"Value":165,"Trend":4,"WT":"/Date(1594970576494)/"},{"Value":164,"Trend":4,"WT":"/Date(1594970276523)/"},{"Value":164,"Trend":4,"WT":"/Date(1594969976587)/"},{"Value":162,"Trend":3,"WT":"/Date(1594969676568)/"},{"Value":157,"Trend":4,"WT":"/Date(1594969376505)/"},{"Value":153,"Trend":3,"WT":"/Date(1594969076527)/"}]}]
```