#!/bin/bash

#Loop through publisher IDs in accountlist.txt
while read -r ACCOUNTID; do
    echo $ACCOUNTID

    #Update
    curl -X PATCH "https://players.api.brightcove.com/v1/accounts/$ACCOUNTID/players/default/configuration" \
    -H "Authorization: Bearer YOUR_TOKEN_HERE" \
    -H 'Content-Type: application/json' \
    -d '{"player":{"template":{"version":"6.34.3"}}}'

    #Publish
    curl -X POST "https://players.api.brightcove.com/v1/accounts/$ACCOUNTID/players/default/publish" \
    -H "Authorization: Bearer YOUR_TOKEN_HERE" \
    -H 'Content-Type: application/json' \
    -d '{"comment": "Updated to v6"}'

    #Wait 1 second then loop
    sleep 1
done <accountList.txt
