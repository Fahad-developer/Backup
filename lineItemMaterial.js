import { LightningElement, track, wire } from "lwc";
import { fireEvent } from "c/pubsub";
import plusbutton from "@salesforce/resourceUrl/plusIcon";
import { CurrentPageReference } from "lightning/navigation";
import minusbutton from "@salesforce/resourceUrl/minusIcon";
import CURRENCY from '@salesforce/i18n/currency';
import searchIcon from "@salesforce/resourceUrl/searchIcon";
import dropdown from "@salesforce/resourceUrl/SectionDownIcon";
import { registerListener, unregisterAllListeners } from "c/pubsub";
import apexSearch from "@salesforce/apex/estimateControllerExtension.search";

import apexTax from "@salesforce/apex/tax.getTaxPercentage";

export default class Material extends LightningElement {
  name = plusbutton;
  name1 = minusbutton;
  img = searchIcon;
  dropdown = dropdown;
  @wire(CurrentPageReference) pageRef;
  @track dimension_type;
  @track show = true;
  @track uom = "";
  @track retail_price = "";
  @track quantity = "";
  @track total = "";
  @track discount = "";
  @track discount_amount = "";
  @track sub_total = "";
  @track tax = "";
  @track tax_amount = "";
  @track total_all = "";
  @track other_fix_cost = "";
  @track cost = "";
  @track total_cost = "";
  @track show_hide = "show";
  @track data;
  @track unit = "num";
  @track clearAll = null;
  @track currencychange;
  
  calculated_quantity = 1;
  fold() {
    if (this.show_hide === "show") this.show_hide = "hide";
    else this.show_hide = "show";
  }

  connectedCallback() {
    
    //this function is to retreive the tax custom settings from apex
    apexTax().then(ret => {
      console.log(ret);
      this.tax = ret
      fireEvent(this.pageRef, "productTaxChange", this.tax);
    });

    
    registerListener("TypeChangeNotifyMaterial", this.handleTypeChange, this);
    registerListener(
      "calculatedQuantityChangeInMaterial",
      this.handleCalculatedQuantityChange,
      this
    );
    registerListener("handledimensionChangelength", this.compdatalength, this);
    registerListener("handledimensionChangeArea", this.compdataArea, this);
    registerListener("handledimensionChangeVolume", this.compdataVolume, this);
    registerListener("materialServiceValue", this.NumInfo, this);
    registerListener("handlelength", this.lengthHandle, this);
    registerListener("handleArea", this.AreaHandle, this);
    registerListener("handleVolume", this.volumeHandle, this);


    const currencyUnit = `${CURRENCY}`;

    let myArray = {
      'USD': '$', 'GBP': '£', 'AUD': 'A$', 'CAD': 'Can$', 'JPY': '¥',
      'EUR': '€', 'NOK': 'kr', 'RUB': '₽', 'TRY': '₺', 'AED': 'د.إ', 'BDT': '৳',
      'CNY': '¥ /元', 'INR': '₹', 'PKR': 'Rs'
    };

    this.currencychange = myArray[currencyUnit];
  }
  disconnectedCallback() {
    unregisterAllListeners(this);
  }
  volumeHandle(value) {
    this.unit = value;
  }
  AreaHandle(value) {
    this.unit = value;
  }
  lengthHandle(value) {
    this.unit = value;
  }
  compdatalength(value) {
    this.unit = value;
    this.uom = null;
    this.retail_price = null;
    this.quantity = null;
    this.total = null;
    this.discount = null;
    this.discount_amount = null;
    this.sub_total = null;
   // this.tax = null;
    this.tax_amount = null;
    this.total_all = null;
    this.other_fix_cost = null;
    this.cost = null;
    this.total_cost = null;
    this.calculated_quantity= 1;
    
    
  }
  compdataArea(value) {
    this.unit = value;
    this.uom = null;
    this.retail_price = null;
    this.quantity = null;
    this.total = null;
    this.discount = null;
    this.discount_amount = null;
    this.sub_total = null;
    //this.tax = null;
    this.tax_amount = null;
    this.total_all = null;
    this.other_fix_cost = null;
    this.cost = null;
    this.total_cost = null;
    this.calculated_quantity= 1;
    
    
  }
  compdataVolume(value) {
    this.unit = value;
    this.uom = null;
    this.retail_price = null;
    this.quantity = null;
    this.total = null;
    this.discount = null;
    this.discount_amount = null;
    this.sub_total = null;
    //this.tax = null;
    this.tax_amount = null;
    this.total_all = null;
    this.other_fix_cost = null;
    this.cost = null;
    this.total_cost = null;
    this.calculated_quantity= 1;
    
    
  }
  NumInfo(value) {
    this.unit = value;
    this.uom = null;
    this.retail_price = null;
    this.quantity = null;
    this.total = null;
    this.discount = null;
    this.discount_amount = null;
    this.sub_total = null;
    //this.tax = null;
    this.tax_amount = null;
    this.total_all = null;
    this.other_fix_cost = null;
    this.cost = null;
    this.total_cost = null;
    this.calculated_quantity= 1;
    
    
  }

  //   compdata(value){
  //     if(this.type === "UOMl"){
  //       if(value===true){
  //           this.data = "m";
  //            }
  //           this.data = "ft";
  //           }
  //           //  else if(value===false){
  //           //    this.data = "ft";
  //           //  }
  //         else if(this.type=== "UOMA"){
  //           if(value===true){
  //             this.data = "m²";
  //              }
  //              this.data = "ft²";
  //             //  else if(value===false){
  //             //    this.data = "ft²";
  //             //  }
  //         }
  //         else if(this.type=== "UOMV"){
  //           if(value===true){
  //             this.data = "m3";
  //              }
  //              this.data = "ft3";
  //             //  else if(value===false){
  //             //    this.data = "ft3";
  //             //  }
  //         }

  // }

  handleCalculatedQuantityChange(value) {
    this.calculated_quantity = value;
    this.calculate();
  }
  handleTypeChange(value) {
    console.log("I am in type material.");
    console.log("Type: " + value);
    if (value === "Labor") {
      this.show = false;
    } else this.show = true;
  }
  handleSearch(event) {
    console.log(event);
    console.log(event.detail.searchTerm);
    event.detail.unit = this.unit;
    apexSearch(event.detail)
      .then(results => {
        console.log(results);
        this.template.querySelector("c-lookup").setSearchResults(results);
      })
      .catch(error => {
        this.notifyUser(
          "Lookup Error",
          "An error occured while searching with the lookup field.",
          "error"
        );
        // eslint-disable-next-line no-console
        console.error("Lookup error", JSON.stringify(error));
        this.errors = [error];
      });
  }

  handleSelectionChange(event) {
    console.log(event);
    console.log(event.detail.record);
    if (event.detail.record.uom) this.uom = event.detail.record.uom;
    else this.uom = "";
    if (event.detail.record.name) this.up = event.detail.record.name;
    else this.up = "";
    if (event.detail.record.price)
      this.retail_price = event.detail.record.price;
    else this.retail_price = "";
    if (event.detail.record.cost) this.cost = event.detail.record.cost;
    else this.cost = "";
    this.errors = [];
    fireEvent(this.pageRef, "productChange", event.detail.record);
    // this.retail_price++;
    this.calculate();
  }
  changeRetailPrice(event) {
    console.log(event);

    this.retail_price = event.data.value;
    fireEvent(this.pageRef, "productRetailPriceChange", event.data.value);
    this.calculate();
  }
  changeProdustCost(event) {
    console.log(event);
    console.log(event.target);
    this.cost = event.target.value;
    fireEvent(this.pageRef, "productCostChange", event.data.value);
    this.calculate();
  }
  changeQuantity(event) {
    console.log(event);
    this.quantity = event.data.value;
    fireEvent(this.pageRef, "productQuantityChange", event.data.value);
    this.calculate();
  }
  changeDiscount(event) {
    console.log(event);
    if (event.data.value > 100) this.discount = 100;
    else this.discount = event.data.value;
    fireEvent(this.pageRef, "productDiscountChange", event.data.value);
    this.calculate();
  }
  
  changeTax(event) {
    console.log(event);
    this.tax = event.data.value;
    fireEvent(this.pageRef, "productTaxChange", event.data.value);
    this.calculate();
  }
  changeOtherFixCost(event) {
    console.log(event);
    this.other_fix_cost = event.data.value;
    fireEvent(this.pageRef, "productOtherFixCostChange", event.data.value);
    this.calculate();
  }
  calculate() {
    if (this.retail_price && this.quantity) {
      this.total = this.retail_price * this.quantity * this.calculated_quantity;
      this.total = parseFloat(this.total).toFixed(2);
    } else {
      this.total = "";
    }
    if (
      // this.discount &&
      this.total
    ) {
      this.discount_amount = (this.total * this.discount) / 100;
      this.discount_amount = parseFloat(this.discount_amount).toFixed(2);
      this.sub_total = this.total - this.discount_amount;
      this.sub_total = parseFloat(this.sub_total).toFixed(2);
    } else {
      this.discount_amount = "";
      this.sub_total = "";
    }
    if (
      // this.tax &&
      this.sub_total
    ) {
      this.tax_amount = (this.sub_total * this.tax) / 100;
      this.tax_amount = parseFloat(this.tax_amount).toFixed(2);

      this.total_all = 1 * this.sub_total + 1 * this.tax_amount;
      this.total_all = parseFloat(this.total_all).toFixed(2);
    } else {
      this.total_all = "";
    }
    if (this.cost && this.quantity) {
      this.total_cost = this.cost * this.quantity * this.calculated_quantity;
      this.total_cost = parseFloat(this.total_cost).toFixed(2);
    } else {
      this.total_cost = "";
    }
    //change to add other fixed cost from total cost price to total retail price 
    //this.total_cost = 1 * this.total_cost + 1 * this.other_fix_cost;
    //this.total_cost = parseFloat(this.total_cost).toFixed(2);

    this.total_all = 1 * this.total_all + 1 * this.other_fix_cost;
    this.total_all = parseFloat(this.total_all).toFixed(2);
  }
}
