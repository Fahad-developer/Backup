import { LightningElement, track, wire } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import { CurrentPageReference } from "lightning/navigation";
import { registerListener, unregisterAllListeners, fireEvent } from "c/pubsub";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import setParameter from "@salesforce/apex/lineItemControllerExtension.setParameter";
import saveLineItem from "@salesforce/apex/lineItemControllerExtension.saveLineItem";
//import getParameter from "@salesforce/apex/lineItemControllerExtension.getParameter";

//saveLineItem
export default class ButtonFooter extends NavigationMixin(LightningElement) {
    @track test = null;
    @wire(CurrentPageReference) pageRef;
    @track dimension_type;
    @track shape;
    @track grand_total_price;
    @track grand_total_cost;
    @track id;
    @track dimension_typeLength = false;
    @track unit;
    estimate_id;
    Opportunity_id = "";
    Estimator_id = "";
    Customer_id = "";
    name;
    description;
    type;
    radius;
    length;
    width;
    height;
    area;
    volumn;
    product_id;
    product_name;
    product_uom;
    product_retail_price;
    product_quantity;
    product_total_price;
    product_discount_percent = 0;
    product_discount;
    product_sub_total;
    product_tax_percent = 0;
    product_tax;
    product_fix_cost = 0;
    product_total;
    product_cost;
    product_total_cost;
    service_id;
    service_name;
    service_uom;
    service_retail_price;
    service_quantity;
    service_discount_percent = 0;
    service_discount;
    service_sub_total;
    service_tax_percent = 0;
    service_tax;
    service_fix_cost = 0;
    service_total_price;
    service_total;
    service_cost;
    service_total_cost;
    calculated_quantity = 1;
    @track showHide = true;


    // adding new variables here
    @track grand_total_price = '0.00'; // Initialize
    @track grand_total_cost = '0.00';   // Initialize


    lineItemTotals = new Map();


    @wire(CurrentPageReference) getPageRef(pageRef) {
        console.log(pageRef);
        this.rid = pageRef.state.c__rid;
        this.test = pageRef.state.c__ed;

    }
    connectedCallback() {
            // getParameter({ name: "rid" })
            //         .then(ret => {
            //           console.log(ret);
            //           this.recordI = ret;
            //         })
            //         .catch(error => {
            //           console.log(error);
            //         });
            registerListener("estimateChange", this.handleEstimateChange, this);
            registerListener("opportunityChange", this.handleOpportunityChange, this);
            registerListener("estimatorChange", this.handleEstimatorChange, this);
            registerListener("customerChange", this.handleCustomerChange, this);
            registerListener("nameChange", this.handleNameChange, this);
            registerListener("descriptionChange", this.handleDescriptionChange, this);
            registerListener("typeChange", this.handleTypeChange, this);
            registerListener("dimensionTypeChange", this.handleDimensionTypeChange, this);
            registerListener("shapeChange", this.handleShapeChange, this);
            registerListener("radiusChange", this.handleRadiusChange, this);
            registerListener("lengthChange", this.handleLengthChange, this);
            registerListener("widthChange", this.handleWidthChange, this);
            registerListener("heightChange", this.handleHeightChange, this);
            registerListener("areaChange", this.handleAreaChange, this);
            registerListener("volumnChange", this.handleVolumnChange, this);
            registerListener("productChange", this.handleProductChange, this);
            registerListener("serviceChange", this.handleServiceChange, this);
            registerListener("showHideDimension", this.handleShowHideData, this);

            // new Listener
            registerListener('updateGrandTotal', this.handleGrandTotalUpdate, this);

            registerListener(
                "dimensionValidation",
                this.handledimensionValidation,
                this
            );
            registerListener(
                "productRetailPriceChange",
                this.handleProductRetailPriceChange,
                this
            );
            registerListener("productCostChange", this.handleProductCostChange, this);
            registerListener(
                "productQuantityChange",
                this.handleProductQuantityChange,
                this
            );
            registerListener(
                "productDiscountChange",
                this.handleProductDiscountChange,
                this
            );
            registerListener("productTaxChange", this.handlepPoductTaxChange, this);
            registerListener(
                "productOtherFixCostChange",
                this.handleproductOtherFixCostChange,
                this
            );
            registerListener(
                "serviceRetailPriceChange",
                this.handleServiceRetailPriceChange,
                this
            );
            registerListener("serviceCostChange", this.handleServiceCostChange, this);
            registerListener(
                "serviceQuantityChange",
                this.handleServiceQuantityChange,
                this
            );
            registerListener(
                "serviceDiscountChange",
                this.handleServiceDiscountChange,
                this
            );
            registerListener("serviceTaxChange", this.handleServiceTaxChange, this);
            registerListener(
                "serviceOtherFixCostChange",
                this.handleServiceOtherFixCostChange,
                this
            );
            registerListener(
                "calculatedQuantityChange",
                this.handleCalculatedQuantityChange,
                this
            );
            // registerListener("estimateSaveDone", this.navigateSave, this);
        }
        // registerListener("showHideDimension", this.showHideComp, this);
        // registerListener("showHideDimension", this.nulldata, this);
        // showHidedata(showHide) {
        //   this.showHide = showHide;
        // }
    disconnectedCallback() {
            unregisterAllListeners(this);
        }
        // handledimensionValidation(value) {
        //   this.unit = value;
        // }
    handleCalculatedQuantityChange(value) {
        this.calculated_quantity = value;
        this.calculate();
    }
    handleEstimateChange(obj) {
        console.log("I am in estimate id footer.");
        console.log("estimate_id: " + obj.estimateId);
        this.estimate_id = obj.estimateId;
        if (obj.from === "Saved") this.navigateSave();
    }
    handleOpportunityChange(obj) {
        console.log("I am in estimate id footer.");
        console.log("Opportunity_id: " + obj.opportunityId);
        this.Opportunity_id = obj.opportunityId;
        if (obj.from === "Saved") this.navigateSave();
    }
    handleEstimatorChange(obj) {
        console.log("I am in estimate id footer.");
        console.log("Estimator_id: " + obj.estimatorId);
        this.Estimator_id = obj.estimatorId;
        if (obj.from === "Saved") this.navigateSave();
    }
    handleCustomerChange(obj) {
        console.log("I am in estimate id footer.");
        console.log("Customer_id: " + obj.customerId);
        this.Customer_id = obj.customerId;
        if (obj.from === "Saved") this.navigateSave();
    }
    handleNameChange(value) {
        console.log("I am in name footer.");
        console.log("Name: " + value);
        this.name = value;
    }
    handleDescriptionChange(value) {
        console.log("I am in description footer.");
        console.log("Description: " + value);
        this.description = value;
    }
    handleTypeChange(value) {
        console.log("I am in type footer.");
        console.log("Type: " + value);
        this.type = value;
    }
    handleDimensionTypeChange(value) {
        console.log("I am in dimension type footer.");
        console.log("Type: " + value);
        this.dimension_type = value;
        if (this.dimension_type === "Length") {
            this.dimension_typeLength = true;
        }
    }
    handleShowHideData(value) {
        console.log("I am in dimension type footer.");
        console.log("Type: " + value);
        this.unit = value;
    }
    handleShapeChange(value) {
        console.log("I am in shape footer.");
        console.log("Type: " + value);
        this.shape = value;
    }
    handleRadiusChange(value) {
        console.log("I am in radius footer.");
        console.log("Type: " + value);
        this.radius = value;
    }
    handleLengthChange(value) {
        console.log("I am in length footer.");
        console.log("Type: " + value);
        this.length = value;
    }
    handleWidthChange(value) {
        console.log("I am in width footer.");
        console.log("Type: " + value);
        this.width = value;
    }
    handleHeightChange(value) {
        console.log("I am in height footer.");
        console.log("Type: " + value);
        this.height = value;
    }
    handleAreaChange(value) {
        console.log("I am in area footer.");
        console.log("Type: " + value);
        this.area = value;
    }
    handleVolumnChange(value) {
        console.log("I am in volumn footer.");
        console.log("Type: " + value);
        this.volumn = value;
    }
    handleProductChange(obj) {
        console.log("I am in product footer.");
        console.log(obj);
        this.product_id = obj.id;
        this.product_name = obj.name;
        this.product_retail_price = obj.price;
        this.product_cost = obj.cost;
        this.product_uom = obj.uom;
        this.calculate();
    }
    handleServiceChange(obj) {
        console.log("I am in service footer.");
        console.log(obj);
        this.service_id = obj.id;
        this.service_name = obj.name;
        this.service_retail_price = obj.price;
        this.service_cost = obj.cost;
        this.service_uom = obj.uom;
        this.calculate();
    }
    handleProductRetailPriceChange(rp) {
        console.log("I am in rp footer.");
        console.log(rp);
        this.product_retail_price = rp;
        this.calculate();
    }
    handleProductCostChange(cost) {
        console.log("I am in prp footer.");
        console.log(cost);
        this.product_cost = cost;
        this.calculate();
    }
    handleProductQuantityChange(qty) {
        console.log("I am in pqty footer.");
        console.log(qty);
        this.product_quantity = qty;
        this.calculate();
    }
    handleProductDiscountChange(discount) {
        console.log("I am in pdiscount footer.");
        console.log(discount);
        this.product_discount_percent = discount;
        this.calculate();
    }
    handlepPoductTaxChange(tax) {
        console.log("I am in ptax footer.");
        console.log(tax);
        this.product_tax_percent = tax;
        this.calculate();
    }
    handleproductOtherFixCostChange(fixCost) {
        console.log("I am in pofc footer.");
        console.log(fixCost);
        this.product_fix_cost = fixCost;
        this.calculate();
    }
    handleServiceRetailPriceChange(rp) {
        console.log("I am in prp footer.");
        console.log(rp);
        this.service_retail_price = rp;
        this.calculate();
    }
    handleServiceCostChange(cost) {
        console.log("I am in prp footer.");
        console.log(cost);
        this.service_cost = cost;
        this.calculate();
    }
    handleServiceQuantityChange(qty) {
        console.log("I am in pqty footer.");
        console.log(qty);
        this.service_quantity = qty;
        this.calculate();
    }
    handleServiceDiscountChange(discount) {
        console.log("I am in pdiscount footer.");
        console.log(discount);
        this.service_discount_percent = discount;
        this.calculate();
    }
    handleServiceTaxChange(tax) {
        console.log("I am in ptax footer.");
        console.log(tax);
        this.service_tax_percent = tax;
        this.calculate();
    }
    handleServiceOtherFixCostChange(fixCost) {
        console.log("I am in pofc footer.");
        console.log(fixCost);
        this.service_fix_cost = fixCost;
        this.calculate();
    }

    // *** NEW METHOD: Handle incoming totals ***
    handleGrandTotalUpdate(detail) {
        // Store the incoming converted PKR totals in the map using the line item's unique ID
        this.lineItemTotals.set(detail.id, {
            price: detail.total_price || 0,
            cost: detail.total_cost || 0
        });

        // Recalculate the Grand Totals immediately
        this.calculateGrandTotals();
    }

    // *** NEW METHOD: Grand Total Calculation (Aggregates PKR values) ***
    calculateGrandTotals() {
        let totalSumPrice = 0;
        let totalSumCost = 0;

        // Map mein store saare converted totals ko sum karein
        for (let item of this.lineItemTotals.values()) {
            totalSumPrice += item.price;
            totalSumCost += item.cost;
        }

        // Update tracked properties (jo ab hamesha PKR mein hain)
        this.grand_total_price = totalSumPrice.toFixed(2);
        this.grand_total_cost = totalSumCost.toFixed(2);
    }
    
    // *** DISPLAY GETTERS: Currency symbol display ke liye ***
    get grandTotalPriceDisplay() {
        console.log("Grand total price is", this.grand_total_price)
        return `Rs ${this.grand_total_price}`;
    }

    get grandTotalCostDisplay() {
        console.log("Grand total cost is", this.grand_total_cost)
        return `Rs ${this.grand_total_cost}`;
    }
    calculate() {
        if (this.product_retail_price && this.product_quantity) {
            this.product_total =
                this.product_retail_price *
                this.product_quantity *
                this.calculated_quantity;
        } else {
            this.product_total = "";
        }
        if (
            // this.product_discount_percent &&
            this.product_total
        ) {
            this.product_discount =
                (this.product_total * this.product_discount_percent) / 100;
            this.product_sub_total = this.product_total - this.product_discount;
        } else {
            // this.product_discount_amount = "";
            this.product_sub_total = "";
        }
        if (
            // this.product_tax_percent &&
            this.product_sub_total
        ) {
            this.product_tax =
                (this.product_sub_total * this.product_tax_percent) / 100;
            this.product_total_price = this.product_sub_total + this.product_tax;
        } else {
            this.product_total_price = "";
        }
        if (this.product_cost && this.product_quantity) {
            this.product_total_cost =
                this.product_cost * this.product_quantity * this.calculated_quantity;
        } else {
            this.product_total_cost = "";
        }
        if (this.product_fix_cost)
            this.product_total_price += 1 * this.product_fix_cost;

        if (this.service_retail_price && this.service_quantity) {
            this.service_total =
                this.service_retail_price *
                this.service_quantity *
                this.calculated_quantity;
        } else {
            this.service_total = "";
        }
        if (
            // this.service_discount_percent &&
            this.service_total
        ) {
            this.service_discount =
                (this.service_total * this.service_discount_percent) / 100;
            this.service_sub_total = this.service_total - this.service_discount;
        } else {
            this.service_discount_amount = "";
            this.service_sub_total = "";
        }
        if (
            // this.service_tax_percent &&
            this.service_sub_total
        ) {
            this.service_tax =
                (this.service_sub_total * this.service_tax_percent) / 100;
            this.service_total_price = this.service_sub_total + this.service_tax;
        } else {
            this.service_total_price = "";
        }
        if (this.service_cost && this.service_quantity) {
            this.service_total_cost =
                this.service_cost * this.service_quantity * this.calculated_quantity;
        } else {
            this.service_total_cost = "";
        }
        if (this.service_fix_cost)
            this.service_total_price += 1 * this.service_fix_cost;
        // if (this.product_total_price && this.service_total_price) {
        this.grand_total_price = this.product_total_price + this.service_total_price;
        this.grand_total_price = parseFloat(this.grand_total_price).toFixed(2);
        // }
        // if (this.product_total_cost && this.service_total_cost) {
        this.grand_total_cost = this.product_total_cost + this.service_total_cost;
        this.grand_total_cost = parseFloat(this.grand_total_cost).toFixed(2);
        // }
    }
    validateFieldsWithOutDimension() {
        // if (!this.Customer_id) {

        //     const event = new ShowToastEvent({
        //         title: 'Alert!',
        //         message: '"Customer" field is empty.',
        //         mode: 'dismissable',
        //         variant: 'error',
        //         duration: '10000 ms'
        //     });
        //     this.dispatchEvent(event);

        //     return false
        // }
        // if (!this.Opportunity_id) {

        //   const event = new ShowToastEvent({
        //     title: 'Alert!',
        //     message: '"Opportunity" field is empty.',
        //     mode: 'dismissable',
        //     variant: 'error',
        //     duration: '10000 ms'
        //   });
        //   this.dispatchEvent(event);

        //   return false
        // }
        // if (!this.Estimator_id) {

        //   const event = new ShowToastEvent({
        //     title: 'Alert!',
        //     message: '"Estimator" field is empty.',
        //     mode: 'dismissable',
        //     variant: 'error',
        //     duration: '10000 ms'
        //   });
        //   this.dispatchEvent(event);

        //   return false
        // }
        if (!this.name) {
            const event = new ShowToastEvent({
                title: "Alert!",
                message: '"Name" field is empty.',
                mode: "dismissable",
                variant: "error",
                duration: "10000 ms"
            });
            this.dispatchEvent(event);
            return false;
        } else if (this.type === "Material & Labor") {
            if (!this.product_id && !this.product_name) {
                const event = new ShowToastEvent({
                    title: "Alert!",
                    message: '"Product" field is empty.',
                    mode: "dismissable",
                    variant: "error",
                    duration: "10000 ms"
                });
                this.dispatchEvent(event);
                return false;
            } else if (!this.product_quantity) {
                const event = new ShowToastEvent({
                    title: "Alert!",
                    message: '"No. of Items" field is empty.',
                    mode: "dismissable",
                    variant: "error",
                    duration: "10000 ms"
                });
                this.dispatchEvent(event);
                return false;
            } else if (!this.service_id) {
                if (!this.service_name) {
                    const event = new ShowToastEvent({
                        title: "Alert!",
                        message: '"Service" field is empty.',
                        mode: "dismissable",
                        variant: "error",
                        duration: "10000 ms"
                    });
                    this.dispatchEvent(event);
                    return false;
                }
            } else if (!this.service_quantity) {
                const event = new ShowToastEvent({
                    title: "Alert!",
                    message: '"Service No. of Items" field is empty.',
                    mode: "dismissable",
                    variant: "error",
                    duration: "10000 ms"
                });
                this.dispatchEvent(event);
                return false;
            }
        } else if (this.type === "Material") {
            if (!this.product_id && !this.product_name) {
                const event = new ShowToastEvent({
                    title: "Alert!",
                    message: '"Product" field is empty.',
                    mode: "dismissable",
                    variant: "error",
                    duration: "10000 ms"
                });
                this.dispatchEvent(event);
                return false;
            } else if (!this.product_quantity) {
                const event = new ShowToastEvent({
                    title: "Alert!",
                    message: '"Product No. of Items" field is empty.',
                    mode: "dismissable",
                    variant: "error",
                    duration: "10000 ms"
                });
                this.dispatchEvent(event);
                return false;
            }
        } else if (this.type === "Labor") {
            if (!this.service_id) {
                if (!this.service_name) {
                    const event = new ShowToastEvent({
                        title: "Alert!",
                        message: '"Service" field is empty.',
                        mode: "dismissable",
                        variant: "error",
                        duration: "10000 ms"
                    });
                    this.dispatchEvent(event);
                    return false;
                }
            } else if (!this.service_quantity) {
                const event = new ShowToastEvent({
                    title: "Alert!",
                    message: '"Service No. of Items" field is empty.',
                    mode: "dismissable",
                    variant: "error",
                    duration: "10000 ms"
                });
                this.dispatchEvent(event);
                return false;
            }
        } else {
            if (!this.type) {
                const event = new ShowToastEvent({
                    title: "Alert!",
                    message: '"Line Item Type" is empty.',
                    mode: "dismissable",
                    variant: "error",
                    duration: "10000 ms"
                });
                this.dispatchEvent(event);
                return false;
            }
        }
        return true;
    }

    validateFieldsWithDimension() {
        if (!this.name) {
            const event = new ShowToastEvent({
                title: "Alert!",
                message: '"Name" field is empty.',
                mode: "dismissable",
                variant: "error",
                duration: "10000 ms"
            });
            this.dispatchEvent(event);

            return false;
        }
        // else if (!this.description) {

        //   const event = new ShowToastEvent({
        //     title: 'Alert!',
        //     message: '"Description" field is empty.',
        //     mode: 'dismissable',
        //     variant: 'error',
        //     duration: '10000 ms'
        //   });
        //   this.dispatchEvent(event);

        //   return false
        // }
        else if (this.type === "Material & Labor") {
            if (this.dimension_type === "Length") {
                if (!this.length) {
                    const event = new ShowToastEvent({
                        title: "Alert!",
                        message: '"Length" field is empty.',
                        mode: "dismissable",
                        variant: "error",
                        duration: "10000 ms"
                    });
                    this.dispatchEvent(event);

                    return false;
                } else if (!this.product_id && !this.product_name) {
                    const event = new ShowToastEvent({
                        title: "Alert!",
                        message: '"Product" field is empty.',
                        mode: "dismissable",
                        variant: "error",
                        duration: "10000 ms"
                    });
                    this.dispatchEvent(event);

                    return false;
                } else if (!this.product_quantity) {
                    const event = new ShowToastEvent({
                        title: "Alert!",
                        message: '"Product No. of Items" field is empty.',
                        mode: "dismissable",
                        variant: "error",
                        duration: "10000 ms"
                    });
                    this.dispatchEvent(event);

                    return false;
                } else if (!this.service_id) {
                    if (!this.service_name) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Service" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    }
                } else if (!this.service_quantity) {
                    const event = new ShowToastEvent({
                        title: "Alert!",
                        message: '"Service No. of Items" field is empty.',
                        mode: "dismissable",
                        variant: "error",
                        duration: "10000 ms"
                    });
                    this.dispatchEvent(event);

                    return false;
                }
            } else if (this.dimension_type === "Area") {
                if (this.shape === "Circle") {
                    if (!this.radius) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Radius" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    } else if (!this.area) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Area" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    } else if (!this.product_id && !this.product_name) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Product" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    } else if (!this.product_quantity) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Product No. of Items" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    } else if (!this.service_id) {
                        if (!this.service_name) {
                            const event = new ShowToastEvent({
                                title: "Alert!",
                                message: '"Service" field is empty.',
                                mode: "dismissable",
                                variant: "error",
                                duration: "10000 ms"
                            });
                            this.dispatchEvent(event);

                            return false;
                        }
                    } else if (!this.service_quantity) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Service No. of Items" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    }
                } else if (this.shape === "Rectangle") {
                    if (!this.length) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Length" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    } else if (!this.width) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Width" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    } else if (!this.area) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Area" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    } else if (!this.product_id && !this.product_name) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Product" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    } else if (!this.product_quantity) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Product No. of Items" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    } else if (!this.service_id) {
                        if (!this.service_name) {
                            const event = new ShowToastEvent({
                                title: "Alert!",
                                message: '"Service" field is empty.',
                                mode: "dismissable",
                                variant: "error",
                                duration: "10000 ms"
                            });
                            this.dispatchEvent(event);

                            return false;
                        }
                    } else if (!this.service_quantity) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Service No. of Items" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    }
                } else if (this.shape === "Other") {
                    if (!this.radius) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Radius" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    } else if (!this.length) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Length" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    } else if (!this.width) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Width" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    } else if (!this.height) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Height" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    } else if (!this.area) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Area" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    } else if (!this.product_id && !this.product_name) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Product" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    } else if (!this.product_quantity) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Product No. of Items" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    } else if (!this.service_id) {
                        if (!this.service_name) {
                            const event = new ShowToastEvent({
                                title: "Alert!",
                                message: '"Service" field is empty.',
                                mode: "dismissable",
                                variant: "error",
                                duration: "10000 ms"
                            });
                            this.dispatchEvent(event);

                            return false;
                        }
                    } else if (!this.service_quantity) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Service No. of Items" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    }
                } else {
                    if (!this.shape) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"shape" is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);
                        return false;
                    }
                }
            } else if (this.dimension_type === "Volume") {
                // if(this.shape==='Circle'){}
                // else if(this.shape==='Rectangle'){}
                // else if(this.shape==='Other'){}

                // if (!this.radius) {

                //   const event = new ShowToastEvent({
                //     title: 'Alert!',
                //     message: '"Radius" field is empty.',
                //     mode: 'dismissable',
                //     variant: 'error',
                //     duration: '10000 ms'
                //   });
                //   this.dispatchEvent(event);

                //   return false
                // }

                if (!this.length) {
                    const event = new ShowToastEvent({
                        title: "Alert!",
                        message: '"Length" field is empty.',
                        mode: "dismissable",
                        variant: "error",
                        duration: "10000 ms"
                    });
                    this.dispatchEvent(event);

                    return false;
                } else if (!this.width) {
                    const event = new ShowToastEvent({
                        title: "Alert!",
                        message: '"Width" field is empty.',
                        mode: "dismissable",
                        variant: "error",
                        duration: "10000 ms"
                    });
                    this.dispatchEvent(event);

                    return false;
                } else if (!this.height) {
                    const event = new ShowToastEvent({
                        title: "Alert!",
                        message: '"Height" field is empty.',
                        mode: "dismissable",
                        variant: "error",
                        duration: "10000 ms"
                    });
                    this.dispatchEvent(event);

                    return false;
                } else if (!this.product_id && !this.product_name) {
                    const event = new ShowToastEvent({
                        title: "Alert!",
                        message: '"Product" field is empty.',
                        mode: "dismissable",
                        variant: "error",
                        duration: "10000 ms"
                    });
                    this.dispatchEvent(event);

                    return false;
                } else if (!this.product_quantity) {
                    const event = new ShowToastEvent({
                        title: "Alert!",
                        message: '"Product No. of Items" field is empty.',
                        mode: "dismissable",
                        variant: "error",
                        duration: "10000 ms"
                    });
                    this.dispatchEvent(event);

                    return false;
                } else if (!this.service_id) {
                    if (!this.service_name) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Service" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);
                        return false;
                    }
                } else if (!this.service_quantity) {
                    const event = new ShowToastEvent({
                        title: "Alert!",
                        message: '"Service No. of Items" field is empty.',
                        mode: "dismissable",
                        variant: "error",
                        duration: "10000 ms"
                    });
                    this.dispatchEvent(event);
                    return false;
                }
            } else {
                if (!this.dimension_type) {
                    const event = new ShowToastEvent({
                        title: "Alert!",
                        message: '"Dimension Type" is empty.',
                        mode: "dismissable",
                        variant: "error",
                        duration: "10000 ms"
                    });
                    this.dispatchEvent(event);
                    return false;
                }
            }
        } else if (this.type === "Material") {
            if (this.dimension_type === "Length") {
                if (!this.length) {
                    const event = new ShowToastEvent({
                        title: "Alert!",
                        message: '"Length" field is empty.',
                        mode: "dismissable",
                        variant: "error",
                        duration: "10000 ms"
                    });
                    this.dispatchEvent(event);

                    return false;
                } else if (!this.product_id && !this.product_name) {
                    const event = new ShowToastEvent({
                        title: "Alert!",
                        message: '"Product" field is empty.',
                        mode: "dismissable",
                        variant: "error",
                        duration: "10000 ms"
                    });
                    this.dispatchEvent(event);

                    return false;
                } else if (!this.product_quantity) {
                    const event = new ShowToastEvent({
                        title: "Alert!",
                        message: '"Product No. of Items" field is empty.',
                        mode: "dismissable",
                        variant: "error",
                        duration: "10000 ms"
                    });
                    this.dispatchEvent(event);
                    return false;
                }
            } else if (this.dimension_type === "Area") {
                if (this.shape === "Circle") {
                    if (!this.radius) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Radius" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    } else if (!this.area) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Area" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    } else if (!this.product_id && !this.product_name) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Product" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    } else if (!this.product_quantity) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Product No. of Items" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);
                        return false;
                    }
                } else if (this.shape === "Rectangle") {
                    if (!this.length) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Length" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    } else if (!this.width) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Width" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);
                        return false;
                    } else if (!this.area) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Area" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);
                        return false;
                    } else if (!this.product_id && !this.product_name) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Product" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);
                        return false;
                    } else if (!this.product_quantity) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Product No. of Items" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);
                        return false;
                    }
                } else if (this.shape === "Other") {
                    if (!this.radius) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Radius" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    } else if (!this.length) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Length" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);
                        return false;
                    } else if (!this.width) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Width" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    } else if (!this.height) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Height" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);
                        return false;
                    } else if (!this.area) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Area" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    } else if (!this.product_id && !this.product_name) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Product" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);
                        return false;
                    } else if (!this.product_quantity) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Product No. of Items" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);
                        return false;
                    }
                } else {
                    if (!this.shape) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"shape" is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);
                        return false;
                    }
                }
            } else if (this.dimension_type === "Volume") {
                // if(this.shape==='Circle'){}
                // else if(this.shape==='Rectangle'){}
                // else if(this.shape==='Other'){}

                // if (!this.radius) {

                //   const event = new ShowToastEvent({
                //     title: 'Alert!',
                //     message: '"Radius" field is empty.',
                //     mode: 'dismissable',
                //     variant: 'error',
                //     duration: '10000 ms'
                //   });
                //   this.dispatchEvent(event);

                //   return false
                // }
                if (!this.length) {
                    const event = new ShowToastEvent({
                        title: "Alert!",
                        message: '"Length" field is empty.',
                        mode: "dismissable",
                        variant: "error",
                        duration: "10000 ms"
                    });
                    this.dispatchEvent(event);
                    return false;
                } else if (!this.width) {
                    const event = new ShowToastEvent({
                        title: "Alert!",
                        message: '"Width" field is empty.',
                        mode: "dismissable",
                        variant: "error",
                        duration: "10000 ms"
                    });
                    this.dispatchEvent(event);
                    return false;
                } else if (!this.height) {
                    const event = new ShowToastEvent({
                        title: "Alert!",
                        message: '"Height" field is empty.',
                        mode: "dismissable",
                        variant: "error",
                        duration: "10000 ms"
                    });
                    this.dispatchEvent(event);
                    return false;
                } else if (!this.product_id && !this.product_name) {
                    const event = new ShowToastEvent({
                        title: "Alert!",
                        message: '"Product" field is empty.',
                        mode: "dismissable",
                        variant: "error",
                        duration: "10000 ms"
                    });
                    this.dispatchEvent(event);
                    return false;
                } else if (!this.product_quantity) {
                    const event = new ShowToastEvent({
                        title: "Alert!",
                        message: '"Product No. of Items" field is empty.',
                        mode: "dismissable",
                        variant: "error",
                        duration: "10000 ms"
                    });
                    this.dispatchEvent(event);
                    return false;
                }
            } else {
                if (!this.dimension_type) {
                    const event = new ShowToastEvent({
                        title: "Alert!",
                        message: '"Dimension Type" is empty.',
                        mode: "dismissable",
                        variant: "error",
                        duration: "10000 ms"
                    });
                    this.dispatchEvent(event);
                    return false;
                }
            }
        } else if (this.type === "Labor") {
            if (this.dimension_type === "Length") {
                if (!this.length) {
                    const event = new ShowToastEvent({
                        title: "Alert!",
                        message: '"Length" field is empty.',
                        mode: "dismissable",
                        variant: "error",
                        duration: "10000 ms"
                    });
                    this.dispatchEvent(event);

                    return false;
                } else if (!this.service_id) {
                    if (!this.service_name) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Service" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    }
                } else if (!this.service_quantity) {
                    const event = new ShowToastEvent({
                        title: "Alert!",
                        message: '"Service No. of Items" field is empty.',
                        mode: "dismissable",
                        variant: "error",
                        duration: "10000 ms"
                    });
                    this.dispatchEvent(event);

                    return false;
                }
            } else if (this.dimension_type === "Area") {
                if (this.shape === "Circle") {
                    if (!this.radius) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Radius" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    } else if (!this.area) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Area" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    } else if (!this.service_id) {
                        if (!this.service_name) {
                            const event = new ShowToastEvent({
                                title: "Alert!",
                                message: '"Service" field is empty.',
                                mode: "dismissable",
                                variant: "error",
                                duration: "10000 ms"
                            });
                            this.dispatchEvent(event);

                            return false;
                        }
                    } else if (!this.service_quantity) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Service No. of Items" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    }
                } else if (this.shape === "Rectangle") {
                    if (!this.length) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Length" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    } else if (!this.width) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Width" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    } else if (!this.area) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Area" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    } else if (!this.service_id) {
                        if (!this.service_name) {
                            const event = new ShowToastEvent({
                                title: "Alert!",
                                message: '"Service" field is empty.',
                                mode: "dismissable",
                                variant: "error",
                                duration: "10000 ms"
                            });
                            this.dispatchEvent(event);

                            return false;
                        }
                    } else if (!this.service_quantity) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Service No. of Items" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    }
                } else if (this.shape === "Other") {
                    if (!this.radius) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Radius" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    } else if (!this.length) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Length" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    } else if (!this.width) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Width" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    } else if (!this.height) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Height" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    } else if (!this.area) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Area" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    } else if (!this.service_id) {
                        if (!this.service_name) {
                            const event = new ShowToastEvent({
                                title: "Alert!",
                                message: '"Service" field is empty.',
                                mode: "dismissable",
                                variant: "error",
                                duration: "10000 ms"
                            });
                            this.dispatchEvent(event);

                            return false;
                        }
                    } else if (!this.service_quantity) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Service No. of Items" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    }
                } else {
                    if (!this.shape) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"shape" is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    }
                }
            } else if (this.dimension_type === "Volume") {
                // if(this.shape==='Circle'){}
                // else if(this.shape==='Rectangle'){}
                // else if(this.shape==='Other'){}

                // if (!this.radius) {

                //   const event = new ShowToastEvent({
                //     title: 'Alert!',
                //     message: '"Radius" field is empty.',
                //     mode: 'dismissable',
                //     variant: 'error',
                //     duration: '10000 ms'
                //   });
                //   this.dispatchEvent(event);

                //   return false
                // }

                if (!this.length) {
                    const event = new ShowToastEvent({
                        title: "Alert!",
                        message: '"Length" field is empty.',
                        mode: "dismissable",
                        variant: "error",
                        duration: "10000 ms"
                    });
                    this.dispatchEvent(event);

                    return false;
                } else if (!this.width) {
                    const event = new ShowToastEvent({
                        title: "Alert!",
                        message: '"Width" field is empty.',
                        mode: "dismissable",
                        variant: "error",
                        duration: "10000 ms"
                    });
                    this.dispatchEvent(event);

                    return false;
                } else if (!this.height) {
                    const event = new ShowToastEvent({
                        title: "Alert!",
                        message: '"Height" field is empty.',
                        mode: "dismissable",
                        variant: "error",
                        duration: "10000 ms"
                    });
                    this.dispatchEvent(event);

                    return false;
                } else if (!this.service_id) {
                    if (!this.service_name) {
                        const event = new ShowToastEvent({
                            title: "Alert!",
                            message: '"Service" field is empty.',
                            mode: "dismissable",
                            variant: "error",
                            duration: "10000 ms"
                        });
                        this.dispatchEvent(event);

                        return false;
                    }
                } else if (!this.service_quantity) {
                    const event = new ShowToastEvent({
                        title: "Alert!",
                        message: '"Service No. of Items" field is empty.',
                        mode: "dismissable",
                        variant: "error",
                        duration: "10000 ms"
                    });
                    this.dispatchEvent(event);
                    return false;
                }
            } else {
                if (!this.dimension_type) {
                    const event = new ShowToastEvent({
                        title: "Alert!",
                        message: '"Dimension Type" is empty.',
                        mode: "dismissable",
                        variant: "error",
                        duration: "10000 ms"
                    });
                    this.dispatchEvent(event);

                    return false;
                }
            }
        } else {
            if (!this.type) {
                const event = new ShowToastEvent({
                    title: "Alert!",
                    message: '"Line Item Type" is empty.',
                    mode: "dismissable",
                    variant: "error",
                    duration: "10000 ms"
                });
                this.dispatchEvent(event);
                return false;
            }
        }
        return true;
    }
    navigateNext() {
        if (!this.estimate_id) {
            this[NavigationMixin.Navigate]({
                type: "standard__navItemPage",
                attributes: {
                    apiName: "Start_Estimate"
                }
            });
        } else if (this.rid) {
            let recordId = this.rid;
            this[NavigationMixin.Navigate]({
                type: "standard__navItemPage",
                attributes: {
                    apiName: "line_item_detail",
                    recordId: recordId
                },
                state: {
                    c__rid: recordId
                }
            });
        } else if (this.estimate_id && this.test) {
            // let recordId = this.estimate_id;
            // this[NavigationMixin.Navigate]({
            //   type: "standard__navItemPage",
            //   attributes: {
            //     apiName: "Estimate_Detail",
            //     recordId: recordId
            //   },
            //   state: { c__eid: this.estimate_id }

            // });
            this.eid = this.estimate_id;
            setParameter({ name: "eid", value: this.eid })
                .then(ret => {
                    console.log(ret);
                    this[NavigationMixin.Navigate]({
                        type: "standard__navItemPage",
                        attributes: {
                            apiName: "Estimate_Detail",
                            recordId: this.estimate_id
                        },
                        state: { c__eid: this.eid }
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        } else if (this.estimate_id && !this.test) {
            let recordId = this.estimate_id;
            this[NavigationMixin.Navigate]({
                type: "standard__recordPage",
                attributes: {
                    objectApiName: "Estimate__c",
                    actionName: "view",
                    recordId: recordId
                }
            });
        }
    }
    isDimension__c = false;
    navigateSave() {
        // let eid = this.id;
        // if(typeof this.id === 'undefined' || this.id === null || this.id === ''){
        //     eid = "000";
        // }

        // if (!this.Customer_id) {

        //   const event = new ShowToastEvent({
        //     title: 'Alert!',
        //     message: '"Customer" field is empty.',
        //     mode: 'dismissable',
        //     variant: 'error',
        //     duration: '10000 ms'
        //   });
        //   this.dispatchEvent(event);

        //   return false
        // }
        // if (!this.Opportunity_id) {

        //   const event = new ShowToastEvent({
        //     title: 'Alert!',
        //     message: '"Opportunity" field is empty.',
        //     mode: 'dismissable',
        //     variant: 'error',
        //     duration: '10000 ms'
        //   });
        //   this.dispatchEvent(event);

        //   return false
        // }
        // if (!this.Estimator_id) {

        //   const event = new ShowToastEvent({
        //     title: 'Alert!',
        //     message: '"Estimator" field is empty.',
        //     mode: 'dismissable',
        //     variant: 'error',
        //     duration: '10000 ms'
        //   });
        //   this.dispatchEvent(event);

        //   return false
        // }
        if (!this.estimate_id) {
            fireEvent(this.pageRef, "firstSaveEstimate", "Save");
            return;
        }
        if (!this.unit) {
            this.length = 1;
            this.isDimension__c = 'no';
            // this.showHidedata();
            if (!this.validateFieldsWithOutDimension()) return;
        } else {
            this.isDimension__c = 'yes';
            if (!this.validateFieldsWithDimension()) return;
        }
        saveLineItem({
                obj: JSON.stringify({
                    // id: this.id,

                    name: this.name,
                    isDimension: this.isDimension__c,
                    estimate: this.estimate_id,
                    description: this.description,
                    type: this.type,
                    dimension_type: this.dimension_type,
                    shape: this.shape,
                    radius: this.radius,
                    length: this.length,
                    width: this.width,
                    height: this.height,
                    area: this.area,
                    volume: this.volumn,
                    product_id: this.product_id,
                    product_uom: this.product_uom,
                    product_quantity: this.product_quantity,
                    product_retail_price: this.product_retail_price,
                    product_total: this.product_total,
                    product_discount_percent: this.product_discount_percent,
                    product_discount: this.product_discount,
                    product_sub_total: this.product_sub_total,
                    product_tax_percent: this.product_tax_percent,
                    product_tax: this.product_tax,
                    product_fix_cost: this.product_fix_cost,
                    product_total_price: this.product_total_price,
                    product_cost: this.product_cost,
                    product_total_cost: this.product_total_cost,
                    service_id: this.service_id,
                    service_uom: this.service_uom,
                    service_retail_price: this.service_retail_price,
                    service_quantity: this.service_quantity,
                    service_discount_percent: this.service_discount_percent,
                    service_discount: this.service_discount,
                    service_sub_total: this.service_sub_total,
                    service_tax_percent: this.service_tax_percent,
                    service_tax: this.service_tax,
                    service_fix_cost: this.service_fix_cost,
                    service_total_price: this.service_total_price,
                    service_total: this.service_total,
                    service_cost: this.service_cost,
                    service_total_cost: this.service_total_cost
                })
            })
            .then(data => {
                console.log(data);
                this.id = data;
                setParameter({ name: "liid", value: this.id })
                    .then(ret => {
                        console.log(ret);
                        this[NavigationMixin.Navigate]({
                            type: "standard__navItemPage",
                            attributes: {
                                apiName: "Line_Item_detail",
                                recordId: this.id
                            },
                            state: { c__rid: this.id }
                        });
                    })
                    .catch(error => {
                        console.log(error);
                    });
                // this[NavigationMixin.Navigate]({
                //   type: "comm__namedPage",
                //   attributes: {
                //     pageName: 'Line_Item_detail_page',
                //     actionName: 'view',
                //     recordId: this.id
                //   },
                //   state: {c__rid: this.id}
                // });
            })
            .catch(error => {
                console.log(error);
            });
    }
}
