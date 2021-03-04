const NodeHelper = require("node_helper");
const PicnicClient = require("picnic-api");
const { CountryCodes, ImageSizes, HttpMethods } = PicnicClient;

module.exports = NodeHelper.create({
    start: function () {
        this.picnicClient = new PicnicClient({
            countryCode: CountryCodes.DE, // The country code for the requests.
            apiVersion: "17"
        });
        this.loggedIn = false;
    },

    socketNotificationReceived: function (notification, payload) {
        console.log("Picnic socket notification received: "+notification);
        if (notification === "INIT_PICNIC") {
            this.config = payload;
            var self = this;
            if (!this.loggedIn) {
                console.log("Logging in at picnic...");
                this.picnicClient.login(this.config.email, this.config.password).then(answer => {
                    if (!answer) {
                        console.log("Picnic Login Successful!")
                        self.loggedIn = true
                    } else {
                        console.error(answer);
                    }
                    /*self.picnicClient.search("Radler").then(searchResults => {
                        self.log(searchResults);
                    });*/
                    /*self.picnicClient.getUserDetails().then(details => {
                        self.log(details);
                    });
                    self.picnicClient.getCategories().then(cat => {
                        self.log(cat);
                    })
                    .catch(error => {
                        self.processError('getCategories');
                    });*/
                    self.getShoppingCart();

                    self.getDeliveries();

                    //console.log(self.picnicClient.getKnownApiRoutes());
                })
                .catch(error => {
                     self.processError('login', error);
                });
            } else {
                console.log("Already logged in at Picnic...");
                this.getShoppingCart();
                this.getDeliveries();
            }
        } else if (notification === "GET_CART") {
            this.config = payload;
            if (this.loggedIn) {
                this.getShoppingCart();
            }
        } else if (notification === "GET_DELIVERIES") {
            this.config = payload;
            if (this.loggedIn) {
                this.getDeliveries()
            }
        } else if (notification === "GET_CURRENT_DELIVERY") {
            if (this.loggedIn) {
                var self = this;
                /*this.picnicClient.getDelivery(payload)
                .then(curDel => {
                    self.log(curDel);
                    self.sendSocketNotification("CURRENT_DELIVERY", curDel);
                })
                .catch(error => {
                    self.processError('getDelivery', error);
                });*/ 
                this.picnicClient.getDeliveryPosition(payload)
                .then(delPos => {
                    self.log(delPos);
                    //self.sendSocketNotification("PICNIC_CART", cart);
                })
                .catch(error => {
                    self.processError('getDeliveryPosition', error);
                });
            }
        }
    },

    
    getShoppingCart: function() {
        var self = this;
        self.picnicClient.getShoppingCart().then(cart => {
            //self.log(JSON.stringify(cart));
            self.sendSocketNotification("PICNIC_CART", cart);
        })
        .catch(error => {
            self.processError('getShoppingCart', error);
        });
    },
    
    getDeliveries: function() {
        var self = this;
        this.picnicClient.getDeliveries()
        .then(deliveries => {
            //self.log(deliveries);
            self.sendSocketNotification("PICNIC_DELIVERIES", deliveries);
        })
        .catch(error => {
            self.processError('getDeliveries', error);
        });
    },
    
    processError: function(func, error) {
        console.error(`Error in ${func} function:`);
        if (error.response) {
            console.error(error.response.status + ": " + error.response.statusText);
            console.error(error.response.data.error.message);
        }
        this.sendSocketNotification("ERROR", {func: func, error: error});
    },
    
    log: function (msg) {
        if (this.config && this.config.debug) {
            console.log(this.name + ": ", (msg));
        }
    },
});
