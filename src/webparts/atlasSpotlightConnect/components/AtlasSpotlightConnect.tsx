import * as React from 'react';
import styles from './AtlasSpotlightConnect.module.scss';
import { IAtlasSpotlightConnectProps } from './IAtlasSpotlightConnectProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IoIosArrowForward } from "react-icons/io";
import autobind from 'autobind-decorator';
import { DescriptionModal } from './DescriptionModal';
import { Container } from 'react-bootstrap';
import { SPService } from '../Service/SPServices';

import { taxonomy, ITermGroup,ITermSets, ITermStore, ILabelMatchInfo, ITerms, ITermData } from "@pnp/sp-taxonomy";
import { ITerm } from '@pnp/sp/taxonomy';



export interface IAtlasSpotlightConnectState {
  showDescriptionModal: boolean;
  currentDataset: any;
  brandID: any;
  currUserGroups: any;
  displayFlag: boolean;

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



    })
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

  public async componentDidMount(): Promise<void> {
    // const stores= await taxonomy.termStores.get();

    const sets = await taxonomy.termStores.getByName("Taxonomy_10qkZWMjSPIPOU13f+TI4w==").getTermGroupById("b6da94cd-5a33-4632-9ac1-d54248e2755c").termSets.select("Name").get()
    console.log(sets);
//     const terms4: (ITerm & ITermData)[] = await store.getTermSetById("0ba6845c-1468-4ec5-a5a8-718f1fb05431").terms.get()


const store: ITermStore = taxonomy.termStores.getByName("Taxonomy_10qkZWMjSPIPOU13f+TI4w==");
console.log(store);

// const group: ITermGroup = await store.getTermGroupById("b6da94cd-5a33-4632-9ac1-d54248e2755c");





    this.getUserGroups2();
    // console.log("ABASBASBASBABSBASBSBSABSBABSBAB")
    const myArray = window.location.href.split("/");
    let brandID = myArray[myArray.length - 1].split(".")[0];
    // console.log(brandID)
    this.props.terms ? this.getAllDocs2(brandID) : null
    // this.setState({
    //   brandID: brandID
    // })


  }

  // componentDidUpdate(prevProps) {
  //   if (prevProps.term !== this.props.terms) {
  //     console.log("Gadbad hai daya!!")

  //     this.props.terms ? this.getAllDocs2(this.state.brandID) : null
  //   }
  // }

  @autobind
  public async getAllDocs2(brandID) {
    let selTerm = this.props.terms;
    // console.log(selTerm[0].name)
    // let allDocs = await this.SPService.getAllDocs(selTerm);
    let allDocs = await this.SPService.getAllDocs(brandID, selTerm[0].name);
    // console.log(allDocs[0].ListItemAllFields.Brand.Label);
    // console.log(allDocs)
    let dataset = [];
    var myObj = (this.props.filePickerResult);
    var image = myObj.fileAbsoluteUrl ? myObj.fileAbsoluteUrl : null;
    dataset.push(allDocs, image);
    this.setState({
      currentDataset: dataset
    })



  }
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
  public categorizeGroups() {
    this.setState({
      displayFlag: false
    })
    let response = this.state.currUserGroups;
    var finalArray = response.value.map(function (obj: { Title: any; }) {
      return obj.Title;
    });
    // console.log(finalArray);
    // console.log(this.props.people);
    var usrFullname = this.SPService.checkUseFullname(this.props.people);
    // console.log(usrFullname);

    for (let i = 0; i < this.props.people.length; i++) {
      console.log(this.props.people[i].fullName);
      if (finalArray.includes(this.props.people[i].fullName) || usrFullname) {
        // console.log("User Can view this section...!!");
        this.setState({
          displayFlag: true
        })
        this.render();
      }
      else {
        this.setState({
          displayFlag: false
        })
      }
    }

  }


  public render(): React.ReactElement<IAtlasSpotlightConnectProps> {


    // var termName = this.props.terms[0].name
    // console.log(termName);
    // console.log(this.props.linkOrMetadata)
    try {
      // Set Image URL received from the file picker component--->
      var myObj = (this.props.filePickerResult);
      var image = myObj.fileAbsoluteUrl;
      console.log(myObj , image)
      console.log(this.context.pageContext.web.absoluteUrl)
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
                <DescriptionModal onClose={this.closeModal} dataset={this.state.currentDataset} ></DescriptionModal>
                :
                null
              }
            </div>
          </div>

        </div>
        :
        <div>
          You need permission to view this webpart
        </div>







    );
  }

}
