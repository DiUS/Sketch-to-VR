# Sketch-to-VR

It works on a Sketch file like this

![alt tag](https://raw.githubusercontent.com/auxdesigner/Sketch-to-VR/master/_mock.png)

And turns it into VR like this

![alt tag](https://github.com/auxdesigner/Sketch-to-VR/raw/master/_vr.gif)

Demo: https://www.youtube.com/watch?v=lJ7aFtqsAUU


##Installation:
1. demo.sketch has the layout required
2. Double click on SketchToVR.sketchplugin. This installs the ability to export the 'ui' and 'background' layers to s3

##Export your mocks with the plugin
1. Open the demo Sketch file. The “background” artboard is a 360° photo. The “ui” artboard is the interface on top of the photo. In order to be seamless, the 360° photo you use should be [equirectangular](https://en.wikipedia.org/wiki/Equirectangular_projection). There are some examples on [Flickr](https://www.flickr.com/groups/equirectangular/). The one in my file is from [Nick Hobgood](https://www.flickr.com/photos/globalvoyager/27869867466/).
2. Go to 'Plugins > Sketch to VR > Save VR layouts to documents' to save the images to your 'documents/Sketch-to-vr' folder.
3. Go to 'Plugins > Sketch to VR > Export VR background to s3' to push the background layer to s3
4. Go to 'Plugins > Sketch to VR > Export VR UI to s3' to push the ui layer to s3

##View your mocks in VR
View the results in the [Mobile viewer](http://3dius-sketch-to-vr.s3-website-ap-southeast-2.amazonaws.com/)

##Troubleshooting
- For now, the layers must be called 'background' and 'ui'

##Credits:
- this prototype was originally forked from - https://github.com/auxdesigner/Sketch-to-VR
- Photo from demo template file: https://www.flickr.com/photos/globalvoyager/27869867466/

##eat.rent
This is a proposed prototype to see if we can get rapid feedback for VR mocks

The steps required are:
1) use sketch to create images
2) upload images to s3
  * Using a sketch plugin
  * Post the files to an api endpoint
  * that ‘system’ saves the files to s3
3) view images in VR
  * VR application talks to s3 bucket

This is separated out into three systems:

Sketch (this project has the plugin) - Front end for creating resources, PUT data to Resources service
[VR Viewer](https://github.com/DiUS/3DiUS-ReactVRUXTools/tree/SketchViewer) - GET data from Resources service, either via api or directly
Amazon resources - Resources service

We can use an amazon api gateway to talk directly to a s3 bucket
http://docs.aws.amazon.com/apigateway/latest/developerguide/integrating-api-with-aws-services-s3.html

##AWS notes for the gateway 
* We need a new s3 policy for our new IAM role:

```
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
```

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
