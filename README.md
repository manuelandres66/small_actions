# Small Actions
Small actions is a helpful web, where you can find in a map with places where you can help other people.

## Distinctiveness and Complexity
The web is very unique, a hole new idea, it dosent come close to any other project.

## What’s contained in each file you created.
The web is divided into two apps, the maps app, and the login app. Notice that the templates folder and static folder are unique, so each folder is divided into login and maps folders. 
In static, each folder is divided into CSS, javascript, and images.
```
templates
      |-login
      |-maps
   static
      |-login
          |-css
          |-images
          |-javascript
      |-maps
          |-css
          |-images
          |-javascript
```
It also has a media folder for images that the users upload in ImageFields.

#### Maps
The map app has 3 models: The Organization model, the Help model, and the Help Photo model.
* **Organization:**
For upload a place where you can help is necessary an organization that admin that place. 
* **Help:**
Is the place model, it has a uuid, not a id like a normal server
* **HelpPhoto:**
Is a model related to a ManyToManyField in Help, I used it because I don't know the number of photos that a place will have.

#### Login
The login app has 1 model, the user model. It's a modification of an AbstractUser, with many improvements like account photo, or latitude and longitude.

## How to run
I still don't have a domain, so you have to run `python manage.py runserver` 

Once run, the main app has a Mapbox map, when you click a (temporary fictional) place, the left react component changes and give you two buttons, the more info, and the view route buttons.

**_Recommendation_: Search for a real place, the "Banco de Alimentos" a place in Madrid, Spain**

* **The info page:**
Shows all the info, recommendations, photos, and organization info of a place

* **The route page:**
In there you can enter a code and the instructions to get the code, if you're logged in and the code it's right, you will earn points. It also has a map with the directions to go there from your save location if you're logged in or allows you to choose a location.

* **The Account page:**
There you can see and modify your account, also see the ranking of points with all the other users.

## Additional information
I want to improve this page in the future and make it professional for a serious project so please don't share any information about this.
