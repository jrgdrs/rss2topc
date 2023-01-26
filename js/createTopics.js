const fs = require('fs');

var myArgs = process.argv.slice(2);
var channel = myArgs[0]
var instance = myArgs[1]
var filename = myArgs[2]

var dirname = "./tmp/"+channel+"/json/";
//var content = ""
var PRE = "         - "

fs.readFile(dirname + filename, 'utf-8', function(err, content) {
	//if (err) { onError(err); return; }
	if (err) { return console.log(PRE + err) } 
	processJSON(filename, content)
})

function processJSON(filename, content){
	if( isJsonString( content ) == false ){
		console.log(PRE + "ERROR: JSON file not valid")
		return
	}
	var contentObj = JSON.parse(content)
	// create XML with content from JSON
	fs.readFile("./config/methode/" + instance + "/story.xml", 'utf8', function (err,data) {
		if (err) { return console.log(PRE + err) } 
		
			var result = data.replace(/\[\[subject\]\]/g, contentObj.subject);
			result = result.replace(/\[\[caption\]\]/g, contentObj.caption );
			result = result.replace(/\[\[body\]\]/g, contentObj.body);
			
		var outputFile = "./tmp/" + channel + "/xml/" + filename + ".xml"
		fs.writeFile(outputFile, result, 'utf8', function (err) {
			if (err) { return console.log(PRE + err) } 
		});
	})
	createTopicSet(contentObj);
}

const EDAPI = require("./edapi.js")
var edapi = new EDAPI("demode")
//console.log(edapi.INSTANCE)

async function createTopicSet( item ){

	var topicID, topicitemID, imageID, storyID;

	// Section used from RSS-feed, could here be fixed or mapped
	// Typically in express setup: Business, World, Sport, National
	// Case Sensitive !!!
	var SECTION = item.category

	console.log( "         # " + "RSS item start " + item.id, item.subject )

	var FILENAME = item.subject.match(/[A-ZÄÖÜ]\w+/g).slice(0,3).join('-') + "-" + Math.floor(Date.now() / 1000) 
	//console.log( PRE + "Filename: " + FILENAME )

			// Date representation form calculations
			let PUBDATE_RAW = new Date( Date.parse(item.pubdate))
			let PUBDATE_UNIX = Math.floor( new Date( Date.parse(item.pubdate)) / 1000 );
			//console.log(PUBDATE_UNIX); //1668187698

			let DUEDATE_UNIX = Math.floor( new Date( Date.parse(item.pubdate) + 2 * 60 * 60 * 1000) / 1000 ) ;
			//console.log(DUEDATE_UNIX); //1668194898

			let PUBDATE_ISSUEDATE6 = PUBDATE_RAW.getFullYear().toString().substr(-2) + (PUBDATE_RAW.getMonth()+1).toString().padStart(2, "0") + PUBDATE_RAW.getDate().toString().padStart(2, "0");
			//console.log(PRE +"PUBDATE_ISSUEDATE6: "+PUBDATE_ISSUEDATE6); //221111

			let PUBDATE_ISSUEDATE8 = PUBDATE_RAW.getFullYear().toString() + (PUBDATE_RAW.getMonth()+1).toString().padStart(2, "0") + PUBDATE_RAW.getDate().toString().padStart(2, "0");
			//console.log(PRE +"PUBDATE_ISSUEDATE8:" + PUBDATE_ISSUEDATE8); //20221111

			let PUBDATE_FOLDERDATE = PUBDATE_RAW.getFullYear().toString() + "-" + (PUBDATE_RAW.getMonth()+1).toString().padStart(2, "0") + "-" +  PUBDATE_RAW.getDate().toString().padStart(2, "0");
			//console.log(PRE +"PUBDATE_FOLDERDATE: " + PUBDATE_FOLDERDATE); //22-11-11

			let PUBDATE_FOLDERSLASHDATE = PUBDATE_RAW.getFullYear().toString() + "-" + (PUBDATE_RAW.getMonth()+1).toString().padStart(2, "0") + "/" +  PUBDATE_RAW.getDate().toString().padStart(2, "0");
			//console.log(PUBDATE_FOLDERSLASHDATE); //22-11/11
	
	////////
	// create topic
	let topic = await edapi.postContainerTopic({
		application:'Swing', 
		name: item.subject,
		description: item.subject + ' - Topic',
		folder:'/Production/Product/Content/'+SECTION+'/Topics/'+PUBDATE_FOLDERDATE,
		status:'Topic/Accepted',
		workFolder:'/Product/'+SECTION,
		issueDate:PUBDATE_ISSUEDATE8
	})
	if( topic.status == "success" ){
		console.log( PRE + "Topic: " + topic.result.info.id, topic.result.info.issueDate, topic.result.info.workFolder, topic.result.info.name )
		topicID = topic.result.info.id
		//console.log(JSON.stringify(topic)) // ,null, 2
	} else {
		console.log( PRE + "Topic: ERROR " + topic.result.message )
		//console.log(JSON.stringify(topic)) // ,null, 2
	}
	
	////////
	// create topicitem
	let topicitem = await edapi.postContainerTopicTopicitem( 
		topicID, {
			name: item.subject,
				contentType: "story",
				comment: item.subject + " - Story",
				occupation: "Size L",
				priority: "TASK_PRIORITY_HIGH",
				customPriority: "High",
				product: "Web",
				edition: null,
				assignees: ["productionmanager"],
				dueDate: DUEDATE_UNIX,
				attributes: "<?xml version=\"1.0\" encoding=\"UTF-8\"?><!DOCTYPE metadata SYSTEM \"/SysConfig/Shared/Classify/classify.dtd\"><metadata>\t<general>\t\t<type/>\t\t<title/>\t\t<authors>\t\t\t<author/>\t\t</authors>\t\t<priority/>\t\t<notes/>\t</general>\t\t<location>\t\t<address/>\t\t<city/>\t\t<state/>\t\t<zip/>\t\t<country/>\t\t<latitude/>\t\t<longitude/>\t</location>\t\t</metadata>",
				position: 0,
				options: {
					showCorrelates: true,
					limitToChildren: false,
					showPath: true,
					showSystemAttributes: true,
					showAttributes: true,
					showUsageTickets: true,
					showAttachment: true,
					showVirtualAttributes: true,
					showAdditionalInfo: true
				}
		}
	)
	if( topicitem.status == "success" ){
		console.log( PRE + "TopicItem: " + topicitem.result.info.id, topicitem.result.info.issueDate, topicitem.result.info.workFolder, topicitem.result.info.name )
		topicitemID = topicitem.result.info.id
		//console.log(JSON.stringify(topicitem)) // ,null, 2
	} else {
		console.log( PRE + "TopicItem: ERROR " + topicitem.result.message )
		//console.log(JSON.stringify(topicitem)) // ,null, 2
	}
	
	
	////////
	// create image
	let image = await edapi.postObjectCreate( 
		// tmp\tonline\img\100112534-image.jpg
		"./tmp/"+channel+"/img/" + item.image, 
		{
		    application: "Swing",
		    name: item.image,
		    workFolder: "/Product/"+SECTION,
		    folder: "/Production/Product/Pictures/"+PUBDATE_FOLDERSLASHDATE,
		    status: "Image/Release",
		    options: {
		        checkIn: true
		    },
		    systemAttributes: {},
		    attributes: {
		        metadata: {
		            general: {
		                type: "image",
		                title: FILENAME,
		                description: item.caption,
		                slugline: null,
		                authors: {
		                    author: "Agentur"
		                },
		                language: null,
		                priority: null,
		                notes: null,
		                fileName: FILENAME
		            },
		            mediaInfo: {
		                caption: item.caption,
		                credit: "Agentur",
		                duration: null,
		                width: "600",
		                height: "337",
		                mediaUrl: null,
		                mediaSource: null
		            }
		        }
		    }
		}
	)
	if( image.status == "success" ){
		console.log( PRE + "Image: " + image.result.id, image.result.workFolder, image.result.name )
		imageID = image.result.id
		//console.log(JSON.stringify(image)) // ,null, 2
	} else {
		console.log( PRE + "Image: ERROR " + image.result.message )
		//console.log(JSON.stringify(image)) // ,null, 2
	}
	

	
	////////
	//create story
	let story = await edapi.postObjectCreate( 
		//tmp\tonline\xml\100112432.json.xml
		'./tmp/' + channel + '/xml/' + item.id + '.json.xml', 
		{
			name: FILENAME + ".xml",
			folder: "/Production/Product/Content/"+SECTION+"/Stories/Live",
			workFolder: "/Product/"+SECTION,
			product: "Web",
			edition: "Web",
			issueDate: PUBDATE_ISSUEDATE6, 
			team: "WEB_Team",
			type: "EOM::CompoundStory",
			application: "Swing",
			attributes: "<!DOCTYPE metadata SYSTEM \"/SysConfig/Shared/Classify/classify.dtd\"><metadata><general><type>story</type><title></title><description></description><slugline/><authors><author></author></authors><language/><priority>Low</priority><notes/><fileName></fileName></general><contentInfo><wordCount></wordCount><charCount></charCount><lineCount></lineCount><imageCount></imageCount></contentInfo><location><address/><city/><state/><zip/><country/><latitude/><longitude/></location><digital><webType>story</webType><webStyle>Default</webStyle><firstPublicationDate/><lastPublicationDate/><forcePublicationDate>n</forcePublicationDate><publicationStartDate/><publicationEndDate/><urls><url/></urls><sites><site><siteName>express-website</siteName><mainSection>/" + SECTION.toLowerCase() + "</mainSection><sections><section/></sections></site></sites></digital><classification><subjects><subject/></subjects><genres><genre/></genres><events><event/></events><objects><object/></objects><organisations><organisation/></organisations><persons><person/></persons><pointsOfInterest><pointOfInterest/></pointsOfInterest><geoPlaces><geoPlace/></geoPlaces><keywords><keyword/></keywords></classification><source><sourceType/><sourceProvider/><sourceId/><sourceVersion/><sourceTransmissionDateTime/><sourceCreationDateTime/><sourceModificationDateTime/><sourcePriority/><sourceUrgency/><sourceCreators><sourceCreator/></sourceCreators><sourceCategories><sourceCategory/></sourceCategories><sourceLinks><sourceLink/></sourceLinks><sourceDescription/></source><syndication><syndicationTarget/></syndication><purging><purged/><purgedDate/><purgedProduct/></purging><legal><copyrightHolder/><copyrightNotice/><usageTerms/></legal></metadata>"			
		}
	)
	if( story.status == "success" ){
		console.log( PRE + "Story: " + story.result.id, story.result.workFolder, story.result.name )
		storyID = story.result.id
		//console.log(JSON.stringify(story)) // ,null, 2
	} else {
		console.log( PRE + "Story: ERROR " + story.result.message )
		//console.log(JSON.stringify(story)) // ,null, 2
	}
	
	
	////////
	// correlate image with topic
	let correlation = await edapi.postObjectCorrelate(
	topicID,
		{
			sourceLinkName:"see_also",
			targetLinkName:"see_also",
			targetSource: imageID
		}
	)
	//console.log(JSON.stringify(correlation, null, 2)) 
	
	
	////////
	// attach story to topicitem
	let attachment = await edapi.putContainerTopicTopicitemAttach(
		topicID,
		topicitemID,
		storyID,
		{
			showCorrelates: true,
			limitToChildren: false,
			showPath: true,
			showSystemAttributes: true,
			showAttributes: true,
			showUsageTickets: true,
			showAttachment: true,
			showVirtualAttributes: true,
			showAdditionalInfo: true
		}

	)
	//console.log(JSON.stringify(attachment, null, 2)) 
	
	console.log( PRE +"RSS item ready " + item.id )

}

// quick JSON validity check
function isJsonString(str) {
    try {JSON.parse(str)} catch (e) {return false}
    return true;
}