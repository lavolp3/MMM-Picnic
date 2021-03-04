# MMM-Picnic


This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/) that allows you to view your [Picnic](https://www.picnic.app/) status, including
- Current basket
- Available delivery slots
- Current delivery (incl ETA)
- Recent deliveries 

## Screenshot

![example](./picnic_example.png?raw=true)

## Installation

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
    position: "top_left",
    config: {
       email: "USER@EXAMPLE.COM",
       password: "SECRET",
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
Following (additional) configurations are possible.

| Option               | Description
|--------------------- |-----------
| `email`              | *Required* Email-address.
| `password`           | *Required* password.
| `updateInterval`     | How often the module should reload.<br>**Type:** `number` in minutes<br> **Default value:** `5`
| `maxSlots`           | Number of delivery slots to show <br>**Type:** `integer` <br> **Default value:** `8`
| `maxDeliveries`      | Number of maximum recent deliveries to show. <br>**Type:** `integer` <br> **Default value:** `5` 
| `size`               | Sizes to be used for the module. Use MagicMirror sizing notations here. <br>**Type:** `string` <br> **Default value:** `small`
| `preferredTime`      | Window of preferred time in which a delivery slot will be highlighted. Put in an array with numbers between 0 and 23, e.g. [18,20] if you prefer deliveries between 6 pm and 8 pm. <br>**Type:** `array` <br> **Default value:** `[0,0]`

