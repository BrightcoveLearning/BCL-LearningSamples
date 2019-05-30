#!/bin/bash
#Prerequisites:
#Create credentials for all accounts in text file list

#Get access token.
#If jq is not installed, remove the export line below and replace both instances of $TOKEN with a valid access token for all accounts in the text file list
#export TOKEN=`curl -X POST 'https://oauth.brightcove.com/v3/access_token?grant_type=client_credentials' -H 'Authorization: Basic REPLACE_WITH_CLIENT_CREDENTIALS' -H 'Content-Type: application/x-www-form-urlencoded' | jq -r '.access_token'`

#Validate we got a good token back
#echo $TOKEN

#Loop through publisher IDs in accountlist.txt
while read -r ACCOUNTID; do
    echo $ACCOUNTID

    #Update
    curl -X PATCH "https://players.api.brightcove.com/v1/accounts/$ACCOUNTID/players/default/configuration" \
    -H "Authorization: Bearer AC1UQxPSaswR1BNa9MybE9NHipbpt_njF53bbiFddKMXmdpPQnm1a15XLTooJIzCXtKJVy8PFn_qhqccaEZsCTHXYSU7eRU2u7D53ciMdV0oGV2zKZOJR1rD0vFSdZvdFXDu5LF6UXUlBUxa6hbzNhvtEK62Oecy6FjDkVJfNuxklIDVm9498vbjEtiq9FY1r6F2K3gpMhTdFQOVyj35fAouV7Bb9jXFk_pchAIU2tS1wYoa9Hlfp_GQK1HHO67U0gX854fexV7rpc3Whnva03N7PUu4ORiRy1H4JhP-ZqRRmSV4kvmuRyWT-PbydFqqXuq8nLEGHxstODz2Ae-RayadALBswz_ZLw" \
    -H 'Content-Type: application/json' \
    -d '{"player":{"template":{"version":"6.34.3"}}}'

    #Publish
    curl -X POST "https://players.api.brightcove.com/v1/accounts/$ACCOUNTID/players/default/publish" \
    -H "Authorization: Bearer AC1UQxPSaswR1BNa9MybE9NHipbpt_njF53bbiFddKMXmdpPQnm1a15XLTooJIzCXtKJVy8PFn_qhqccaEZsCTHXYSU7eRU2u7D53ciMdV0oGV2zKZOJR1rD0vFSdZvdFXDu5LF6UXUlBUxa6hbzNhvtEK62Oecy6FjDkVJfNuxklIDVm9498vbjEtiq9FY1r6F2K3gpMhTdFQOVyj35fAouV7Bb9jXFk_pchAIU2tS1wYoa9Hlfp_GQK1HHO67U0gX854fexV7rpc3Whnva03N7PUu4ORiRy1H4JhP-ZqRRmSV4kvmuRyWT-PbydFqqXuq8nLEGHxstODz2Ae-RayadALBswz_ZLw" \
    -H 'Content-Type: application/json' \
    -d '{"comment": "Updated to v6"}'

    #Wait 1 second then loop
    sleep 1
done <accountList.txt
