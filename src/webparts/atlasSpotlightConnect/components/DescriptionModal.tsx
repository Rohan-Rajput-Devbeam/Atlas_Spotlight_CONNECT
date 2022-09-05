import * as React from 'react';
// import styles from './AtlasSpotlightConnect.module.scss';
import './DocModal.css';
import styles from './AtlasSpotlightConnect.module.scss';



import { IAtlasSpotlightConnectProps } from './IAtlasSpotlightConnectProps';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import { SocialMediaIconsReact } from 'social-media-icons-react';

import { IoIosStar, IoIosStarOutline, IoMdDownload } from "react-icons/io";


import { Icon } from '@fluentui/react/lib/Icon';
import { getFileTypeIconProps, FileIconType, initializeFileTypeIcons } from '@fluentui/react-file-type-icons';
import { SPService } from '../Service/SPServices';


initializeFileTypeIcons(undefined);

export class DescriptionModal extends React.Component<any, any> {
    public SPService: SPService = null;

    closeModal = e => {
        this.setState({ isOpen: false }, () => {
            if (this.props.onClose) {
                this.props.onClose(this.state);
            }
        })
    };

    constructor(props) {
        super(props);
        this.SPService = new SPService(this.props.context);

        this.state = ({
            isOpen: true
        })


    }
    componentDidMount() {
        this.setState({
            isOpen: true
        });
        console.log(this.props.dataset[1])
        console.log(this.props.favDocMapping)


        this.addFeatured_1 = this.addFeatured_1.bind(this)
        this.getCurrentUser_1();
        // this.getFavoriteListItems_1()
        // this.checkFavDocuments_1()
    }

    public async getCurrentUser_1() {
        let curuser = await this.SPService.getCurrentUser_1();
        let cur = curuser.LoginName.split('|')
        console.log(curuser)
        console.log(cur, cur[cur.length - 1])
        this.setState({
            currentUserEmail: cur[cur.length - 1],
            cuurentUserID: curuser.Id
        })
    }

    // public async getFavoriteListItems_1() {
    //     let fav = await this.SPService.getFavoriteListItems_1(this.state.cuurentUserID);
    //     console.log(fav)
    //     let currUserFav = fav.filter(item => item.AuthorId == this.state.cuurentUserID);
    //     console.log(currUserFav)
    //     this.setState({
    //         currentUserFavItems: currUserFav
    //     }, () => this.checkFavDocuments_1())

    //     // let bab = await this.SPService._pnpPagedSearchSegmentClick(this.state.cuurentUserID)
    //     // console.log(bab)
    // }


    // public async checkFavDocuments_1() {
    //     let favDocMapping = []
    //     let favListIDs = []
    //     for (let i = 0; i < this.state.currentDataset[0].length; i++) {
    //         let flag = false;
    //         let listID = -1;
    //         // let object = {flag:false, listID : 0};
    //         for (let j = 0; j < this.state.currentUserFavItems.length; j++) {
    //             if (this.state.currentUserFavItems[j].URL.Url.includes(this.state.currentDataset[0][i].FileLeafRef))
    //                 flag = true
    //             listID = this.state.currentUserFavItems[j].ID
    //             // object = {flag:true, listID : this.state.currentUserFavItems[j].ID}
    //         }
    //         favDocMapping.push(flag)
    //         favListIDs.push(listID)
    //     }
    //     console.log(favDocMapping)
    //     this.setState({
    //         favDocMapping: favDocMapping,
    //         favListIDs: favListIDs
    //     })
    // }
    public async toggleFavorites_1(item, isFavorite, listID) {
        console.log(item)
        console.log(isFavorite, listID)
       await this.SPService.toggleFavorites_1(item, isFavorite, listID)
        // this.getAllDocs2_1(this.props.brandID);
        // this.getFavoriteListItems_1()
        console.log(this.props.favDocMapping)
    }

    public async addFeatured_1(docID, featured) {
        console.log(docID, featured)

        if (featured == true) {
            await this.SPService.removedFeatured_1(docID);
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
            await this.SPService.addFeatured_1(docID);
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
        // this.getAllDocs2_1(this.props.brandID);
    }

    public async getAllDocs2_1(brandID) {
        console.log(brandID)
        let selTerm = this.props.terms;
        console.log(selTerm)
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
        console.log(this.state.currentDataset)
    }



    public render() {

        return (
            // <h3></h3>
            <>
                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css"></link>
                <script src='https://kit.fontawesome.com/a076d05399.js'
                    crossOrigin='anonymous'></script>



                <Modal show={this.state.isOpen} onHide={this.closeModal} keyboard={false} size="lg">
                    <Modal.Header className={'modalHeader'} closeButton>
                        <Modal.Title>Ourbrand Documents</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{
                        // backgroundImage: "url(" + `${this.props.dataset[1]}` + ")",
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat'
                    }} className={'docView'}>
                        <Container>
                            <Row
                                style={{
                                    // background: "rgba(255,255,255,0.8)",
                                    // borderRadius: "25px",
                                    // padding: "7px",
                                    // paddingTop: "20px"
                                    marginRight: "-68px"
                                }}
                            >



                                {console.log(this.props.dataset)}
                                <ul>
                                    {this.props.dataset.length != 0 ?
                                        <>
                                            {
                                                this.props.dataset[0].length != 0 ?
                                                    <>
                                                        {
                                                            this.props.dataset[0].map((itemDetail, i) => (
                                                                <>
                                                                {console.log(itemDetail, i)}
                                                                

                                                                <li className={'doc'}>
                                                                    {/* <span

                                                                        className="fa fa-star-o icon-star-empty"></span> */}
                                                                    {/* {this.props.favDocMapping[i] == true ?

                                                                        <IoIosStar style={{ marginLeft: "10px" }} 
                                                                        onClick={this.toggleFavorites_1.bind(this, itemDetail, this.props.favDocMapping[i], this.props.favListIDs[i])}
                                                                         size={20} className={styles.downloadBut1} />

                                                                        

                                                                        :
                                                                        <IoIosStarOutline style={{ marginLeft: "10px" }} 
                                                                        onClick={this.toggleFavorites_1.bind(this, itemDetail, this.props.favDocMapping[i], this.props.favListIDs[i])} size={20} className={styles.downloadBut1} />

                                                                    


                                                                    } */}

                                                                    <a target="_blank" data-interception="off" rel="noopener noreferrer" href={itemDetail.ServerRedirectedEmbedUri != null && itemDetail.ServerRedirectedEmbedUri != "" ? itemDetail.ServerRedirectedEmbedUri : itemDetail.ServerRelativeUrl}>
                                                                        <Icon {...getFileTypeIconProps({
                                                                            extension: itemDetail.FileLeafRef.split(".")[1],
                                                                            size: 20,
                                                                            imageFileType: 'svg'
                                                                        })} /> {itemDetail.FileLeafRef}</a>
                                                                    <a data-interception="off" rel="noopener noreferrer" className="docDownload doc-download-link" href={"https://bgsw1.sharepoint.com/sites/CONNECTII/_layouts/download.aspx?SourceUrl=" + itemDetail.ServerRelativeUrl} download> <IoMdDownload /></a>

                                                                </li>
                                                                </>

                                                            )
                                                            )
                                                        }
                                                    </>
                                                    :
                                                    <h3>No data available!</h3>
                                            }
                                        </>
                                        :
                                        <h3>Please wait while loading the data...</h3>
                                    }
                                </ul>





                            </Row>
                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button style={{ height: "50px" }} variant="secondary" onClick={this.closeModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>



            </>
        );
    }
}