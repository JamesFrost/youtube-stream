# youtube-stream
Stream Youtube Livestream Chat in Nodejs.

```bash
npm install --save youtube-stream
```
## Usage
### ``` .connect(auth, accessToken, liveChatId, callback) ```
#### ```auth```
```json
{
  "client_id" : "yourAppClientId",
  "client_secret" : "yourAppClientSecret",
  "redirect_uris" :
  [
    "yourAppRedirectUris"
  ]
}
```
#### ```accessToken```
Access token of the user you are collecting for.
#### ```liveChatId```
Live Chat Id of the live stream you want to collect.
#### ```callback```
Function invoked with ```(err, results)```.

Will be executed at regular intervals with new messages.

If ```err``` is set, the stream will stop.
## License
MIT
