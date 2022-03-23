import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart, WebPartContext } from '@microsoft/sp-webpart-base';

import * as strings from 'AtlasSpotlightConnectWebPartStrings';
import AtlasSpotlightConnect from './components/AtlasSpotlightConnect';
import { IAtlasSpotlightConnectProps } from './components/IAtlasSpotlightConnectProps';

import { PropertyFieldFilePicker, IPropertyFieldFilePickerProps, IFilePickerResult } from "@pnp/spfx-property-controls/lib/PropertyFieldFilePicker";
import { PropertyFieldEnterpriseTermPicker } from '@pnp/spfx-property-controls/lib/PropertyFieldEnterpriseTermPicker';

import { IPickerTerms } from "@pnp/spfx-property-controls/lib/PropertyFieldEnterpriseTermPicker";
import { PrincipalType, PropertyFieldPeoplePicker, PropertyFieldTermPicker } from '@pnp/spfx-property-controls';
import { PropertyFieldMessage} from '@pnp/spfx-property-controls/lib/PropertyFieldMessage';
import { MessageBarType } from '@fluentui/react';


export interface IAtlasSpotlightConnectWebPartProps {
  titleText: string;
  filePickerResult: any;
  description: string;
  hyperlink:any;
  terms: IPickerTerms;
  linkOrMetadata:any;
  people:any;

}

export default class AtlasSpotlightConnectWebPart extends BaseClientSideWebPart<IAtlasSpotlightConnectWebPartProps> {

  

  public render(): void {
    const element: React.ReactElement<IAtlasSpotlightConnectProps> = React.createElement(
      AtlasSpotlightConnect,
      {
        description: this.properties.description,
        filePickerResult: this.properties.filePickerResult,
        titleText: this.properties.titleText,
        hyperlink:this.properties.hyperlink,
        terms:this.properties.terms,
        linkOrMetadata:this.properties.linkOrMetadata,
        people: this.properties.people,

        context:this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    let linkOrMetadataProperty:any=[];

    if(this.properties.linkOrMetadata=='Link'){
      linkOrMetadataProperty = PropertyPaneTextField('hyperlink', {
        label: "Hyperlink",
        placeholder: "Enter your url",
        value: this.properties.hyperlink,

      })
    }
    else{
      linkOrMetadataProperty =  PropertyFieldTermPicker('terms', {
        label: 'Select terms',
        panelTitle: 'Select terms',
        initialValues: this.properties.terms,
        allowMultipleSelections: false,
        excludeSystemGroup: false,
        onPropertyChange: this.onPropertyPaneFieldChanged,
        properties: this.properties,
        context: this.context,
        onGetErrorMessage: null,
        deferredValidationTime: 0,
        limitByGroupNameOrID: 'ConnectModern',
        // limitByTermsetNameOrID: 'Location',
        key: 'termSetsPickerFieldId'
      })
    }


    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
               
                PropertyPaneTextField('titleText', {
                  label: 'Title',
                  value: this.properties.titleText,
                  maxLength: 50,
                  description: 'Max Char length is 50.'
                }),
                PropertyPaneDropdown('linkOrMetadata', {
                  label: 'Link/Manage Metadata',
                  options: [

                    { key: 'Link', text: 'Link' },
                    { key: 'Manage Metadata', text: 'Manage Metadata' }
                  ]
                }
                ),

                linkOrMetadataProperty,

                PropertyFieldFilePicker('filePicker', {
                  context: this.context,
                  filePickerResult: this.properties.filePickerResult,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  onSave: (e: IFilePickerResult) => { this.properties.filePickerResult = e; },
                  onChanged: (e: IFilePickerResult) => { this.properties.filePickerResult = e; },
                  key: "filePickerId",
                  buttonLabel: "Image Picker",
                  label: "Select Image",
                  
                }),
              //   PropertyFieldMessage("", {
              //     key: "MessageKey",
              //     text: "Image dimensions should be 1200(width) x 150(height)",
              //     messageType:  MessageBarType.info,
              //     isVisible:  true ,
              // }),
                PropertyFieldPeoplePicker('people', {
                  label: 'People Picker',
                  initialData: this.properties.people,
                  allowDuplicate: false,
                  principalType: [PrincipalType.Users, PrincipalType.SharePoint, PrincipalType.Security],
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  context: this.context as any,
                  properties: this.properties,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'peopleFieldId'

                })
               
                // PropertyPaneTextField('hyperlink', {
                //   label: "Hyperlink",
                //   placeholder: "Enter your url",
                //   value: this.properties.hyperlink,

                // }),
                // PropertyFieldEnterpriseTermPicker('terms', {
                //   label: 'Select terms',
                //   panelTitle: 'Select terms',
                //   initialValues: this.properties.terms,
                //   allowMultipleSelections: true,
                //   excludeSystemGroup: false,
                //   onPropertyChange: this.onPropertyPaneFieldChanged,
                //   properties: this.properties,
                //   context: this.context,
                //   onGetErrorMessage: null,
                //   deferredValidationTime: 0,
                //   limitByGroupNameOrID: 'People',
                //   limitByTermsetNameOrID: 'Location',
                //   key: 'termSetsPickerFieldId',
                //   includeLabels: true
                // }),
                // PropertyFieldTermPicker('terms', {
                //   label: 'Select terms',
                //   panelTitle: 'Select terms',
                //   initialValues: this.properties.terms,
                //   allowMultipleSelections: false,
                //   excludeSystemGroup: false,
                //   onPropertyChange: this.onPropertyPaneFieldChanged,
                //   properties: this.properties,
                //   context: this.context,
                //   onGetErrorMessage: null,
                //   deferredValidationTime: 0,
                //   limitByGroupNameOrID: 'ConnectModern',
                //   // limitByTermsetNameOrID: 'Location',
                //   key: 'termSetsPickerFieldId'
                // })
              ]
            }
          ]
        }
      ]
    };
  }
}
