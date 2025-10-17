import { LightningElement ,api, track, wire } from "lwc";
import { CurrentPageReference } from "lightning/navigation";
import SectionDownIcon from "@salesforce/resourceUrl/SectionDownIcon";
import { fireEvent } from "c/pubsub";
import getLatestLineItem from "@salesforce/apex/lineItemControllerExtension.getLatestLineItemNo";

export default class LiInfo extends LightningElement {
  sdi = SectionDownIcon;
  type;
  item_name;
  item_description;
  @track LiDimensions;
  @track show_hide = "show";
  @track cssClass = "slds-radio__label radio-button-label";
  @track mClass = "slds-radio__label radio-button-label";
  @track sClass = "slds-radio__label radio-button-label";
  @track UOM
  @track msLabelClass = "slds-form-element__label";
  @track mLabelClass = "slds-form-element__label";
  @track sLabelClass = "slds-form-element__label";
  @track LastLineItemNo;
  @track lineitemName = "Lineitem#";
  @track clearAll = null;
  @api sync=false;
 
 


  @wire(CurrentPageReference)
  getPageRef(pageRef){
    this.pageRef = pageRef;
    this.sync = true;
  };
  @wire(getLatestLineItem, {sync: '$sync'})
  wiredLastLineItemNo({ error, data }) {
    if(this.sync){
      if (data) {
        this.LastLineItemNo = data;
        let a = this.LastLineItemNo;
        a++;
        this.LastLineItemNo = a;

        this.lineitemName = "Default lineItem" + this.LastLineItemNo;
        this.item_name = this.lineitemName;

        fireEvent(this.pageRef, "nameChange", this.item_name);
        this.error = undefined;
      } 
      else if (error) {
        this.error = error;
        this.LastLineItemNo = 0;
      }
    }
    
  }

  @wire(CurrentPageReference) pageRef;
  fold() {
    if (this.show_hide === "show") this.show_hide = "hide";
    else this.show_hide = "show";
  }
  // hideDimension() {
  //   fireEvent(this.pageRef, "showHideDimension", false);
  // }
  // showDimension() {
  //   fireEvent(this.pageRef, "showHideDimension", true);
  // }
  showFun(event){
  if(event.target.checked===true){
    this.UOM ="ft"
    fireEvent(this.pageRef, "materialServiceValue", this.UOM); 
  } 
  else{
    this.UOM ="num"
    fireEvent(this.pageRef, "materialServiceValue", this.UOM);
    
  }
  if(event.target.checked===true){
    this.UOM ="ft"
    fireEvent(this.pageRef, "dimensionValidation", this.UOM); 
  } 
  else{
    this.UOM ="num"
    fireEvent(this.pageRef, "dimensionValidation", this.UOM);
    
  }
  if(event.target.checked===true){
    this.UOM ="ft"
    fireEvent(this.pageRef, "showHideDimension", true); 
  } 
  else{
    this.UOM ="num"
    fireEvent(this.pageRef, "showHideDimension", false);
    
  }
   fireEvent(this.pageRef, "clearProduct", this.clearAll);
}


  handleLineItemNameChange(event) {
    // console.log(event.target);
    // console.log(event.target.id);
    this.lineitemName = event.target.value;
    this.item_name = event.target.value;
    fireEvent(this.pageRef, "nameChange", this.item_name);
  }
  handleLineItemDescriptionChange(event) {
    // console.log(event.target);
    // console.log(event.target.id);
    this.item_description = event.target.value;
    fireEvent(this.pageRef, "descriptionChange", event.target.value);
  }
  radioSelect(event) {
    console.log(event.target);
    console.log(event.target.id);
    if (event.target.id.includes("radio-0-2")) {
      this.cssClass =
        "slds-radio__label radio-button-label radio-button-label-selected";
      this.mClass = "slds-radio__label radio-button-label";
      this.sClass = "slds-radio__label radio-button-label";

      this.msLabelClass = "slds-form-element__label label-Selected";
      this.mLabelClass = "slds-form-element__label";
      this.sLabelClass = "slds-form-element__label";
      this.type = "Material&Labor";
      fireEvent(this.pageRef, "typeChange", "Material & Labor");
      fireEvent(this.pageRef, "TypeChangeNotifyMaterial", "Material&Labor");
      fireEvent(this.pageRef, "TypeChangeNotifyService", "Material&Labor");
      
    } else if (event.target.id.includes("radio-1-2")) {
      this.cssClass = "slds-radio__label radio-button-label";
      this.mClass =
        "slds-radio__label radio-button-label radio-button-label-selected";
      this.sClass = "slds-radio__label radio-button-label";

      this.msLabelClass = "slds-form-element__label";
      this.mLabelClass = "slds-form-element__label label-Selected";
      this.sLabelClass = "slds-form-element__label";
      this.type = "Material";
      fireEvent(this.pageRef, "typeChange", "Material");
      fireEvent(this.pageRef, "TypeChangeNotifyMaterial", "Material");
      fireEvent(this.pageRef, "TypeChangeNotifyService", "Material");
      
    } else if (event.target.id.includes("radio-2-2")) {
      this.cssClass = "slds-radio__label radio-button-label";
      this.mClass = "slds-radio__label radio-button-label";
      this.sClass =
        "slds-radio__label radio-button-label radio-button-label-selected";

      this.msLabelClass = "slds-form-element__label";
      this.mLabelClass = "slds-form-element__label";
      this.sLabelClass = "slds-form-element__label label-Selected";
      this.type = "Labor";
      fireEvent(this.pageRef, "typeChange", "Labor");
      fireEvent(this.pageRef, "TypeChangeNotifyMaterial", "Labor");
      fireEvent(this.pageRef, "TypeChangeNotifyService", "Labor");
      
    }
  }
}
