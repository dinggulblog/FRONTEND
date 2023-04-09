# dinggul blog project

website link: https://dinggul.me/

# 

+ Manage posts and media
+ Categorize posts
+ Various post viewing
+ Member Roles
+ Markdown Editor
+ Content moderation
+ User Profile moderation
+ Amazon S3 integration
+ Statistics like pageviews via Google Analystics(incomplete)

## Installaion

Backend repository: https://github.com/dinggulblog/BACKEND

1. Download this repo and frontend repo together.
The backend folder and the frontend folder must be located on the same path like below.

![](https://user-images.githubusercontent.com/56054637/206503039-3351861d-b55c-4146-a781-dbde6cdc32cd.PNG)

2. Run the following commands at the root of each folder<br>
``` npm install --save-dev ```

3. Create the ```.env.develop``` file in the same path and insert the appropriate key-values referring to the ```env-example.json``` file.<br>
> Required keys in .env:
> + HOST
> + HOST_MAIL
> + MONGO_ATLAS_CONNECT_URL
> + COOKIE_SECRET
> + SECRET_KEY_DIR
> + JWT_PUBLIC_DIR
> + JWT_PRIVATE_DIR

## Project Frontend stack

VUE.js / Vuex<br>
Javascript<br>
HTML5<br>
CSS3<br>
SCSS<br>

### Project prototype design

< AdobeXD ><br>
https://xd.adobe.com/view/9f7ff999-9b8e-47e9-a9f4-b27506588bd4-ca2c/grid/<br>
<br>
※ 초기 시안으로 현재 사이트에 맞추어 변경 예정

### License

Dinggule Blog is open-sourced software licensed under the MIT license.<br>
(※ Excluding design)
