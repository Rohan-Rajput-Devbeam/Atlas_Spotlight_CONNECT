import * as React from 'react';
import styles from './AtlasSpotlightConnect.module.scss';
import { IAtlasSpotlightConnectProps } from './IAtlasSpotlightConnectProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IoIosArrowForward } from "react-icons/io";
import autobind from 'autobind-decorator';
import { DescriptionModal } from './DescriptionModal';
import { Container } from 'react-bootstrap';
import { SPService } from '../Service/SPServices';



export interface IAtlasSpotlightConnectState {
  showDescriptionModal: boolean;
  currentDataset: any;
  brandID: any;
}


export default class AtlasSpotlightConnect extends React.Component<IAtlasSpotlightConnectProps, IAtlasSpotlightConnectState> {
  public SPService: SPService = null;

  public constructor(props: IAtlasSpotlightConnectProps) {
    super(props);
    this.SPService = new SPService(this.props.context);

    this.state = ({
      showDescriptionModal: false,
      currentDataset: [],
      brandID: ""

    })
  }
  @autobind
  openModal(id: number) {
    console.log(id)
    let dataset = [];
    dataset.push(this.props.terms)
    this.setState({
      showDescriptionModal: true,
    })
  }

  @autobind
  closeModal() { this.setState({ showDescriptionModal: false }); }

  public componentDidMount(): void {
console.log("ABASBASBASBABSBASBSBSABSBABSBAB")
    const myArray = window.location.href.split("/");
    let brandID = myArray[myArray.length - 1].split(".")[0];
    console.log(brandID)
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
    console.log(selTerm[0].name)
    // let allDocs = await this.SPService.getAllDocs(selTerm);
    let allDocs = await this.SPService.getAllDocs(brandID, selTerm[0].name);
    // console.log(allDocs[0].ListItemAllFields.Brand.Label);
    console.log(allDocs)
    let dataset = [];
    var myObj = (this.props.filePickerResult);
    var image = myObj.fileAbsoluteUrl ? myObj.fileAbsoluteUrl : null;
    dataset.push(allDocs, image);
    this.setState({
      currentDataset: dataset
    })



  }

  public render(): React.ReactElement<IAtlasSpotlightConnectProps> {


    // var termName = this.props.terms[0].name
    // console.log(termName);
    console.log(this.props.linkOrMetadata)
    try {
      // Set Image URL received from the file picker component--->
      var myObj = (this.props.filePickerResult);
      var image = myObj.fileAbsoluteUrl;

    }
    catch (err) {
      // console.error(err);

    }

    return (

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







    );
  }

}
