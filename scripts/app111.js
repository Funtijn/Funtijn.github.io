
    let API = null;

    window.onload = async function () {
        API = await Workspace.connect(window.parent, (event, data) => {
            //console.log("Event: ", event, data);
            var eventName = event.split(".").pop();

            switch (eventName) {
                case "onPicked":
                    OnPicked(data.data);
                    break;
            }

        });
    }
    const simpleProducts = [
        'HD Video Player',
        'SuperHD Video Player',
        'SuperPlasma 50',
        'SuperLED 50',
        'SuperLED 42',
        'SuperLCD 55',
        'SuperLCD 42',
        'SuperPlasma 65',
        'SuperLCD 70',
        'Projector Plus',
        'Projector PlusHT',
        'ExcelRemote IR',
        'ExcelRemote Bluetooth',
        'ExcelRemote IP',
    ];

    const products = [{
        ID: 1,
        Name: 'HD Video Player',
        Price: 330,
        Current_Inventory: 225,
        Backorder: 0,
        Manufacturing: 10,
        Category: 'Video Players',
        ImageSrc: 'images/products/1.png',
    }, {
        ID: 2,
        Name: 'SuperHD Video Player',
        Price: 400,
        Current_Inventory: 150,
        Backorder: 0,
        Manufacturing: 25,
        Category: 'Video Players',
        ImageSrc: 'images/products/2.png',
    }, {
        ID: 3,
        Name: 'SuperPlasma 50',
        Price: 2400,
        Current_Inventory: 0,
        Backorder: 0,
        Manufacturing: 0,
        Category: 'Televisions',
        ImageSrc: 'images/products/3.png',
    }, {
        ID: 4,
        Name: 'SuperLED 50',
        Price: 1600,
        Current_Inventory: 77,
        Backorder: 0,
        Manufacturing: 55,
        Category: 'Televisions',
        ImageSrc: 'images/products/4.png',
    }, {
        ID: 5,
        Name: 'SuperLED 42',
        Price: 1450,
        Current_Inventory: 445,
        Backorder: 0,
        Manufacturing: 0,
        Category: 'Televisions',
        ImageSrc: 'images/products/5.png',
    }, {
        ID: 6,
        Name: 'SuperLCD 55',
        Price: 1350,
        Current_Inventory: 345,
        Backorder: 0,
        Manufacturing: 5,
        Category: 'Televisions',
        ImageSrc: 'images/products/6.png',
    }, {
        ID: 7,
        Name: 'SuperLCD 42',
        Price: 1200,
        Current_Inventory: 210,
        Backorder: 0,
        Manufacturing: 20,
        Category: 'Televisions',
        ImageSrc: 'images/products/7.png',
    }, {
        ID: 8,
        Name: 'SuperPlasma 65',
        Price: 3500,
        Current_Inventory: 0,
        Backorder: 0,
        Manufacturing: 0,
        Category: 'Televisions',
        ImageSrc: 'images/products/8.png',
    }, {
        ID: 9,
        Name: 'SuperLCD 70',
        Price: 4000,
        Current_Inventory: 95,
        Backorder: 0,
        Manufacturing: 5,
        Category: 'Televisions',
        ImageSrc: 'images/products/9.png',
    }, {
        ID: 10,
        Name: 'DesktopLED 21',
        Price: 175,
        Current_Inventory: null,
        Backorder: 425,
        Manufacturing: 75,
        Category: 'Monitors',
        ImageSrc: 'images/products/10.png',
    }, {
        ID: 12,
        Name: 'DesktopLCD 21',
        Price: 170,
        Current_Inventory: 210,
        Backorder: 0,
        Manufacturing: 60,
        Category: 'Monitors',
        ImageSrc: 'images/products/12.png',
    }, {
        ID: 13,
        Name: 'DesktopLCD 19',
        Price: 160,
        Current_Inventory: 150,
        Backorder: 0,
        Manufacturing: 210,
        Category: 'Monitors',
        ImageSrc: 'images/products/13.png',
    }, {
        ID: 14,
        Name: 'Projector Plus',
        Price: 550,
        Current_Inventory: null,
        Backorder: 55,
        Manufacturing: 10,
        Category: 'Projectors',
        ImageSrc: 'images/products/14.png',
    }, {
        ID: 15,
        Name: 'Projector PlusHD',
        Price: 750,
        Current_Inventory: 110,
        Backorder: 0,
        Manufacturing: 90,
        Category: 'Projectors',
        ImageSrc: 'images/products/15.png',
    }, {
        ID: 16,
        Name: 'Projector PlusHT',
        Price: 1050,
        Current_Inventory: 0,
        Backorder: 75,
        Manufacturing: 57,
        Category: 'Projectors',
        ImageSrc: 'images/products/16.png',
    }, {
        ID: 17,
        Name: 'ExcelRemote IR',
        Price: 150,
        Current_Inventory: 650,
        Backorder: 0,
        Manufacturing: 190,
        Category: 'Automation',
        ImageSrc: 'images/products/17.png',
    }, {
        ID: 18,
        Name: 'ExcelRemote Bluetooth',
        Price: 180,
        Current_Inventory: 310,
        Backorder: 0,
        Manufacturing: 0,
        Category: 'Automation',
        ImageSrc: 'images/products/18.png',
    }, {
        ID: 19,
        Name: 'ExcelRemote IP',
        Price: 200,
        Current_Inventory: 0,
        Backorder: 325,
        Manufacturing: 225,
        Category: 'Automation',
        ImageSrc: 'images/products/19.png',
    }];

    $('#productsSimple').dxTagBox({
        items: simpleProducts,
    });

    $('#productsSearch').dxTagBox({
        items: simpleProducts,
        searchEnabled: true,
    });

    $('#productsSelection').dxTagBox({
        items: simpleProducts,
        showSelectionControls: true,
        applyValueMode: 'useButtons',
    });

    $('#productsHide').dxTagBox({
        items: simpleProducts,
        hideSelectedItems: true,
    });

    $('#productsLine').dxTagBox({
        items: simpleProducts,
        multiline: false,
    });

    $('#productsEdit').dxTagBox({
        items: simpleProducts,
        acceptCustomValue: true,
        onCustomItemCreating(args) {
            const newValue = args.text;
            const { component } = args;
            const currentItems = component.option('items');
            currentItems.unshift(newValue);
            component.option('items', currentItems);
            args.customItem = newValue;
        },
    });

    $('#productsPlaceholder').dxTagBox({
        items: simpleProducts,
        placeholder: 'Choose Product...',
    });

    $('#productsDisabled').dxTagBox({
        items: simpleProducts,
        value: [simpleProducts[0]],
        disabled: true,
    });

    $('#productsDataSource').dxTagBox({
        dataSource: new DevExpress.data.ArrayStore({
            data: products,
            key: 'ID',
        }),
        displayExpr: 'Name',
        valueExpr: 'ID',
    });

    $('#productsCustom').dxTagBox({
        dataSource: products,
        displayExpr: 'Name',
        valueExpr: 'ID',
        itemTemplate(data) {
            return `<div class='custom-item'><img src='${data.ImageSrc}' /><div class='product-name'>${data.Name}</div></div>`;
        },
    });

    const prefixes = [
        'K',
        'BV',
        'BD',
        'BS',
    ];

    $('#prefixSelection').dxTagBox({
        items: prefixes,
        showSelectionControls: true,
        applyValueMode: 'useButtons',
    });

    $(function () {
        $("#button").dxButton({
            stylingMode: "outlined",
            text: "Click me!",
            type: "success",
            onClick: function () {
                DevExpress.ui.notify("The button was clicked");
            },
        });
    });

    $(function () {
        $("#button2").dxButton({
            stylingMode: "outlined",
            text: "Click me 2!",
            type: "success",
            onClick: function () {
                $.ajax({
                    url: 'https://reqbin.com/echo/get/json',
                    dataType: 'json',
                    async: false,
                    success: function (data) {
                        var text = data.success;
                        DevExpress.ui.notify(text);
                    }
                });
            },
        });
    });

    var time = "TheTime";
    function getTime() {
        $.ajax({
            url: "https://reqbin.com/echo/get/json",
            dataType: 'json',
            async: false,
            success: function (data) {
                time = data.success;
            }
        });
        $(timeText).html(time);
    }

    function SetText(text)
    {
        var txtInfo = document.getElementById('txtInfo');
        txtInfo.value = text;
    }

    function SetText2(text) {
        $(testTextSet).html(text);
    }

    function SetErrorText(text) {
        $(errorText).html(text);
    }

    async function setObjectsByProp() {
        SetText("setObjectsByProp");
	    return doObjectsFilter(async () => API.viewer.setSelection(getPropSelector(), "set"));
    }

    async function setObjectsByProp2() {
        SetText("setObjectsByProp2");
        await API.viewer.setSelection(getPropSelector(), "set");
    }

    function setText() {
        $(testTextSet).html("Testing");
    }

    async function doObjectsFilter(action) {
        SetText("doObjectsFilter");
      return doWorkRes("#objectsResult", "#objectsLoading", action);
    }

    async function doWorkRes(selResult, selLoading, action) {
        SetText("doWorkRes");
        return doWorkSafe(() => { //preaction
            SetText("emptying selResult");
            $(selResult).html(""); //inhoud van selResult leegmaken
            SetText("showing selLoading");
            $(selLoading).show(); //selLoading zichtbaar maken
        }, action, r => { //action , postaction
            SetText("hiding selLoading");
            $(selLoading).hide();
            SetText("hiding selLoading");
            $(selResult).html(r);
        });
    }

    async function doWorkSafe(preAction, action, postAction) {
        SetText("doWorkSafe started");
        preAction();
        SetText("doWorkSafe preaction completed");
      let result;
      try {
	    const actionRes = await action();
	    if (actionRes === false) {
	      throw new Error("Operation failed: Unknown error");
	    } else if (actionRes === true || actionRes === "" || actionRes == null) {
	      result = ok();
	    } else {
	      result = actionRes;
	    }
      }
      catch (e) {
          result = err(e);
          SetText("Error caught");
      }
        postAction(result);
        SetText("doWorkSafe finished");
    }

    async function getObjectsByProp(e) {
      return getObjectsBy(async () => API.viewer.getObjects(getPropSelector()), e);
    }

    function getPropSelector() {
        return {
            parameter: {
                properties: {
                    [$("#propNameFilter").val()]: $("#propValueFilter").val()
                }
            }
        };
    }

    async function getUsedAssemblyPrefixes() {
        try {
            let jsonArray = "[";
            SetText2(jsonArray);
            const propSelector = getPropSelector();
            await API.viewer.setSelection(propSelector, "set");
            const mobjectsArr = await API.viewer.getObjects(propSelector);
            SetText(mobjectsArr.length);
            //mobjectsArr type: ModelObjects[]
            //haalt enkel gemeenschappelijk hebben property sets op
            for (const mobjects of mobjectsArr) {
                //mobjects type: ModelObjects met mobjects.objects type: ObjectProperties[]
                const objectsIds = mobjects.objects.map(o => o.id);
                //const objectsRuntimeIds = await API.viewer.convertToObjectRuntimeIds(mobjects.modelId, objectsIds);
                const objPropertiesArr = await API.viewer.getObjectProperties(mobjects.modelId, objectsIds);
                for (const objproperties of objPropertiesArr) {
                    //objproperties type: ObjectProperties
                    let cogX = 0.0;
                    let cogY = 0.0;
                    let cogZ = 0.0;
                    let assemblyPos = "";
                    let propertiesFound = 0;
                    for (const propertyset of objproperties.properties) {
                        for (const property of propertyset.properties) {
                            const propertyName = property.name;
                            const propertyValue = property.value;
                            if (typeof propertyName !== "undefined" && typeof propertyValue !== "undefined") {
                                if (propertyName === "COG_X") {
                                    cogX = propertyValue;
                                    propertiesFound++;
                                }
                                else if (propertyName === "COG_Y") {
                                    cogY = propertyValue;
                                    propertiesFound++;
                                }
                                else if (propertyName === "COG_Z") {
                                    cogZ = propertyValue;
                                    propertiesFound++;
                                }
                                else if (propertyName === "MERKNUMMER") {
                                    assemblyPos = propertyValue;
                                    propertiesFound++;
                                }
                            }
                        }
                    }
                    if (propertiesFound != 4) {
                        continue;
                    }
                    jsonArray = jsonArray.concat("{");
                    //jsonArray = jsonArray.concat("\"id\": ");
                    //jsonArray = jsonArray.concat(objproperties.id);
                    //jsonArray = jsonArray.concat(",");
                    jsonArray = jsonArray.concat("\"color\": {\"r\": 60,\"g\": 203,\"b\": 62,\"a\": 255}, ");
                    jsonArray = jsonArray.concat("\"start\": ");
                    jsonArray = jsonArray.concat("{");
                    jsonArray = jsonArray.concat("\"positionX\": ");
                    jsonArray = jsonArray.concat(cogX);
                    jsonArray = jsonArray.concat(",");
                    jsonArray = jsonArray.concat("\"positionY\": ");
                    jsonArray = jsonArray.concat(cogY);
                    jsonArray = jsonArray.concat(",");
                    jsonArray = jsonArray.concat("\"positionZ\": ");
                    jsonArray = jsonArray.concat(cogZ);
                    jsonArray = jsonArray.concat(",");
                    jsonArray = jsonArray.concat("\"modelId\": ");
                    jsonArray = jsonArray.concat("\"");
                    jsonArray = jsonArray.concat(mobjects.modelId);
                    jsonArray = jsonArray.concat("\"");
                    jsonArray = jsonArray.concat(",");
                    jsonArray = jsonArray.concat("\"objectId\": ");
                    jsonArray = jsonArray.concat(objproperties.id);
                    jsonArray = jsonArray.concat("}");
                    jsonArray = jsonArray.concat(",");
                    jsonArray = jsonArray.concat("\"end\": ");
                    jsonArray = jsonArray.concat("{");
                    jsonArray = jsonArray.concat("\"positionX\": ");
                    jsonArray = jsonArray.concat(cogX);
                    jsonArray = jsonArray.concat(",");
                    jsonArray = jsonArray.concat("\"positionY\": ");
                    jsonArray = jsonArray.concat(cogY);
                    jsonArray = jsonArray.concat(",");
                    jsonArray = jsonArray.concat("\"positionZ\": ");
                    jsonArray = jsonArray.concat(cogZ);
                    jsonArray = jsonArray.concat(",");
                    jsonArray = jsonArray.concat("\"objectId\": null");
                    jsonArray = jsonArray.concat("}");
                    jsonArray = jsonArray.concat(",");
                    jsonArray = jsonArray.concat("\"text\": ");
                    jsonArray = jsonArray.concat("\"");
                    jsonArray = jsonArray.concat(assemblyPos);
                    jsonArray = jsonArray.concat("\"");
                    jsonArray = jsonArray.concat("}");
                    jsonArray = jsonArray.concat(",");
                }
            }
            SetText2("Finished going through array");
            jsonArray = jsonArray = jsonArray.slice(0, -1);
            jsonArray = jsonArray.concat("]");
            API.markup.removeMarkups();
            SetText2(jsonArray);
            API.markup.addTextMarkup(JSON.parse(jsonArray));
        }
        catch (e) {
            SetErrorText("Error");
            SetErrorText(e.message);
            SetText2(jsonArray);
        }
    }

    async function addTextMarkups() {
        try {
            SetText2("Start adding markups");
            let jsonArray = "[";
            SetText2(jsonArray);
            const propSelector = getPropSelector();
            await API.viewer.setSelection(propSelector, "set");
            const mobjectsArr = await API.viewer.getObjects(propSelector);
            SetText(mobjectsArr.length);
            //mobjectsArr type: ModelObjects[]
            //haalt enkel gemeenschappelijk hebben property sets op
            for (const mobjects of mobjectsArr) {
                //mobjects type: ModelObjects met mobjects.objects type: ObjectProperties[]
                const objectsIds = mobjects.objects.map(o => o.id);
                //const objectsRuntimeIds = await API.viewer.convertToObjectRuntimeIds(mobjects.modelId, objectsIds);
                const objPropertiesArr = await API.viewer.getObjectProperties(mobjects.modelId, objectsIds);
                for (const objproperties of objPropertiesArr) {
                    //objproperties type: ObjectProperties
                    let cogX = 0.0;
                    let cogY = 0.0;
                    let cogZ = 0.0;
                    let assemblyPos = "";
                    let propertiesFound = 0;
                    for (const propertyset of objproperties.properties) {
                        for (const property of propertyset.properties) {
                            const propertyName = property.name;
                            const propertyValue = property.value;
                            if (typeof propertyName !== "undefined" && typeof propertyValue !== "undefined") {
                                if (propertyName === "COG_X") {
                                    cogX = propertyValue;
                                    propertiesFound++;
                                }
                                else if (propertyName === "COG_Y") {
                                    cogY = propertyValue;
                                    propertiesFound++;
                                }
                                else if (propertyName === "COG_Z") {
                                    cogZ = propertyValue;
                                    propertiesFound++;
                                }
                                else if (propertyName === "MERKNUMMER") {
                                    assemblyPos = propertyValue;
                                    propertiesFound++;
                                }
                            }
                        }
                    }
                    if (propertiesFound != 4) {
                        continue;
                    }
                    jsonArray = jsonArray.concat("{");
                    //jsonArray = jsonArray.concat("\"id\": ");
                    //jsonArray = jsonArray.concat(objproperties.id);
                    //jsonArray = jsonArray.concat(",");
                    jsonArray = jsonArray.concat("\"color\": {\"r\": 60,\"g\": 203,\"b\": 62,\"a\": 255}, ");
                    jsonArray = jsonArray.concat("\"start\": ");
                    jsonArray = jsonArray.concat("{");
                    jsonArray = jsonArray.concat("\"positionX\": ");
                    jsonArray = jsonArray.concat(cogX);
                    jsonArray = jsonArray.concat(",");
                    jsonArray = jsonArray.concat("\"positionY\": ");
                    jsonArray = jsonArray.concat(cogY);
                    jsonArray = jsonArray.concat(",");
                    jsonArray = jsonArray.concat("\"positionZ\": ");
                    jsonArray = jsonArray.concat(cogZ);
                    jsonArray = jsonArray.concat(",");
                    jsonArray = jsonArray.concat("\"modelId\": ");
                    jsonArray = jsonArray.concat("\"");
                    jsonArray = jsonArray.concat(mobjects.modelId);
                    jsonArray = jsonArray.concat("\"");
                    jsonArray = jsonArray.concat(",");
                    jsonArray = jsonArray.concat("\"objectId\": ");
                    jsonArray = jsonArray.concat(objproperties.id);
                    jsonArray = jsonArray.concat("}");
                    jsonArray = jsonArray.concat(",");
                    jsonArray = jsonArray.concat("\"end\": ");
                    jsonArray = jsonArray.concat("{");
                    jsonArray = jsonArray.concat("\"positionX\": ");
                    jsonArray = jsonArray.concat(cogX);
                    jsonArray = jsonArray.concat(",");
                    jsonArray = jsonArray.concat("\"positionY\": ");
                    jsonArray = jsonArray.concat(cogY);
                    jsonArray = jsonArray.concat(",");
                    jsonArray = jsonArray.concat("\"positionZ\": ");
                    jsonArray = jsonArray.concat(cogZ);
                    jsonArray = jsonArray.concat(",");
                    jsonArray = jsonArray.concat("\"objectId\": null");
                    jsonArray = jsonArray.concat("}");
                    jsonArray = jsonArray.concat(",");
                    jsonArray = jsonArray.concat("\"text\": ");
                    jsonArray = jsonArray.concat("\"");
                    jsonArray = jsonArray.concat(assemblyPos);
                    jsonArray = jsonArray.concat("\"");
                    jsonArray = jsonArray.concat("}");
                    jsonArray = jsonArray.concat(",");
                }
            }
            SetText2("Finished going through array");
            jsonArray = jsonArray = jsonArray.slice(0, -1);
            jsonArray = jsonArray.concat("]");
            API.markup.removeMarkups();
            SetText2(jsonArray);
            API.markup.addTextMarkup(JSON.parse(jsonArray));
        }
        catch (e) {
            SetErrorText("Error");
            SetErrorText(e.message);
            SetText2(jsonArray);
        }
    }
