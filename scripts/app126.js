
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

const prefixes = [
    'BD',
    'BF',
    'BH',
    'BP',
    'BS',
    'BV',
    'DEURKADER',
    'DG',
    'DORPEL',
    'DORPELBA',
    'DRUKLAAG',
    'FCITERNE',
    'FLIFT',
    'FM',
    'FPP',
    'FPV',
    'FSMEER',
    'FZ',
    'GI',
    'GU',
    'Hi',
    'Hm',
    'K',
    'KM',
    'KMZOOL',
    'KOKER',
    'KR',
    'KS',
    'KY',
    'LAADKADE',
    'LC',
    'LU',
    'LV',
    'LY',
    'MP',
    'Pi',
    'PLAAT',
    'Pm',
    'PORTIEK',
    'PP',
    'PS',
    'PV',
    'SK',
    'SL',
    'SPr',
    'SS',
    'TRAP',
    'TRAPBORDES',
    'TREKKER',
    'TRIB',
    'TT',
    'TTT',
    'VENSTERK',
    'VENTILA',
    'W',
    'WANDREGE',
];

const statuses = [
    'Gepland',
    'In productie',
    'Klaar voor transport',
    'Getransporteerd',
];

const filterTypes = [
    'Prefix',
    'Merk',
    'Manueel gebruikersattribuut',
];

var filterTypeSelectBox = $('#filterTypeSelection').dxSelectBox({
    items: filterTypes,
    onValueChanged: function (e) {
        var prefixSelectDiv = document.getElementById("prefixSelectionGrp");
        var assemblyInputDiv = document.getElementById("assemblyInputGrp");
        var manualInputDiv = document.getElementById("manualInputGrp");

        prefixSelectDiv.style.display = "none";
        assemblyInputDiv.style.display = "none";
        manualInputDiv.style.display = "none";

        var selectedItem = e.component.option("selectedItem");
        if (selectedItem === "Prefix") {
            prefixSelectDiv.style.display = "block";
        }
        else if (selectedItem === "Merk") {
            assemblyInputDiv.style.display = "block";
        }
        else if (selectedItem === "Manueel gebruikersattribuut") {
            manualInputDiv.style.display = "block";
        }
    },
});

const assemblyTextBox = $('#placeholder').dxTextBox({
    placeholder: 'Geef een merk op, bvb K10 ...',
});

const propertyNameTextBox = $('#placeholderPropertyName').dxTextBox({
    placeholder: 'Geef een property name op, bvb. Default.MERKENPREFIX',
});

const propertyValueTextBox = $('#placeholderPropertyValue').dxTextBox({
    placeholder: 'Geef een property value op, bvb PS',
});

const prefixSelectionTagBox = $('#prefixSelection').dxTagBox({
    items: prefixes,
    showSelectionControls: true,
    applyValueMode: 'useButtons',
    //onValueChanged: function () {
    //    DevExpress.ui.notify("The button was clicked");
    //},
});

$(function () {
    $("#button").dxButton({
        stylingMode: "outlined",
        text: "Selecteer o.b.v. filter",
        type: "success",
        onClick: function () {
            SetSelectionByFilter();
        },
    });
});

function SetSelectionByFilter()
{
    var selectedItem = filterTypeSelectBox.dxSelectBox("instance").option("selectedItem");
    if (selectedItem === "Prefix") {
        var selected = prefixSelectionTagBox.dxTagBox("instance").option("selectedItems");
        for (let i = 0; i < selected.length; i++) {
            var actionType = i == 0 ? "set" : "add";
            setObjectsByPropnameAndValue("Default.MERKPREFIX", selected[i], actionType);
        }
    }
    else if (selectedItem === "Merk") {
        var text = assemblyTextBox.dxTextBox("instance").option("value");
        setObjectsByPropnameAndValue("Default.MERKNUMMER", text, "set");
    }
    else if (selectedItem === "Manueel gebruikersattribuut") {
        var propertyName = propertyNameTextBox.dxTextBox("instance").option("value");
        var propertyValue = propertyValueTextBox.dxTextBox("instance").option("value");
        setObjectsByPropnameAndValue(propertyName, propertyValue, "set");
    }
}

//$(function () {
//    $("#button2").dxButton({
//        stylingMode: "outlined",
//        text: "Plaats labels van geselecteerde",
//        type: "success",
//        onClick: function () {
//            $.ajax({
//                url: 'https://reqbin.com/echo/get/json',
//                dataType: 'json',
//                async: false,
//                success: function (data) {
//                    var text = data.success;
//                    DevExpress.ui.notify(text);
//                }
//            });
//        },
//    });
//});

$(function () {
    $("#button2").dxButton({
        stylingMode: "outlined",
        text: "Plaats labels van geselecteerde",
        type: "success",
        onClick: function () {
            addTextMarkups();
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

async function setObjectsByPropnameAndValue(propNameFilter, propValueFilter, selectionType) {
    SetText("setObjectsByProp2");
    await API.viewer.setSelection(getPropSelectorByPropnameAndValue(propNameFilter, propValueFilter), selectionType);
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

function getPropSelectorByPropnameAndValue(propNameFilter, propValueFilter) {
    return {
        parameter: {
            properties: {
                [propNameFilter]: propValueFilter
            }
        }
    };
}

async function addTextMarkups() {
        try {
            SetText2("Start adding markups");
            let jsonArray = "[";
            SetText2(jsonArray);
            //const propSelector = getPropSelector();
            //await API.viewer.setSelection(propSelector, "set");
            //const mobjectsArr = await API.viewer.getObjects(propSelector);
            //const mobjectsArr = await API.viewer.getSelection();
            const selection = await API.viewer.getSelection();
            const selector = {
                modelObjectIds: selection
            }
            const mobjectsArr = await API.viewer.getObjects(selector);
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
