Objectives and Goals:

* Authorize API calls
* Create a player with the APIs
* Grab an embed code for your player
* Develop/Test a plugin
* Add a plugin to a player
* Preview Players vs. Published Players
* In-Page Embed vs. Iframe Embed
* Template configuration

API Reference / Player Guide: http://docs.brightcove.com/en/video-cloud/players/index.html

Create a player:
```bash
export ACCOUNT_ID=12345
export EMAIL='<YOUR_VIDEOCLOUD EMAIL'
curl --user $EMAIL -X POST https://players.api.brightcove.com/v1/accounts/$ACCOUNT_ID/players
```

Updating the player with a video:
```bash
export PLAYER_ID='<GRAB PLAYER ID FROM CREATE RESPONSE>'
mkdir ~/workshop/
touch ~/workshop/player.json
```
player.json:
```json
{
  "media": {
    "sources": [{
      "src":"http://video-js.zencoder.com/oceans-clip.mp4", "type":"video/mp4"
    }]
  }
}
```
```bash
export PATH_TO_PLAYER_JSON=/Users/lwhitaker/workshop/player.json (You cannot use a ~)
curl --user $EMAIL -d @$PATH_TO_PLAYER_JSON -X PATCH -H "Content-Type: application/json" https://players.api.brightcove.com/v1/accounts/$ACCOUNT_ID/players/$PLAYER_ID/configuration
```

Activating a player with video:
```bash
curl --user $EMAIL -X PUT https://players.api.brightcove.com/v1/accounts/$ACCOUNT_ID/players/$PLAYER_ID/active
```

Updating the player with a poster:
player.json:
```json
{
  "media": {
    "sources": [{
      "src":"http://video-js.zencoder.com/oceans-clip.mp4", "type":"video/mp4"
    }],
    "poster": {
      "highres":"http://static02.mediaite.com/geekosystem/uploads/2013/12/doge.jpg"
    }
  }
}
```
```bash
curl --user $EMAIL -d @$PATH_TO_PLAYER_JSON -X PATCH -H "Content-Type: application/json" https://players.api.brightcove.com/v1/accounts/$ACCOUNT_ID/players/$PLAYER_ID/configuration
```

Activating a player with poster and video:
```bash
curl --user $EMAIL -X PUT https://players.api.brightcove.com/v1/accounts/$ACCOUNT_ID/players/$PLAYER_ID/active
```

Creating a local git repo:
```bash
mkdir ~/workshop/resources
cd ~/workshop/resources
git init
```

Creating a simple script and commiting to git:
```bash
touch ~/workshop/resources/plugin.js
git add plugin.js
git commit -m 'Console plugin.'
```

Creating a remote repo in Brightcove:
```bash
export REPO_NAME=workshop
curl --user $EMAIL -X PUT https://repos.api.brightcove.com/v1/accounts/$ACCOUNT_ID/repos/$REPO_NAME
```

Associating the local repo with the Brightcove repo and pushing up script:
```bash
git remote add origin https://repos.api.brightcove.com/v1/accounts/$ACCOUNT_ID/repos/$REPO_NAME
git push origin master
```

Adding an arbitrary script to the player:
player.json:
```json
{
  "media": {
    "sources": [{
      "src":"http://video-js.zencoder.com/oceans-clip.mp4", "type":"video/mp4"
    }],
    "poster": {
      "highres":"http://static02.mediaite.com/geekosystem/uploads/2013/12/doge.jpg"
    }
  },
  "scripts": [
    "http://players.brightcove.com/<YOUR_ACCOUNT_ID>/workshop/plugin.js"
  ]
}
```
```bash
curl --user $EMAIL -d @$PATH_TO_PLAYER_JSON -X PATCH -H "Content-Type: application/json" https://players.api.brightcove.com/v1/accounts/$ACCOUNT_ID/players/$PLAYER_ID/configuration
```

Activate the player with the script:
```bash
curl --user $EMAIL -X PUT https://players.api.brightcove.com/v1/accounts/$ACCOUNT_ID/players/$PLAYER_ID/active
```

Creating a plugin and pushing it up to Brightcove:
```bash
touch ~/workshop/resources/plugin.css
git diff
git add ~/workshop/resources/plugin.css
git add ~/workshop/resources/plugin.js
git commit -m 'Wow plugin.'
git push origin master
```

Adding a plugin with options to the player:
player.json:
```json
{
  "media": {
    "sources": [{
      "src":"http://video-js.zencoder.com/oceans-clip.mp4", "type":"video/mp4"
    }],
    "poster": {
      "highres":"http://static02.mediaite.com/geekosystem/uploads/2013/12/doge.jpg"
    }
  },
  "scripts": [
    "http://players.brightcove.com/<YOUR_ACCOUNT_ID>/workshop/plugin.js"
  ],
  "stylesheets": [
    "http://players.brightcove.com/<YOUR_ACCOUNT_ID>/workshop/plugin.css"
  ],
  "plugins": [{
    "name": "wow",
    "options": {
      "text": "so brightcove"
    }
  }]
}
```
```bash
curl --user $EMAIL -d @$PATH_TO_PLAYER_JSON -X PATCH -H "Content-Type: application/json" https://players.api.brightcove.com/v1/accounts/$ACCOUNT_ID/players/$PLAYER_ID/configuration
```

Activate the player with the plugin and scripts:
```bash
curl --user $EMAIL -X PUT https://players.api.brightcove.com/v1/accounts/$ACCOUNT_ID/players/$PLAYER_ID/active
```