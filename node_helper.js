const picnic = require("picnic-api");

module.exports = NodeHelper.create({
    start: function () {
        const picnicClient = new PicnicClient({
            countryCode: CountryCodes.DE, // The country code for the requests.
        });
        this.loggedIn = false;
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "INIT" && !this.loggedIn) {
            console.log("Logging in at picnic...");
            picnicClient.login(config.email, config.password).then(answer => {
                console.log(answer);
                if (!answer) console.log("Succesful!");
                picnicClient.search("Radler").then(searchResults => {
                    console.log(searchResults);
                });
            });
        } else if (notification === "PURCHASED_ITEM") {
            if (payload.purchase) {
                this.client.recently(payload.name, payload.listId).then(() => {
                    this.sendSocketNotification("RELOAD_LIST");
                });
            } else {
                this.client.purchase(payload.name, payload.listId).then(() => {
                    this.sendSocketNotification("RELOAD_LIST");
                });
            }

            return true;
        }
    },

    getList: function (payload) {
        if (this.client.mustLogin()) {
            this.initClient(payload);
        } else {
            this.client.getList(true, payload.listName).then(list => {
                this.list = list;
                this.sendSocketNotification("LIST_DATA", list);
            });
        }
    },

    initClient: function (payload) {
        this.client = new BringClient(payload, this.path);
        // Wait for Login
        setTimeout(() => {
            this.client.getLists().then(lists => {
                this.getList(payload);
            });
        }, 1500);
    }
});
