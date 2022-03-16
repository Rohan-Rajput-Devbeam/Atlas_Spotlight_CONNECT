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

    public async getAllDocs(selectedBrand, selectedTerm) {


        try {
            let requestUrl = `https://devbeam.sharepoint.com/sites/ModernConnect/_api/web/getfolderbyserverrelativeurl('Brand%20Documents/${selectedBrand}')/files?$expand=ListItemAllFields`

            let requestUrlforFolders = `https://devbeam.sharepoint.com/sites/ModernConnect/_api/web/getfolderbyserverrelativeurl('Brand%20Documents/${selectedBrand}')/folders?$expand=ListItemAllFields`

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
            var filteredItem = MYITEM.filter(function (item) {
                return item.ListItemAllFields.Brand_x0020_Location &&
                    item.ListItemAllFields.Brand_x0020_Location.Label == selectedTerm
            });

            console.log(filteredItem)

            for (var j = 0; j < myFolders.value.length; j++) {
                console.log(myFolders.value[j].ServerRelativeUrl.substring(37))
                let innerFiles = await this.getAllDocs(myFolders.value[j].ServerRelativeUrl.substring(37), selectedTerm)
                let ac = [...filteredItem, ...innerFiles]
                console.log(ac)

                console.log(filteredItem)
                filteredItem = ac;
                console.log(innerFiles)
            }

            console.log(filteredItem)

            return filteredItem;
        }
        catch (err) {
            Promise.reject(err);
        }
    }
}

