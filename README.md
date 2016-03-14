Blog Reader App - Meteor
===================

This is an app for reading one of the famous tamil blogs [http://www.nisaptham.com](http://www.nisaptham.com).This app is built using Meteor so you can use this code base to create a web-app or an android or an iOS app. The Android app is out already and it can be downloaded from [here](https://play.google.com/store/apps/details?id=com.nisaptham.siva)

Though this app is aimed at reading the nisaptham.com blog, it can be used to read any blogs (provided the blog is provided by blogger.com). You more than welcome to improve this app by adding new features / fixing bugs / or giving suggestions

Setup
-----

1)  Clone this repo using the following command

`git clone https://github.com/subramaniashiva/blog-reader-meteor.git`


2)  Move to the repo that you have just clone and run the following command

`npm install`

3) Install meteor by following [this page](https://www.meteor.com/install) or by running following commands

`curl https://install.meteor.com/ | sh`

4) This project is enabled with **ESLint**. Any JS file that you write must be linted using ESLint. To run the linting command type

`npm run lint`

5) To start the app, run the following command and navigate to http://localhost:3000 in your browser

`npm run start`

6) To start the app in an Android emulator, run the following command

`npm run android`

7) To start the app in an Android device that you have connected with your machine, run the following command

`npm run android-device`


Tech Stack
----------
Following is the tech stack:

 - **Meteor** - The entire app uses Meteor framework. Using Meteor you can write your application in JavaScript and can package and run in android or iOS environments. To read more about meteor, visit the following link: https://www.meteor.com/
 - **ESLint** - Used to lint the JS code

Directory Structure
-------------------
 - **lib** - Contains the static / project specific config
 - **resources** - Contains static resources like android icons or splash screens
