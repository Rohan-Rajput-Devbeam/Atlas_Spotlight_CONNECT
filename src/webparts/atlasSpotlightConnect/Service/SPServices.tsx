import { WebPartContext } from "@microsoft/sp-webpart-base";
import { sp } from '@pnp/sp/presets/all';



import {
    SPHttpClient, SPHttpClientResponse, ISPHttpClientOptions
} from '@microsoft/sp-http';
import "@pnp/sp/webs";
import "@pnp/sp/folders";
import { IPickerTerms } from "@pnp/spfx-property-controls";
import autobind from "autobind-decorator";
import pnp from "sp-pnp-js";


import { escape } from '@microsoft/sp-lodash-subset';
// other import statements
const $: any = require("jquery");
require('SPServices');


const progList = sp.web.lists.getByTitle('Programs');
const termsFilter = "Bowmore"



export class SPService {
    state = {

        allItems: [],
        currPageUrl: window.location.href,
        currUserGroups: []

    };

    public abc = [];
    rackName: string;
    people: [];
    authuser: boolean;

    public callSomething(items: any[]) {
        console.log(items);
        this.abc = items;
        console.log(this.abc);
        this.state = {
            allItems: items,
            currPageUrl: window.location.href,
            currUserGroups: []

        }

        console.log(this.state.allItems);
        return this.state.allItems
    }

    constructor(private context: WebPartContext) {
        sp.setup({
            spfxContext: this.context
        });
        this.state = {
            allItems: [],
            currPageUrl: window.location.href,
            currUserGroups: []

        }
    }

    public async getUserGroups() {
        var finalArray: any[];
        let myGroups = await (await this.context.spHttpClient.get(`${this.context.pageContext.web.absoluteUrl}/_api/Web/CurrentUser/Groups`,
            SPHttpClient.configurations.v1)).json();
        console.log(myGroups);

        return myGroups




    }

    public async getAllDocs(selectedBrand) {
        var items: any[];
        const myArray = this.state.currPageUrl.split("/");
        let rackName = myArray[myArray.length - 1].split(".")[0];
        this.rackName = myArray[myArray.length - 1].split(".")[0];
        console.log(rackName)
        var brand = "";

        try {


            //     $(document).ready(function() {
            //         $().SPServices({
            //           operation: "GetListItems",
            //           async: false,
            //           listName: "Programs",
            //           CAMLViewFields: "<ViewFields><FieldRef Name='Title' /></ViewFields>",
            //           completefunc: function (xData, Status) {
            //             console.log(xData);
            //             $(xData.responseXML).SPFilterNode("z:row").each(function() {
            //               console.log($(this).attr("ows_Title"))            
            //             });
            //           }
            //         });
            //       });



            //             var g;  
            // $.ajax({  
            //     // url:this.context.pageContext.web.absoluteUrl + "/_api/web/Lists/GetByTitle('Programs')/Items",  
            //     url:this.context.pageContext.web.absoluteUrl + "/_api/web/getfolderbyserverrelativeurl('Brand%20Documents/Subbrand1647119834538')/files?",
            //     type: 'GET',  
            //     dataType: "json",  
            //     headers: {  
            //         "Accept": "application/json;odata=verbose",  
            //         "content-type": "application/json; odata=verbose",  
            //         "X-RequestDigest": $("#__REQUESTDIGEST").val()  
            //     },  
            //     success: function (data) {  
            //         console.log(data)
            //         for (var i = 0; i < data.d.results.length; i++) {  
            //             console.log(data.d.results[i])

            //             if (data.d.results[i].FileSystemObjectType != 1) {     
            //                        console.log(data.d.results[i])
            //             }  
            //         }  
            //     },  
            //     error: function (request, error) {  
            //         console.log(JSON.stringify(request));  
            //     }  
            // });




            // let docDetails: any[] = await sp.web.lists.getByTitle('Brand Documents').items.filter("Brand eq '" + brand + "'").select('Id,FileRef,ServerRedirectedEmbedUri,ServerRedirectedEmbedUrl,Featured,Brand').get();

            // let docDetails = await pnp.sp.web.getFileByServerRelativeUrl("/sites/ModernConnect/Brand%20Documents/OurBrands1646909202679").getJSON().then((json: any) => {});
            // pnp.sp.web.getFolderByServerRelativeUrl("/sites/ModernConnect/Brand Documents/OurBrands1646909202679/files").get().then(item => {

            //     console.log(item);
            // });

            // let requestUrl = `https://devbeam.sharepoint.com/sites/ModernConnect/_api/web/getfolderbyserverrelativeurl('Rackhouse%20Documents/Rack1646754094655')/files?$expand=ListItemAllFields`
            // let requestUrl = `https://devbeam.sharepoint.com/sites/ModernConnect/_api/web/getfolderbyserverrelativeurl('Brand%20Documents/Subbrand1647119834538')/files?$expand=ListItemAllFields`

            let requestUrl = `https://devbeam.sharepoint.com/sites/ModernConnect/_api/web/getfolderbyserverrelativeurl('Brand%20Documents/${selectedBrand}')/files?$expand=ListItemAllFields`

            let requestUrlforFolders = `https://devbeam.sharepoint.com/sites/ModernConnect/_api/web/getfolderbyserverrelativeurl('Brand%20Documents/${selectedBrand}')/folders?$expand=ListItemAllFields`
            // let requestUrl = `https://devbeam.sharepoint.com/sites/ModernConnect/_api/web/getfolderbyserverrelativeurl('Brand%20Documents/${rackName}')/files?$expand=ListItemAllFields`

            // let requestUrl = `https://devbeam.sharepoint.com/sites/ModernConnect/_api/web/getfolderbyserverrelativeurl('Brand%20Documents/Subbrand1647119834538')/files?$expand=ListItemAllFields&expand=Brand&filter=%20Label%20eq%20%27Bowmore%27`



            // const json: any = await sp.web.getFileByServerRelativePath(requestUrl).getJSON();
            // console.log(json)
            // let myFiles = [];


            // let response = await sp.web.getFolderByServerRelativeUrl('Brand%20Documents/Subbrand1647119834538').files.get()

            // for (var i = 0; i < requestUrl.length; i++) {
            //     var _ServerRelativeUrl = response[i].ServerRelativeUrl;
            //     var file = await (await pnp.sp.web.getFileByServerRelativeUrl(_ServerRelativeUrl).getItem()).get();
            //     console.log(file);
            //     myFiles.push(file);
            // }


            // console.log(myFiles)

            // console.log(response)

            let myItems = await (await this.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1)).json();
            let myFolders = await (await this.context.spHttpClient.get(requestUrlforFolders, SPHttpClient.configurations.v1)).json();

            console.log(myItems.value);
            console.log(myItems);

            console.log(myFolders.value);
            console.log(myFolders);

            console.log(requestUrl);
            console.log(requestUrlforFolders)
            // console.log(docDetails);
            // for (var i = 0; i < myItems.value.length; i++) {
            var MYITEM = myItems.value

            //to check if it's a file, otherwise folder
            // if (MYITEM[i].ListItemAllFields.FileSystemObjectType != 1) {
            console.log("I am a file");
            var abcd = "abcd"
            var filteredItem = MYITEM.filter(function (item) {
                return item.ListItemAllFields.Brand.Label == termsFilter;

            });
            // console.log(myFiles)

            // myFiles.push(filteredItem);
            // console.log(abcd)
            // console.log(myFiles)
            console.log(filteredItem)

            // }
            // else{
            // }
            // }

            for (var j = 0; j < myFolders.value.length; j++) {
                console.log(myFolders.value[j].ServerRelativeUrl.substring(37))
                let innerFiles = await this.getAllDocs(myFolders.value[j].ServerRelativeUrl.substring(37))
                let ac = [...filteredItem, ...innerFiles]
                console.log(ac)

                console.log(filteredItem)
                filteredItem = ac;
                console.log(innerFiles)
            }
            // var filtered = MYITEM.filter(a => a.ListItemAllFields.Brand.Label == "Bowmore");
            // console.log(filtered)
            // console.log(abcd)
            // console.log(myFiles)
            console.log(filteredItem)

            return filteredItem;
            // return myItems.value;
        }
        catch (err) {
            Promise.reject(err);
        }
    }
}

