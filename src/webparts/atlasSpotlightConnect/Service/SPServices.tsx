import { WebPartContext } from "@microsoft/sp-webpart-base";
import { sp } from '@pnp/sp/presets/all';
import { ICamlQuery } from "@pnp/sp/lists";




import {
    SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions
} from '@microsoft/sp-http';

import "isomorphic-fetch"; // or import the fetch polyfill you installed
import { Client } from "@microsoft/microsoft-graph-client";
import { MSGraphClient } from '@microsoft/sp-http';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
import { groupBy } from "@microsoft/sp-lodash-subset";


// import { escape } from '@microsoft/sp-lodash-subset';
// other import statements
// const $: any = require("jquery");
// require('SPServices');


const progList = sp.web.lists.getByTitle('Programs');
const termsFilter = "Bowmore"



export class SPService {
    state = {

        allItems: [],
        currPageUrl: window.location.href,
        currUserGroups: [],
        checkPermission: false

    };

    public abc = [];
    rackName: string;
    people: [];
    authuser: boolean;
    checkPermission: boolean;


    public callSomething(items: any[]) {
        console.log(items);
        this.abc = items;
        console.log(this.abc);
        this.state = {
            allItems: items,
            currPageUrl: window.location.href,
            currUserGroups: [],
            checkPermission: false


        }

        // console.log(this.state.allItems);
        return this.state.allItems
    }

    constructor(private context: WebPartContext) {
        sp.setup({
            spfxContext: this.context
        });
        this.state = {
            allItems: [],
            currPageUrl: window.location.href,
            currUserGroups: [],
            checkPermission: false


        }
    }

    public getTermStore() {

    }
    public async getUserGroups() {
        // var finalArray: any[];
        // let myGroups = await (await this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/Web/CurrentUser/Groups`,
        //     SPHttpClient.configurations.v1)).json();
        // // console.log(myGroups);

        let Mygroups = await this.context.msGraphClientFactory.getClient().then(async (client: MSGraphClient): Promise<void> => {
            let group = await client.api('/me/memberOf/$/microsoft.graph.group')
                .filter('groupTypes/any(a:a eq \'unified\')')
                .get();
            // console.log(group)
            return group

        });

        // console.log(Mygroups)
        return Mygroups




    }
    public checkUseFullname(userArray) {
        var usrFullname = this.context.pageContext.user.displayName;
        var GroupArray
        if (userArray && userArray.length > 0) {
            ///console.log(JSON.stringify(this.properties.people));

            GroupArray = userArray.map((obj: { fullName: any; }) => {
                return obj.fullName;
            });
            // console.log(GroupArray);//Array Of Group in property pane   

            if (GroupArray.includes(usrFullname)) {
                return true
            }
            else {
                return false
            }
        }
    }

    // public checkUserPermission(peopleArray) {

    //     var usrFullname = this.context.pageContext.user.displayName;
    //     console.log(usrFullname)
    //     this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/Web/CurrentUser/Groups`,
    //         SPHttpClient.configurations.v1)
    //         .then((response: SPHttpClientResponse) => {
    //             response.json().then((responseJSON: any) => {
    //                 console.log(responseJSON.value);
    //                 var finalArray = responseJSON.value.map(function (obj: { Title: any; }) {
    //                     return obj.Title;
    //                 });
    //                 console.log(finalArray);//Array Retrieved from Current users Groups.....

    //                 if (peopleArray && peopleArray.length > 0) {
    //                     ///console.log(JSON.stringify(this.properties.people));

    //                     const GroupArray = peopleArray.map((obj: { fullName: any; }) => {
    //                         return obj.fullName;
    //                     });
    //                     console.log(GroupArray);//Array Of Group in property pane

    //                     var Groupintersections = finalArray.filter(e => GroupArray.indexOf(e) !== -1);
    //                     console.log(Groupintersections)

    //                     if (Groupintersections.length > 0 || GroupArray.includes(usrFullname)) {
    //                         console.log("Current User Present In The Group");
    //                         this.checkPermission=true;
    //                         return true;

    //                     }
    //                     else {
    //                         console.log("No Permission");
    //                       this.checkPermission = false
    //                         return false;

    //                     }
    //                 }


    //             })
    //         })

    //         return this.checkPermission
    // }

    /* public async getAllDocs(selectedBrand, selectedTerm) {
         console.log(selectedBrand, selectedTerm)
 
         try {
             let requestUrl = `https://bgsw1.sharepoint.com/sites/CONNECTII/_api/web/getfolderbyserverrelativeurl('Brand%20Documents/${selectedBrand}')/files?$expand=ListItemAllFields`
 
             let requestUrlforFolders = `https://bgsw1.sharepoint.com/sites/CONNECTII/_api/web/getfolderbyserverrelativeurl('Brand%20Documents/${selectedBrand}')/folders?$expand=ListItemAllFields`
 
             let myItems = await (await this.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1)).json();
             let myFolders = await (await this.context.spHttpClient.get(requestUrlforFolders, SPHttpClient.configurations.v1)).json();
 
             console.log(myItems.value);
             // console.log(myItems);
 
             console.log(myFolders.value);
             // console.log(myFolders);
 
             // console.log(requestUrl);
             // console.log(requestUrlforFolders)
             // console.log(docDetails);
             // for (var i = 0; i < myItems.value.length; i++) {
             var MYITEM = myItems.value
             // console.log(MYITEM)
 
 
             //to check if it's a file, otherwise folder
             // if (MYITEM[i].ListItemAllFields.FileSystemObjectType != 1) {
             var filteredItem = MYITEM.filter(function (item) {
                 console.log(item)
                 return item.ListItemAllFields.BeamConnect_x0020_Brand_x0020_Location &&
                     item.ListItemAllFields.BeamConnect_x0020_Brand_x0020_Location[0].Label == selectedTerm
             });
 
             console.log(filteredItem)
 
             for (var j = 0; j < myFolders.value.length; j++) {
                 console.log(myFolders.value[j].ServerRelativeUrl.substring(33))
                 let innerFiles = await this.getAllDocs(myFolders.value[j].ServerRelativeUrl.substring(33), selectedTerm)
                 let ac = [...filteredItem, ...innerFiles]
                 console.log(ac)
 
                 console.log(filteredItem)
                 filteredItem = ac;
                 console.log(innerFiles)
             }
 
 
             // console.log(filteredItem)
 
             return filteredItem;
         }
         catch (err) {
             Promise.reject(err);
         }
     }
     */

    public async getAllDocsCAML(selectedBrand, selectedTerm, lowerRange, upperRange) {
        try {
            
            const caml: ICamlQuery = {
                ViewXml: "<View Scope='RecursiveAll'><Query><Where><And><Includes><FieldRef Name='BeamConnect_x0020_Brand_x0020_Location'/><Value Type='TaxonomyFieldType'>" + selectedTerm + "</Value></Includes><And><Geq><FieldRef Name='ID' /><Value Type='Number'>" + lowerRange + "</Value></Geq><Leq><FieldRef Name='ID' /><Value Type='Number'>" + upperRange + "</Value></Leq></And></And></Where></Query></View>",
                FolderServerRelativeUrl: `Brand%20Documents/${selectedBrand}`
            }

            /*  const caml: ICamlQuery = {
                  // ViewXml: "<View Scope='RecursiveAll'><ViewFields><FieldRef Name='Title' /><FieldRef Name='FileLeafRef' /></ViewFields></View>",
                  ViewXml: "<View Scope='RecursiveAll'><Query><Where><And><Includes><FieldRef Name='BeamConnect_x0020_Brand_x0020_Location'/><Value Type='TaxonomyFieldType'>" + selectedTerm + "</Value></Includes><Leq><FieldRef Name='ID' /><Value Type='Number'>4500</Value></Leq></And></Where></Query></View>",
                  // ViewXml: "<View Scope='RecursiveAll'><Query><Where><And><Includes><FieldRef Name='BeamConnect_x0020_Brand_x0020_Location'/><Value Type='TaxonomyFieldType'>Sampling Guides</Value></Includes><Leq><FieldRef Name='ID' /><Value Type='Number'>4000</Value></Leq></And></Where></Query></View>",
  
                  // ViewXml: "<View Scope='RecursiveAll'><Query><Where><And><Geq><FieldRef Name='ID' /><Value Type='Number'>0</Value></Geq><And><Leq><FieldRef Name='ID' /><Value Type='Number'>4000</Value></Leq><Includes><FieldRef Name='BeamConnect_x0020_Brand_x0020_Location' /><Value Type='text'>Playbooks</Value></Includes></And></And></Where></Query></View>",
                  // ViewXml :"<Query><View Scope='RecursiveAll'> <Query><Where><Geq><FieldRef Name='ID' /><Value Type='Counter'>22</Value></Geq></Where></Query></View></Query>",
                  FolderServerRelativeUrl: `Brand%20Documents/${selectedBrand}`,
              }; */

            let listItems = await sp.web.lists.getByTitle("Brand Documents").getItemsByCAMLQuery(caml, "FileRef", "FileLeafRef");
            // let listItems2 = await sp.web.lists.getByTitle("Brand Documents").getItemsByCAMLQuery(caml2, "FileRef");

            // console.log(listItems)

            return listItems;
        }

        catch (err) {
            console.error(err)
            Promise.reject(err);
            // return "I am error"
        }
    }


    
    // public async toggleFavorites(item,isFavorite, listID){
	// 	console.log(item)
	// 	console.log(isFavorite)
    //     if(isFavorite == true){
    //         //remove
    //         await sp.web.lists.getByTitle('Favorites').items.getById(listID).delete();
    //     }
    //     else{
    //         //add
    //         await sp.web.lists.getByTitle('Favorites').items.add({
    //             Title: item.Name,
    //             URL: {
    //                 "Description": item.Name,
    //                 "Url": "https://bgsw1.sharepoint.com"+item.ServerRelativeUrl
    //             }
    //             // Description: "Description"
    //           });

    //     }
	// }

    public async getFavoriteListItems(curentUserID){
        let abc;
        try{
            abc = await sp.web.lists.getByTitle('Favorites').items.getAll()
            console.log(abc)
            // abc = await sp.web.lists.get("https://bgsw1.sharepoint.com/sites/CONNECTII/_api/web/lists/getByTitle('Favorites')/items")
            // let myGroups = await (await this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/Web/CurrentUser/Groups`,
            // SPHttpClient.configurations.v1)).json();

            // console.log(abc)
            return abc
        }
        catch(err){
            console.error(err)
        }
    }
    public async getFavoriteListItems2(curentUserID){
        let abc;
        try{
            abc = await sp.web.lists.getByTitle('Favorites').items.getAll()
            console.log(abc)
            return abc
        }
        catch(err){
            console.error(err)
        }
    }
    public async getCurrentUser() {
        return await sp.web.currentUser.get();
    }

    public async addFeatured(docId) {
        console.log(docId)
        let abc
        try{
            abc = await sp.web.lists.getByTitle('Rackhouse Documents').items.getById(docId).update({
                Featured: true
            });
            console.log(abc)
        }
        catch(err){
            console.error(err)
        }
        
    }

    public async removedFeatured(docId) {
        console.log(docId)
        await sp.web.lists.getByTitle('Rackhouse Documents').items.getById(docId).update({
            Featured: false
        });
    }

s
    ///////

    public async getFavoriteListItems_1(curentUserID){
        let abc;
        try{
            abc = await sp.web.lists.getByTitle('Favorites').items.getAll()
            console.log(abc)
            // abc = await sp.web.lists.get("https://bgsw1.sharepoint.com/sites/CONNECTII/_api/web/lists/getByTitle('Favorites')/items")
            // let myGroups = await (await this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/Web/CurrentUser/Groups`,
            // SPHttpClient.configurations.v1)).json();

            // console.log(abc)
            return abc
        }
        catch(err){
            console.error(err)
        }
    }
    public async getFavoriteListItems2_1(curentUserID){
        let abc;
        try{
            abc = await sp.web.lists.getByTitle('Favorites').items.getAll()
            console.log(abc)
            return abc
        }
        catch(err){
            console.error(err)
        }
    }
    public async toggleFavorites_1(item,isFavorite, listID){
		console.log(item)
		console.log(isFavorite)
        if(isFavorite == true){
            //remove
            await sp.web.lists.getByTitle('Favorites').items.getById(listID).delete();
        }
        else{
            //add
            await sp.web.lists.getByTitle('Favorites').items.add({
                Title: item.Name,
                URL: {
                    "Description": item.Name,
                    "Url": "https://bgsw1.sharepoint.com"+item.FileLeafRef
                }
                // Description: "Description"
              });

        }
	}
    public async getCurrentUser_1() {
        return await sp.web.currentUser.get();
    }

    public async addFeatured_1(docId) {
        console.log(docId)
        let abc
        try{
            abc = await sp.web.lists.getByTitle('Brand Documents').items.getById(docId).update({
                Featured: true
            });
            console.log(abc)
        }
        catch(err){
            console.error(err)
        }
        
    }

    public async removedFeatured_1(docId) {
        console.log(docId)
        await sp.web.lists.getByTitle('Brand Documents').items.getById(docId).update({
            Featured: false
        });
    }
    
}

