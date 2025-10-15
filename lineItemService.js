import { LightningElement, track, wire } from "lwc";
import { fireEvent } from "c/pubsub";
import { CurrentPageReference } from "lightning/navigation";
import plusbutton from "@salesforce/resourceUrl/plusIcon";
import minusbutton from "@salesforce/resourceUrl/minusIcon";
import CURRENCY from '@salesforce/i18n/currency';
import searchIcon from "@salesforce/resourceUrl/searchIcon";
import dropdown from "@salesforce/resourceUrl/SectionDownIcon";
import { registerListener, unregisterAllListeners } from "c/pubsub";
import ServiceSearch from "@salesforce/apex/estimateControllerExtension.searchService";
import apexTax from "@salesforce/apex/tax.getTaxPercentage";

import getConvertedValuesForProduct from "@salesforce/apex/CurrencyConverterController.getConvertedValuesForProduct"; 


export default class Service extends LightningElement {
  name = plusbutton;
  name1 = minusbutton;
  img = searchIcon;
  dropdown = dropdown;
  @wire(CurrentPageReference) pageRef;

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
  @track unit = "num";
  @track clearAll = null;
  @track currencychange;

  // new properties
  originalProductId = null; 
  targetCurrencyCode = CURRENCY; 

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
      fireEvent(this.pageRef, "serviceTaxChange", this.tax);
    });

    registerListener("TypeChangeNotifyService", this.handleTypeChange, this);
    registerListener(
      "calculatedQuantityChangeInService",
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
    //this.tax = null;
    this.tax_amount = null;
    this.total_all = null;
    this.other_fix_cost = null;
    this.cost = null;
    this.total_cost = null;
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
   // this.tax = null;
    this.tax_amount = null;
    this.total_all = null;
    this.other_fix_cost = null;
    this.cost = null;
    this.total_cost = null;
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
   // this.tax = null;
    this.tax_amount = null;
    this.total_all = null;
    this.other_fix_cost = null;
    this.cost = null;
    this.total_cost = null;
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
  }

  handleCalculatedQuantityChange(value) {
    this.calculated_quantity = value;
    this.calculate();
  }
  handleTypeChange(value) {
    console.log("I am in type service.");
    console.log("Type: " + value);
    if (value === "Material") {
      this.show = false;
    } else this.show = true;
  }
  handleSearch(event) {
    console.log(event);
    console.log(event.detail.searchTerm);
    event.detail.unit = this.unit;
    ServiceSearch(event.detail)
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


  // Currency Conversion Logic Integrated Here.

 async handleSelectionChange(event) {
    console.log(event);
    const selectedRecord = event.detail.record;
    
    // 1. Product ID store karein
    this.originalProductId = selectedRecord.id; 

    if (selectedRecord.uom) this.uom = selectedRecord.uom;
    else this.uom = "";
    if (selectedRecord.name) this.up = selectedRecord.name;
    else this.up = "";
    
    // Prices ko reset karein
    this.retail_price = "";
    this.cost = "";
    
    this.errors = [];
    fireEvent(this.pageRef, "serviceChange", selectedRecord);
    
    // 2. Conversion Logic
    if (this.originalProductId) {
        try {
            // Apex method ko call karein
            const convertedData = await getConvertedValuesForProduct({
                productId: this.originalProductId,
                targetCurrencyCode: this.targetCurrencyCode 
            });

            // Converted Service Price aur Cost ko assign karein
            this.retail_price = convertedData.convertedServicePrice; // <-- Service Price
            this.cost = convertedData.convertedServiceCost;     // <-- Service Cost
            
            this.calculate();

        } catch (error) {
            console.error("Error in currency conversion:", JSON.stringify(error));
            // Fallback: Error aane par, original service price/cost ya 0 ko assign karein
            this.retail_price = selectedRecord.price || ""; 
            this.cost = selectedRecord.cost || "";
            this.calculate();
        }
    } else {
        // Agar ID na ho to original price/cost use karein
        this.retail_price = selectedRecord.price || "";
        this.cost = selectedRecord.cost || "";
        this.calculate();
    }
  }

  
  changeRetailPrice(event) {
    console.log(event);
    this.retail_price = event.data.value;
    this.calculate();
    fireEvent(this.pageRef, "serviceRetailPriceChange", event.data.value);
  }
  changeProdustCost(event) {
    console.log(event);
    console.log(event.target);
    this.cost = event.target.value;
    this.calculate();
    fireEvent(this.pageRef, "serviceCostChange", event.data.value);
  }
  changeQuantity(event) {
    console.log(event);
    this.quantity = event.data.value;
    this.calculate();
    fireEvent(this.pageRef, "serviceQuantityChange", event.data.value);
  }
  changeDiscount(event) {
    console.log(event);

    if (event.data.value > 100) this.discount = 100;
    else this.discount = event.data.value;
    this.calculate();
    fireEvent(this.pageRef, "serviceDiscountChange", event.data.value);
  }
  changeTax(event) {
    console.log(event);
    this.tax = event.data.value;
    this.calculate();
    fireEvent(this.pageRef, "serviceTaxChange", event.data.value);
  }
  changeOtherFixCost(event) {
    console.log(event);
    this.other_fix_cost = event.data.value;
    this.calculate();
    fireEvent(this.pageRef, "serviceOtherFixCostChange", event.data.value);
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
    // this.total_cost = 1 * this.total_cost + 1 * this.other_fix_cost;
    // this.total_cost = parseFloat(this.total_cost).toFixed(2);
    
    this.total_all = 1 * this.total_all + 1 * this.other_fix_cost;
    this.total_all = parseFloat(this.total_all).toFixed(2);
  }
}
