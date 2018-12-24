#!/bin/bash
previousUrl=uat.hk.wisready.com:8005
loginUrl=http://${previousUrl}/api/windbase/user/codeLogin
echo ${loginUrl}
result=$(
curl --request POST \
  --url ${loginUrl} \
  --header 'Content-Type: application/json' \
  --data '{"countryCode":86,"tel":"13865996527","verCode":"1325","deviceID":"android_xx123fa","country":"china","language":"en","autoRegister":false}')
echo ${result}
