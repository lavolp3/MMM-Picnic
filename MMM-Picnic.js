Module.register("MMM-Picnic", {

    defaults: {
        email: "dirk.kovert@gmail.com",
        password: "pcNC2483",
        updateInterval: 5,
        maxSlots: 8,
        maxDeliveries: 5,
        size: "small",
        preferredTime: [0, 0]
    },
    
    shoppingCart: {},
    deliveries: [],

    getStyles: function () {
        return [this.file('MMM-Picnic.css')];
    },

    start: function () {
        this.loaded = false;
        console.log("Sending Picnic config: " + this.config);
        this.sendSocketNotification("INIT_PICNIC", this.config);
        var self = this;
        setInterval(function() {
            self.log("Requesting picnic data...");
            self.sendSocketNotification("GET_CART", self.config);
            self.sendSocketNotification("GET_DELIVERIES", self.config);
        }, this.config.updateInterval * 60 * 1000)
    },
    
    
    getTranslations: function() {
        return {
            en: 'translations/en.json',
            de: 'translations/de.json',
            nl: 'translations/nl.json'
        };
    },

    getTemplate: function() {
        return 'MMM-Picnic.njk';
    },


    getTemplateData: function() {
        return {
            loading: !this.loaded,
            config: this.config,
            shoppingCart: this.shoppingCart || {},
            deliverySlots: this.getDeliverySlots(),
            currentDelivery: this.getCurrentDelivery(),
            recentDeliveries: this.getRecentDeliveries()   
        }
    },

    
    getDeliverySlots: function() {
        var delSlots = [];
        if (this.shoppingCart.delivery_slots) {
            var slots = this.shoppingCart.delivery_slots;
            var maxSlots = Math.min(this.config.maxSlots, slots.length);
            for (i = 0; i < maxSlots; i++) {
                var slotClass = "";
                if (moment(slots[i].window_start).hour() >= this.config.preferredTime[0] && moment(slots[i].window_start).hour() <= this.config.preferredTime[1]) {
                    slotClass = "bold "
                }
                slotClass += (slots[i].selected) ? "selected" : (!slots[i].is_available) ? "unavailable dimmed" : "available",
                delSlots.push({
                    slotClass: slotClass,
                    date: moment(slots[i].window_start).format("dd DD/MM"),
                    timeRange: moment(slots[i].window_start).format("LT") + "-" + moment(slots[i].window_end).format("LT")
                })
            }
        }
        return delSlots;
    },
    
    
    getCurrentDelivery: function() {
        var totalItems = 0;
        var totalPrice = 0;
        if (this.deliveries && this.deliveries.length && this.deliveries[0].status === "CURRENT") {
            if (moment(this.deliveries[0].eta2.end).format("X") > moment().format("X")) {
                var curDel = this.deliveries[0];
                for (let c = 0; c < curDel.orders.length; c++) {
                    totalItems += curDel.orders[c].items.length;
                    totalPrice += curDel.orders[c].checkout_total_price;
                };
                return {
                    totalItems: totalItems,
                    totalPrice: (totalPrice/100).toFixed(2) + "€",
                    date: (moment(curDel.eta2.start).dayOfYear() === moment().dayOfYear) ? "Heute" : (moment(curDel.eta2.start).dayOfYear() === moment().add(1, 'days').dayOfYear) ? "Morgen" : moment(curDel.eta2.start).format("dd DD.MM."),
                    eta: moment(curDel.eta2.start).format("LT") + " - " + moment(curDel.eta2.end).format("LT")
                }
            } else {
                return ""
            }
        }
    },
    
    getRecentDeliveries: function() {
        this.log(this.deliveries);
        var recDel = [];        
        if (this.deliveries.length) {
            var maxDel = Math.min(this.config.maxDeliveries, this.deliveries.length);
            for (let d = 0; d < maxDel; d++) {
                var del = this.deliveries[d];

                var totalItems = 0; 
                var totalPrice = 0;
                for (let o = 0; o < del.orders.length; o++) {
                    totalItems += del.orders[o].items.length;
                    totalPrice += del.orders[o].total_price;
                };

                var returned = 0;
                for (let r = 0; r < del.returned_containers.length; r++) {
                    returned += del.returned_containers[r].price
                }

                recDel.push({
                    date: moment(del.eta2.start).format("dd DD.MM."),
                    totalItems: totalItems,
                    totalPrice: (totalPrice/100).toFixed(2) + "€",
                    returned: -(returned/100).toFixed(2) + "€"
                });
            }            
        }
        this.log("Recent Deliveries: "+JSON.stringify(recDel))
        return recDel;
    },

    socketNotificationReceived: function (notification, payload) {
        console.log("Socket Notification received: " + notification);
        if (notification === "PICNIC_CART") {
            this.log(payload);
            this.loaded = true;
            this.shoppingCart = payload;
            this.shoppingCart.total_price = (this.shoppingCart.total_price/100).toFixed(2) + "€";
        } else if (notification === "PICNIC_DELIVERIES") {
            this.log(payload);
            this.deliveries = payload;
            if (this.deliveries[0].status === "CURRENT") {
                this.sendSocketNotification("GET_CURRENT_DELIVERY", this.deliveries[0].id)
            }
        }
        this.updateDom(1000);
    },
    
    log: function (msg) {
        if (this.config && this.config.debug) {
            console.log(this.name + ": ", (msg));
        }
    },
});
