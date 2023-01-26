const fs = require("fs")
const fetch = require('node-fetch') // use only Version 2.x!! here
const FormData = require('form-data')

class EDAPI {

    /*  
        my first little library of EDAPI functions
        2021-01-18 joerg.drees@eidosmedia.com
        Usage: 
            EDAPI = require("./edapi.js")
            var edapi = new EDAPI("demode")
            console.log(edapi.getToken())
    */

    constructor(instance) {

        // instance e.g. demode
        this.INSTANCE = instance

        // set token file path
        this.TOKENFILE = "./config/methode/" + instance + "/.token.txt"

        // get config file
        this.CONFIG = require("../config/methode/" + instance + "/instance.json")

        // extend config for now
        this.CONFIG.TOKEN = this.getToken()
        this.CONFIG.URL = "http://" + this.CONFIG.hostname + ":" + this.CONFIG.port + this.CONFIG.path

    }

    // token handling
    getToken() {
        var token = fs.readFileSync( this.TOKENFILE )
        //console.log( "         - Token: " + token + " on " + this.INSTANCE )
        return token
    }

    //// EDAPI functions

    // get auth.connection.check
    // e.g. authConnectionCheck()
    async authConnectionCheck() {
        const res = await fetch(
            this.CONFIG.URL + '/v3/auth/connection/check', 
            {
                method: 'GET',
                headers: {
                    "Cookie": "MRS_CONNECTION_TOKEN=" + this.CONFIG.TOKEN,
                    "Content-Type": "application/json"
                }
            })
        const data = await res.json()
        return await data
    }

    // get container.topic by id
    // e.g. getContainerTopic( '33$1.0.114316454' )
    async getContainerTopic(ID) {
        let res = await fetch(
            this.CONFIG.URL + '/v3/container/topic/' + ID, 
            {
                method: 'GET',
                headers: {
                    "Cookie": "MRS_CONNECTION_TOKEN=" + this.CONFIG.TOKEN,
                    "Content-Type": "application/json"
                }
            })
        return await res.json()
    }

    // get object by id
    // e.g. getObject( '33$1.0.111542913' )
    async getObject(ID) {
        let res = await fetch(
            this.CONFIG.URL + '/v3/object/' + ID, 
            {
                method: 'GET',
                headers: {
                    "Cookie": "MRS_CONNECTION_TOKEN=" + this.CONFIG.TOKEN,
                    "Content-Type": "application/json"
                }
            })
        return await res.json()
    }

    // get object.content by id
    // e.g. getObjectContent( '33$1.0.111542913' )
    async getObjectContent(ID) {
        let res = await fetch(
            this.CONFIG.URL + '/v3/object/' + ID + '/content', 
            {
                method: 'GET',
                headers: {
                    "Cookie": "MRS_CONNECTION_TOKEN=" + this.CONFIG.TOKEN,
                    "Content-Type": "application/json"
                }
            })
        return await res.text()
    }

    // get object.binary by id
    // e.g. getObjectContentBinary( '33$1.0.111542913' )
    async getObjectContentBinary(ID) {
        let res = await fetch(
            this.CONFIG.URL + '/v3/object/' + ID + '/content/binary', 
            {
                method: 'GET',
                headers: {
                    "Cookie": "MRS_CONNECTION_TOKEN=" + this.CONFIG.TOKEN,
                    "Content-Type": "application/json"
                }
            })
        return await res.buffer()
    }

    // post topic
    // e.g. postContainerTopic( {application:'Swing',name:'Demothema3',description:'Demothema3 Zusammenfassung',folder:'/Production/Product/Content/Business/Topics/2022-11-10',status:'Topic/Accepted',workFolder:'/Product/World',issueDate:'20221110'} )
    async postContainerTopic(PAYLOAD) {
        let res = await fetch(
            this.CONFIG.URL + '/v3/container/topic', 
            {
                method: 'POST',
                headers: {
                    "Cookie": "MRS_CONNECTION_TOKEN=" + this.CONFIG.TOKEN,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(PAYLOAD)
            })
        return await res.json()
    }

    // post container.topic.topicitem
    async postContainerTopicTopicitem(ID, PAYLOAD) {
        let res = await fetch(
            this.CONFIG.URL + '/v3/container/topic/' + ID + '/topicitem', 
            {
                method: 'POST',
                headers: {
                    "Cookie": "MRS_CONNECTION_TOKEN=" + this.CONFIG.TOKEN,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(PAYLOAD)
            })
        return await res.json()
    }

    // post object.create
    async postObjectCreate(FILE, PAYLOAD) {
        const formData = new FormData()
        formData.append('options', JSON.stringify(PAYLOAD), {contentType: 'application/json'})
        formData.append('content', fs.createReadStream(FILE), {contentType: 'application/octet-stream'})
        let res = await fetch(
            this.CONFIG.URL + '/v3/object/create', 
            {
                method: 'POST',
                headers: {
                    "Cookie": "MRS_CONNECTION_TOKEN=" + this.CONFIG.TOKEN,
                    "Content-Type": "multipart/form-data; boundary=" + formData.getBoundary()
                },
                body: formData
            })
        return await res.json()
    }

    // post object correlate
    async postObjectCorrelate(ID, PAYLOAD) {
        let res = await fetch(
            this.CONFIG.URL + '/v3/object/'+ ID +'/correlate', 
            {
                method: 'POST',
                headers: {
                    "Cookie": "MRS_CONNECTION_TOKEN=" + this.CONFIG.TOKEN,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(PAYLOAD)
            })
        return await res.json()
    }

    // put container.topic.topicitem.attach
    async putContainerTopicTopicitemAttach(IDT, IDI, IDA, PAYLOAD) {
        let res = await fetch(
            this.CONFIG.URL + '/v3/container/topic/'+ IDT +'/topicitem/'+ IDI +'/attach/'+ IDA , 
            {
                method: 'PUT',
                headers: {
                    "Cookie": "MRS_CONNECTION_TOKEN=" + this.CONFIG.TOKEN,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(PAYLOAD)
            })
        return await res.json()
    }
  
  }
  
  module.exports = EDAPI