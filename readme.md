# rss2topic
Based on the items of RSS feeds the script creates topics in Méthode for Swing topic planning using EDAPI

Configurable features:
- RSS input feeds
- Méthode instances 
- Image integration

Two step procedure:
- Read RSS feed and store locally
- Create topics from the local data

## Read RSS feed and store locally
run **readRSS \<channel\>** e.g. readRSS tonline
- channel is one configured RSS channel name, e.g. "tonline"

The script reads the feed and creates a JSON file with the contents for each item in the local subdirectory tmp/\<channel\>/json. The references to the images for each item are retrieved and stored locally in the tmp/\<channel\>/img subdirectory.

The configuration ist stored under config/rss/\<channel\> e.g. "tonline". The cleaning of the RSS feed content and the mapping to the content structure is configured in the XSL transformations.

## Create topics from the local data
run **createTopics \<channel\> \<instance\>**
- channel is one configured RSS channel name (see above)
- instance is one configured Méthode instance, e.g. "demode"

The script reads the JSON files from the local subdirectory tmp/\<channel\>/json and creates for each item a topic, a topic item, an article and uploads the image if available. It also creates the correlations between the article and the topic item and between the topic and the image. If you want to import only some of the JSON files, delete the others in the folder before you run the script.

The configuration of the instance is stored under config/methode/\<instance\> e.g. "demode"

A token is necessary to access the instance, which is created and stored as ".token" in the instance directory.

## All in one script
run **rss2topic \<channel\> \<instance\>** e.g. "rss2topic tonline demode"

The both scripts above are called by this script.

## Installation
The following software packages are required on your local machine
- NodeJS (https://nodejs.org/) 
- Curl (e.g. https://curl.se/)

Run **npm install** in the rss2topic directory to install all dependent modules.

Include your credentials in the instance.json configuration file 

## Demorun

        $>rss2topic tonline demode
        11:46:28 = readRSS start
        11:46:28 - download feed https://feeds.t-online.de/rss/wirtschaft to file tmp\tonline\feed.rss
        11:46:30 - created 20 json files in tmp\tonline\json
        11:46:38 - downloaded 20 image files in tmp\tonline\img
        11:46:38 = readRSS ready
        11:46:38 = createTopics start
        11:46:38 - new session token created on instance demode
        11:46:38 - create topic set on demode from tonline with file 100105524.json 
                # RSS item start 100105524 Investmentausblick 2023 | Warum es sich langfristig lohnen kann, durchzuhalten
                - Topic: 33$1.0.121124668 20230117 /Product/Business Investmentausblick 2023 _ Warum es sich langfristig lohnen kann, durchzuhalten
                - TopicItem: 33$1.0.121126761 20230117 /Product/Business Investmentausblick 2023 | Warum es sich langfristig lohnen kann, durchzuhalten
                - Image: 33$1.0.121128128 /Product/Business 100105524-talmaerkten-bevor.jpg
                - Story: ERROR The entity name must immediately follow the '&' in the entity reference.
                - RSS item ready 100105524
        11:46:38 - create topic set on demode from tonline with file 100112468.json 
                # RSS item start 100112468 Die Schere zwischen arm und reich in Deutschland: "Die Kluft wird sich vertiefen"
                - Topic: 33$1.0.121129128 20230117 /Product/Business Die Schere zwischen arm und reich in Deutschland_ _Die Kluft wird sich vertiefen_
                - TopicItem: 33$1.0.121131171 20230117 /Product/Business Die Schere zwischen arm und reich in Deutschland: "Die Kluft wird sich vertiefen"
                - Image: 33$1.0.121134450 /Product/Business 100112468-image.jpg
                - Story: 33$1.0.121136604 /Product/Business Die-Schere-Deutschland-1674038801.xml
                - RSS item ready 100112468
        11:46:38 - create topic set on demode from tonline with file 100112516.json 
                # RSS item start 100112516 Zwei Jahre vor Rente selbst kündigen: Darauf sollten Sie achten
                - Topic: 33$1.0.121129141 20230118 /Product/Business Zwei Jahre vor Rente selbst kündigen_ Darauf sollten Sie achten
                - TopicItem: 33$1.0.121131190 20230118 /Product/Business Zwei Jahre vor Rente selbst kündigen: Darauf sollten Sie achten
                - Image: 33$1.0.121134477 /Product/Business 100112516-de-genannt-werden.jpg
                - Story: 33$1.0.121136619 /Product/Business Zwei-Jahre-Rente-1674038803.xml
                - RSS item ready 100112516
        ...
        11:46:38 - create topic set on demode from tonline with file 89434154.json
                # RSS item start 89434154 Erben: Das sollten Sie über Testament, Erbfolge und Steuern wissen
                - Topic: 33$1.0.121135659 20230118 /Product/Business Erben_ Das sollten Sie über Testament, Erbfolge und Steuern wissen
                - TopicItem: 33$1.0.121129335 20230118 /Product/Business Erben: Das sollten Sie über Testament, Erbfolge und Steuern wissen
                - Image: 33$1.0.121132465 /Product/Business 89434154-stament-schreiben.jpg
                - Story: 33$1.0.121139914 /Product/Business Erben-Das-Sie-1674038846.xml
                - RSS item ready 89434154
        11:47:28 = createTopics ready

## Internal JSON format

        {
                "id": "100105630",
                "subject": "Bald könnten wir ein halbes Jahr Sommer haben",
                "pubdate": "Tue, 03 Jan 2023 14:26:08 +0000",
                "category":"National",
                "caption":"Die Winter werden wärmer, ...",
                "image":"100105630-image.png",
                "body":"<p class=\"start\">Die Winter werden wärmer, ...</p>"
        }
