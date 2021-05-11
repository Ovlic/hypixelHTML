//<script src="testjson.js"></script>
function myfunction(input, name, baz_buy, npc_buy, baz_sell, npc_sell, save_buy, save_sell, npcBuyPrice, npcSellPrice){

    var apiUrl = 'https://api.hypixel.net/skyblock/bazaar';
    //const data = jsonio()
    fetch(apiUrl).then(response => response.json()).then(data => {
        var bazaaritems = Object.getOwnPropertyNames(data.products)
        console.log("Fetching "+input+" data")
        const thedata = formatitem(input, bazaaritems, data) //Format
        const item = thedata.productId
        const buySummary = thedata.buySummary
        const sellSummary = thedata.sellSummary

        const buyvalue = Number(Number(thedata.buyPrice - npcBuyPrice).toFixed(1))
        const sellvalue = Number(Number(thedata.sellPrice - npcSellPrice).toFixed(1))
        var buystring;
        var sellstring;
        if(npcBuyPrice === 0) {
            save_buy.innerHTML = "The price is " + thedata.buyPrice + " coin at the bazaar."
        } else{
            if(Math.sign(buyvalue) === -1){
                buystring = "You save "+Math.abs(buyvalue).toString()+" coins at the bazaar!"
                save_buy.innerHTML = buystring
            } else{
                buystring = "You save "+buyvalue.toString()+" coins at an NPC!"
                save_buy.innerHTML = buystring
            }
        }
        if(Math.sign(sellvalue) === 1){
            sellstring = "You get "+sellvalue.toString()+" more coins at the bazaar!"
            save_sell.innerHTML = sellstring
        } else{
            sellstring = "You get "+Math.abs(sellvalue).toString()+" more coins at an NPC!"
            save_sell.innerHTML = sellstring
        }

        name.innerHTML = thedata.item
        baz_buy.innerHTML = "Buy Price: " + thedata.buyPrice
        if(npcBuyPrice === 0){
            npc_buy.innerHTML = "Not buyable from a NPC!"
        } else{
        npc_buy.innerHTML = "NPC Buy Price: " + npcBuyPrice
        }
        baz_sell.innerHTML = "Sell Price: " + thedata.sellPrice
        npc_sell.innerHTML = "NPC Sell Price: " + npcSellPrice

    })
}


//Formatting item
function formatitem (input, bazaaritems, bazaar){
    var buyes = 0
    var sales = 0
    const itemcheck = bazaaritems.indexOf(input)
    const item = bazaaritems[itemcheck]
    const iteminfo = bazaar.products[item].quick_status
    const itemname = formatnames(bazaar.products[item].product_id)
    const sellprice = iteminfo.sellPrice.toFixed(1)
    const buyprice = iteminfo.buyPrice.toFixed(1)

    for(i = 0; i < bazaar.products[item].buy_summary.length ; i++){
        const currentitem = bazaar.products[item].buy_summary
        buyes = buyes + Number(Number(currentitem[i].pricePerUnit) * Number(currentitem[i].amount) * Number(currentitem[i].orders))
    }
    for(i = 0; i < bazaar.products[item].sell_summary.length ; i++){
        const currentitem = bazaar.products[item].sell_summary
        sales = sales + Number(Number(currentitem[i].pricePerUnit) * Number(currentitem[i].amount) * Number(currentitem[i].orders))
    }
    buyes = buyes.toFixed(1) //Total number of orders to buy
    sales = sales.toFixed(1) //Total number of orders to sell

    return{
        "item": itemname,
        "productId": input,
        "buyPrice": Number(buyprice),
        "buySummary": buyes,
        "sellPrice": Number(sellprice),
        "sellSummary": sales
    }
}


//Format names of items
function formatnames (input){
    var convertedArray = [];
    var itemname;
    var char = input.toLowerCase().split("")
    char[0] = char[0].toUpperCase()

    //If input characters contains "_" (which formats to a space)
    if(char.includes("_")){
        for(i = 0; i < char.length; i++){
            if(char[i] === "_"){
                char[i] = " "
                char[i+1] = char[i+1].toUpperCase()
            }
        }
    }

    //If input contains "Item" (Which is used in metadata product id's)
    char = char.join("")
    char = char.split(" ")
    if(char.includes("Item")){
        for(i = 0; i < char.length; i++){
            if(char[i] === "Item"){
                char[i] = ""
                char = char[i-1]
                break;
            }
        }
    }

    if(typeof char === "object"){
        for(var i = 0; i < char.length; ++i){
            convertedArray.push(char[i]);
        }
        itemname = convertedArray.join(' ');
    } else{
        itemname = char
    }
    return itemname;
}

function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
}