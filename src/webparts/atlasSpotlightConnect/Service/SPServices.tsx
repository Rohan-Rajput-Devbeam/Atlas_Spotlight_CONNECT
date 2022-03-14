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

    public async getAllDocs() {
        var items: any[];
        const myArray = this.state.currPageUrl.split("/");
        let rackName = myArray[myArray.length - 1].split(".")[0];
        this.rackName = myArray[myArray.length - 1].split(".")[0];
        console.log(rackName)
        var brand = "Bowmore";







        try {

            // let docDetails: any[] = await sp.web.lists.getByTitle('Brand Documents').items.filter("Brand eq '" + brand + "'").select('Id,FileRef,ServerRedirectedEmbedUri,ServerRedirectedEmbedUrl,Featured,Brand').get();

            // let docDetails = await pnp.sp.web.getFileByServerRelativeUrl("/sites/ModernConnect/Brand%20Documents/OurBrands1646909202679").getJSON().then((json: any) => {});
            // pnp.sp.web.getFolderByServerRelativeUrl("/sites/ModernConnect/Brand Documents/OurBrands1646909202679/files").get().then(item => {

            //     console.log(item);
            // });

            // let requestUrl = `https://devbeam.sharepoint.com/sites/ModernConnect/_api/web/getfolderbyserverrelativeurl('Rackhouse%20Documents/Rack1646754094655')/files?$expand=ListItemAllFields`
            // let requestUrl = `https://devbeam.sharepoint.com/sites/ModernConnect/_api/web/getfolderbyserverrelativeurl('Brand%20Documents/OurBrands1646909202679')/files?$expand=ListItemAllFields`

            // let requestUrl = `https://devbeam.sharepoint.com/sites/ModernConnect/_api/web/getfolderbyserverrelativeurl('Brand%20Documents/${rackName}')/files?$expand=ListItemAllFields`

            let requestUrl = `https://devbeam.sharepoint.com/sites/ModernConnect/_api/web/getfolderbyserverrelativeurl('Brand%20Documents/Subbrand1647119834538')/files?$expand=ListItemAllFields&expand=Brand&filter=%20Label%20eq%20%27Bowmore%27`

            // $filter=Status eq 'not started'&$select=Title&$top=5).

            // const json: any = await sp.web.getFileByServerRelativePath(requestUrl).getJSON();
            // console.log(json)
            let myFiles = [];


            let response = await sp.web.getFolderByServerRelativeUrl('Brand%20Documents/Subbrand1647119834538').files.get()

            for (var i = 0; i < response.length; i++) {
                var _ServerRelativeUrl = response[i].ServerRelativeUrl;
                var file = await (await pnp.sp.web.getFileByServerRelativeUrl(_ServerRelativeUrl).getItem()).get();
                console.log(file);
                myFiles.push(file);
            }

            console.log(myFiles)

            console.log(response)

            let myItems = await (await this.context.spHttpClient.get(requestUrl, SPHttpClient.configurations.v1)).json();
            console.log(myItems.value);
            console.log(requestUrl);
            // console.log(docDetails);



            return myItems.value;
        }
        catch (err) {
            Promise.reject(err);
        }
    }
}

