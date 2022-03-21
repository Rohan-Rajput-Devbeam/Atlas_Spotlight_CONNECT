import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IPickerTerms } from "@pnp/spfx-property-controls";

export interface IAtlasSpotlightConnectProps {
  description: string;
  filePickerResult: any;
  titleText: string;
  hyperlink:any;
  terms: IPickerTerms;
  linkOrMetadata:any;
  people:any;

  context: WebPartContext;




}
