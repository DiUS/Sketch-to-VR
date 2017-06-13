# Sketch-to-VR

It works on a Sketch file like this

![alt tag](https://raw.githubusercontent.com/auxdesigner/Sketch-to-VR/master/_mock.png)

And turns it into VR like this

![alt tag](https://github.com/auxdesigner/Sketch-to-VR/raw/master/_vr.gif)

Demo: https://www.youtube.com/watch?v=lJ7aFtqsAUU


##Installation: 
1. Download Zip and Extract it. There’s a demo sketch file and a SketchToVR.sketchplugin.
2. Double click on SketchToVR.sketchplugin. Sketch will install the plugin.

##Export your mocks with the plugin 
1. Open the demo Sketch file. The “background” artboard is a 360° photo. The “ui” artboard is the interface on top of the photo. In order to be seamless, the 360° photo you use should be [equirectangular](https://en.wikipedia.org/wiki/Equirectangular_projection). There are some examples on [Flickr](https://www.flickr.com/groups/equirectangular/). The one in my file is from [Nick Hobgood](https://www.flickr.com/photos/globalvoyager/27869867466/).
2. Go to Plugins > Sketch to VR > Export. The export may be slow due to the size of the 360° photo.

##View your mocks in VR 
1. The exported folder will be used to run [A-Frame, an open-source Web VR library developed](https://aframe.io/) by [MozVR](https://mozvr.com/). It needs a local server to work (simply opening the HTML page will not work). I recommend the [SimpleHTTPServer by Scott Garner](http://www.scottmadethis.net/interactive/simpleserver/). Right click on the exported folder and choose SimpleHTTPServer. Use click & drag to navigate.
2. To preview on your phone with a Cardboard, there are a few options. If you own a website, just upload this folder to your website and access the URL from your phone. Or you can use [Chrome port forwarding](https://developers.google.com/web/tools/chrome-devtools/debug/remote-debugging/local-server?hl=en) to open localhost:8000 on your phone (initial page load may be slow due to the size of the 360° photo). Tap on the bottom right Cardboard icon to switch to VR mode!

##Troubleshooting
- If you use your own sketch files, make sure to name your artboards “background” and “ui”.
- If you get a system prompt dialog while using SimpleHTTPServer, choose Allow. 
- If you get some console errors and can’t see anything on the web page, restart the browser.
- If you created your own photo / UI, you may need to go into the index.html file to adjust the dimension of the images. [Read more about A-Frame](https://aframe.io/docs/0.2.0/guide/).

##Credits:
- Code structure borrowed from: https://github.com/Raureif/sketch-click-dummy
- Photo from demo template file: https://www.flickr.com/photos/globalvoyager/27869867466/
- SimpleHTTPServer: http://www.scottmadethis.net/interactive/simpleserver/

##eat.rent
The steps required are:

1) use sketch to create images
2) upload images to s3
  * Using a sketch plugin
  * Post the files to an api endpoint
  * that ‘system’ saves the files to s3
3) view images in VR
  * VR application talks to s3 bucket

This setup could be separated out into

Sketch - Front end for creating resources, PUT data to Resources service
VR Viewer - GET data from Resources service, either via api or directly
Amazon resources - Resources service

We can use an amazon api gateway to talk directly to a s3 bucket
http://docs.aws.amazon.com/apigateway/latest/developerguide/integrating-api-with-aws-services-s3.html

* We need a new s3 policy for our new IAM role:

'''
{
  "Version": "2012-10-17",
    "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:Get*",
        "s3:List*",
        "s3:Put*",
        "s3:Post*"
      ],
      "Resource": "*"
    }
  ]
}
'''

* Create an 'Amazon API Gateway' IAM role and attach the new policy

* Create API Resources to Represent Amazon S3 Resources
  * create an API named sketch-to-vr. This API's root resource (/) represents the Amazon S3 service.
  * Under the API's root resource, create a child resource named Folder and set the required Resource Path as /{folder}.
  * For the API's Folder resource, create an Item child resource. Set the required Resource Path as /{item}.
* Create our endpoints. We are interested in PUT and GET
  * follow instructions from the url to setup the get endpoint
  * follow instructions from the url to setup our IAM role to control access to the GET method under 'Method Request'
  * follow instruction to add 200,400,500 http reponses under 'Method Response'
  * follow instruction to setup 'Integration Response'
  * follow instructions to add GET and PUT method requests under '/{folder}' in the resources tree
    * for future ref - http://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketPUT.html#RESTBucketPUT-requests
