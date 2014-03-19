SampleBCOVIMAWidevine
=====================

Brightcove Player SDK for iOS sample using Google IMA and Widevine.

In order to use this sample, you will need to add the Brightcove Cocoapods Specs repo.

`pod repo add BCOVSpecs https://github.com/brightcove/BCOVSpecs.git`

Then run `pod install` from the root of this repository and use the workspace file that gets generated.

**Notes**
* You will need to enter your IMA Publisher ID in place of `insertyourpidhere` in the ViewController implementation before you can run the app on your device
* For security reasons, this app will not run in iPhone or iPad simulator - you will need to test on an iOS device
