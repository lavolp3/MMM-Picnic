# MMM-Picnic

![Alt text](/img/readme/example.png "A preview of the MMM-Bring module.")

A module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

## Features

## Installing

### Step 1 - Install the module
```javascript
cd ~/MagicMirror/modules
git clone https://github.com/lavolp3/MMM-Picnic.git
cd MMM-Picnic
npm install
```

### Step 2 - Add module to `~MagicMirror/config/config.js`
Add this configuration into `config.js` file's
```javascript
{
    module: "MMM-Picnic",
    position: "bottom_bar",
    config: {
       email: "USER@EXAMPLE.COM",
       password: "SECRET",
       updateInterval: 15, // in Minutes
       listName: "Zuhause", // optional
       showListName: true,
       activeItemColor: "#EE524F",
       latestItemColor: "#4FABA2",
       showLatestItems: false,
       maxItems: 0,
       maxLatestItems: 0,
       locale: "de-DE"
    }
}
```
## Updating
Go to the module’s folder inside MagicMirror modules folder and pull the latest version from GitHub and install:
```
git pull
npm install
```
## Configuring
Here is the configurable part of the module

| Option               | Description
|--------------------- |-----------
| `email`              | *Required* Email-address.
| `password`           | *Required* password.
| `updateInterval`     | How often the module should load the list.<br>**Type:** `number` in minutes<br> **Default value:** `15`
| `listName`           | The name of the list to be displayed. <br>**Type:** `string` <br> **Default value:** your default list
| `showListName`       | Flag for displaying list name. <br>**Type:** `boolean` <br> **Default value:** `true`
| `activeItemColor`    | Color for active items. <br>**Type:** `string` <br> **Default value:** `#EE524F`
| `latestItemColor`    | Color for recent items. <br>**Type:** `string` <br> **Default value:** `#4FABA2`
| `showLatestItems`    | Flag for displaying recently bought items. <br>**Type:** `boolean` <br> **Default value:** `false`
| `maxItems`           | Maximum items to display. <br>**Type:** `number` <br> **Default value:** `0` (all)
| `maxLatestItems`     | Maximum recent items to display. <br>**Type:** `number` <br> **Default value:** `0` (all)
| `locale`             | The locale. <br>**Type:** `string` <br> **Default value:** `de-DE`

