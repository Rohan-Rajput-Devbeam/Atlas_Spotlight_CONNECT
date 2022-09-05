import * as React from 'react';
import styles from './AtlasSpotlightConnect.module.scss';
import { IAtlasSpotlightConnectProps } from './IAtlasSpotlightConnectProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IoIosArrowForward } from "react-icons/io";
import autobind from 'autobind-decorator';
import { DescriptionModal } from './DescriptionModal';
import { Container } from 'react-bootstrap';
import { SPService } from '../Service/SPServices';

import { taxonomy, ITermGroup, ITermSets, ITermStore, ILabelMatchInfo, ITerms, ITermData } from "@pnp/sp-taxonomy";
import { ITerm } from '@pnp/sp/taxonomy';
import { sp } from '@pnp/sp/presets/all';
import { WebPartContext } from '@microsoft/sp-webpart-base';

import "isomorphic-fetch"; // or import the fetch polyfill you installed
import { Client } from "@microsoft/microsoft-graph-client";
import { MSGraphClient } from '@microsoft/sp-http';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';


export interface IAtlasSpotlightConnectState {
	showDescriptionModal: boolean;
	currentDataset: any;
	brandID: any;
	currUserGroups: any;
	displayFlag: boolean;

	currentUserEmail: string;
	cuurentUserID: any;
	currentUserFavItems: any;
	favDocMapping: any;
	favListIDs: any;
	docItems: any;



}


export default class AtlasSpotlightConnect extends React.Component<IAtlasSpotlightConnectProps, IAtlasSpotlightConnectState> {
	public SPService: SPService = null;

	public constructor(props: IAtlasSpotlightConnectProps) {
		super(props);
		this.SPService = new SPService(this.props.context);


		this.state = ({
			showDescriptionModal: false,
			currentDataset: [],
			brandID: "",
			currUserGroups: [],
			displayFlag: false,

			currentUserEmail: "",
			cuurentUserID: "",
			currentUserFavItems: [],
			favDocMapping: [],
			favListIDs: [],
			docItems: []


		})

		// this.getFavoriteListItems = this.getFavoriteListItems.bind(this)
		// this.checkFavDocuments = this.checkFavDocuments.bind(this)
	}
	@autobind
	openModal(id: number) {
		// console.log(id)
		let dataset = [];
		dataset.push(this.props.terms)
		this.setState({
			showDescriptionModal: true,
		})
	}

	@autobind
	closeModal() { this.setState({ showDescriptionModal: false }); }

	componentDidUpdate() {
		// Typical usage (don't forget to compare props):
		if (this.props.people !== this.props.people) {
			this.getUserGroups2();
		}
	}

	public async getFavoriteListItems() {
		let fav = await this.SPService.getFavoriteListItems(this.state.cuurentUserID);
		console.log(fav)
		let currUserFav = fav.filter(item => item.AuthorId == this.state.cuurentUserID);
		console.log(currUserFav)
		this.setState({
			currentUserFavItems: currUserFav
		}, () => this.checkFavDocuments())

		// let bab = await this.SPService._pnpPagedSearchSegmentClick(this.state.cuurentUserID)
		// console.log(bab)
	}

	public async checkFavDocuments() {
		let favDocMapping = []
		let favListIDs = []
		for (let i = 0; i < this.state.currentDataset[0].length; i++) {
			let flag = false;
			let listID = -1;
			// let object = {flag:false, listID : 0};
			for (let j = 0; j < this.state.currentUserFavItems.length; j++) {
				if (this.state.currentUserFavItems[j].URL.Url.includes(this.state.currentDataset[0][i].FileLeafRef))
					flag = true
				listID = this.state.currentUserFavItems[j].ID
				// object = {flag:true, listID : this.state.currentUserFavItems[j].ID}
			}
			favDocMapping.push(flag)
			favListIDs.push(listID)
		}
		console.log(favDocMapping)
		this.setState({
			favDocMapping: favDocMapping,
			favListIDs: favListIDs
		})
	}
	public async toggleFavorites(item, isFavorite, listID) {
		console.log(item)
		console.log(isFavorite, listID)
		// this.SPService.toggleFavorites(item, isFavorite, listID)
		this.getAllDocs2(this.state.brandID);
		this.getFavoriteListItems()
	}

	public async addFeatured(docID, featured) {
		console.log(docID, featured)

		if (featured == true) {
			await this.SPService.removedFeatured(docID);
			// toast.error('Removed Featured!', {
			// 	position: "top-right",
			// 	autoClose: 5000,
			// 	hideProgressBar: false,
			// 	closeOnClick: true,
			// 	pauseOnHover: true,
			// 	draggable: true,
			// 	progress: undefined,
			// });
		}
		else {
			await this.SPService.addFeatured(docID);
			// toast.success('Featured Updated',
			// 	{
			// 		position: "top-right",
			// 		autoClose: 5000,      // 		hideProgressBar: false,
			// 		closeOnClick: true,
			// 		pauseOnHover: true,
			// 		draggable: true,
			// 		progress: undefined,
			// 	});
		}
		console.log(docID);
		this.getAllDocs2(this.state.brandID);
	}
	@autobind
	public async getAllDocs2(brandID) {
		console.log(brandID)
		let selTerm = this.props.terms;
		console.log(selTerm[0].name)
		// let allDocs = await this.SPService.getAllDocs(selTerm);
		//  let allDocs = await this.SPService.getAllDocs(brandID, selTerm[0].name);
		let lowerRange = 0, upperRange = 4500;
		let alldocs2 = []
		let currentDocSet = [];

		//approach 1 to get ranged documents
		/* do {
			currentDocSet = []
			currentDocSet = await this.SPService.getAllDocsCAML(brandID, selTerm[0].name, lowerRange, upperRange)
			alldocs2 = [...alldocs2, ...currentDocSet]
			lowerRange = upperRange + 1;
			upperRange = upperRange + 4500;
 
		} while (currentDocSet.length > 0)
 
		//adding one more iteration even if the result is empty last time.
		currentDocSet = await this.SPService.getAllDocsCAML(brandID, selTerm[0].name, lowerRange, upperRange)
 
		alldocs2 = [...alldocs2, ...currentDocSet] */

		//approach 2 to get ranged documents
		for (let i = 0; i < 6; i++) {
			currentDocSet = []
			currentDocSet = await this.SPService.getAllDocsCAML(brandID, selTerm[0].name, lowerRange, upperRange)
			alldocs2 = [...alldocs2, ...currentDocSet]
			lowerRange = upperRange + 1;
			upperRange = upperRange + 4500;
		}

		console.log(alldocs2)
		// console.log(allDocs[0].ListItemAllFields.Brand.Label);
		// console.log(allDocs)
		let dataset = [];
		var myObj = (this.props.filePickerResult);
		var image = myObj.fileAbsoluteUrl ? myObj.fileAbsoluteUrl : null;
		dataset.push(alldocs2, image);
		this.setState({
			currentDataset: dataset
		})
		console.log(this.state.currentDataset[0])
	}




	public async componentDidMount(): Promise<void> {
		// const stores= await taxonomy.termStores.get();

		const sets = await taxonomy.termStores.getByName("Taxonomy_emiHFC2qzG0vaXZyRo69WQ==").getTermGroupById("885d1a0f-7a5d-48b2-9c87-377a25b3c8cd").termSets.select("Name").get()
		console.log(sets);
		//     const terms4: (ITerm & ITermData)[] = await store.getTermSetById("0ba6845c-1468-4ec5-a5a8-718f1fb05431").terms.get()


		const store: ITermStore = taxonomy.termStores.getByName("Taxonomy_emiHFC2qzG0vaXZyRo69WQ==");
		console.log(store);

		// const group: ITermGroup = await store.getTermGroupById("b6da94cd-5a33-4632-9ac1-d54248e2755c");
		this.getUserGroups2();
		// console.log("ABASBASBASBABSBASBSBSABSBABSBAB")
		const myArray = window.location.href.split("/");
		let brandID = myArray[myArray.length - 1].split(".")[0];
		// let brandID = "Brand1651756225855"
		console.log(brandID)
		this.props.terms ? this.getAllDocs2(brandID) : null
		this.setState({
			brandID: brandID
		});

		this.getCurrentUser()
		this.getAllDocs2(brandID);
		this.getFavoriteListItems()
		this.getUserGroups2();
		this.getFavoriteListItems();
		this.checkFavDocuments();
	}

	// componentDidUpdate(prevProps) {
	//   if (prevProps.term !== this.props.terms) {
	//     console.log("Gadbad hai daya!!")

	//     this.props.terms ? this.getAllDocs2(this.state.brandID) : null
	//   }
	// }


	@autobind
	public async getUserGroups2() {

		let usrGroups = await this.SPService.getUserGroups();
		// console.log(usrGroups);
		this.setState({
			currUserGroups: usrGroups,

		});
		// console.log(this.state.currUserGroups);

		this.categorizeGroups();
	}

	@autobind
	public async categorizeGroups() {

		this.setState({
			displayFlag: false
		})
		let response = this.state.currUserGroups;
		// var finalArray = response.value.map(function (obj: { Title: any; }) {
		// 	return obj.Title;
		// });
		var finalArray = response.value.map(function (obj: { displayName: any; }) {
			return obj.displayName;
		});

		// console.log(finalArray);
		// console.log(this.props.people);
		// var usrFullname = this.SPService.checkUseFullname(this.props.people);
		// console.log(usrFullname);

		// const GroupArray = this.props.people.map((obj: { email: any; }) => {
		// 	return obj.email;
		// });
		var tempPeopleArray = this.props.people
		const GroupArray = tempPeopleArray.map(element => element.description);
		//     console.log(GroupArray)
		// console.log(GroupArray)
		let usrFullname = await (await sp.web.currentUser()).Email;

		var Groupintersections = finalArray.filter(e => GroupArray.indexOf(e) !== -1);
		for (let i = 0; i < this.props.people.length; i++) {
			// console.log(this.props.people[i].fullName);
			if (GroupArray.includes(usrFullname) || Groupintersections.length > 0) {
				// console.log("User Can view this section...!!");
				this.setState({
					displayFlag: true
				})
			}
		}





		// for (let i = 0; i < this.props.people.length; i++) {
		//   console.log(this.props.people[i].fullName);
		//   if (finalArray.includes(this.props.people[i].fullName) || usrFullname) {
		//     // console.log("User Can view this section...!!");
		//     this.setState({
		//       displayFlag: true
		//     })
		//     this.render();
		//   }
		//   else {
		//     this.setState({
		//       displayFlag: false
		//     })
		//   }
		// }

	}

	public async getCurrentUser() {
		let curuser = await this.SPService.getCurrentUser();
		let cur = curuser.LoginName.split('|')
		console.log(curuser)
		console.log(cur, cur[cur.length - 1])
		this.setState({
			currentUserEmail: cur[cur.length - 1],
			cuurentUserID: curuser.Id
		})
	}


	public render(): React.ReactElement<IAtlasSpotlightConnectProps> {


		// var termName = this.props.terms[0].name
		// console.log(termName);
		// console.log(this.props.linkOrMetadata)
		try {
			// Set Image URL received from the file picker component--->
			var myObj = (this.props.filePickerResult);
			var image = myObj.fileAbsoluteUrl;
			// console.log(myObj, image)
			// console.log(this.context.pageContext.web.absoluteUrl)
		}
		catch (err) {
			// console.error(err);

		}

		return (

			this.state.displayFlag ?
				<div id="LoaderId">

					<div className="ms-rte-embedcode ms-rte-embedwp" >
						<div className={styles.MainContainer}
							style={{
								backgroundImage: "url(" + image + ")",
								backgroundPosition: 'center',
								backgroundSize: 'cover',
								backgroundRepeat: 'no-repeat'
							}}>

							{this.props.linkOrMetadata == 'Link' ?
								<a className={styles.callToAction}
									href={this.props.hyperlink} target="_blank" unselectable="on">
									{this.props.titleText}
									<i><IoIosArrowForward /></i>
								</a>
								:
								<a className={styles.callToAction}
									onClick={() => this.openModal(1)} unselectable="on">
									{this.props.titleText}
									<i><IoIosArrowForward /></i>
								</a>

							}

							{this.state.showDescriptionModal == true ?
								<DescriptionModal onClose={this.closeModal} dataset={this.state.currentDataset} favDocMapping={this.state.favDocMapping}
								favListIDs={this.state.favListIDs} brandID={this.state.brandID} terms = {this.props.terms} ></DescriptionModal>
								:
								null
							}
						</div>
					</div>

				</div>
				: null
			// <div>
			//   You need permission to view this webpart
			// </div>







		);
	}

}
