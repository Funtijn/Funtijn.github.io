
let API = null;

window.onload = async function () {
    API = await Workspace.connect(window.parent, (event, data) => {
        //console.log("Event: ", event, data);
        //var eventName = event.split(".").pop();

        //switch (eventName) {
        //    case "onPicked":
        //        OnPicked(data.data);
        //        break;
        //}

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

const odooUsernameTextbox = $('#placeholderOdooUsername').dxTextBox({
    placeholder: 'Geef je Odoo gebruikersnaam op, bvb John Smith => jsmith',
});

const odooPasswordTextbox = $('#placeholderOdooPassword').dxTextBox({
    placeholder: 'Geef je Odoo paswoord op',
});

$(function () {
    $("#button3").dxButton({
        stylingMode: "outlined",
        text: "Kleur volgens status",
        type: "success",
        onClick: async function () {
            var debugInfo = "";
            //Get project name
            var regexProjectName = /^[TV]\d+_\w+/;
            var project = await API.project.getProject();
            debugInfo = debugInfo.concat("<br />Project name: " + project.name);
            $(debug).html(debugInfo); 
            if (!regexProjectName.test(project.name))
                return;
            var projectNumber = project.name.split("_")[0];

            debugInfo = debugInfo.concat("<br />Project number: " + projectNumber);
            $(debug).html(debugInfo);

            //Authenticate with MUK API
            var token = "";
            await $.ajax({
                type: "POST",
                url: 'https://192.168.1.183/api/authenticate',
                data: {
                    db: 'uat_20220202',
                    login: 'mhemeryck',
                    password: 'ypSRA63r',
                },
                success: function (data) {
                    token = data.token;

                    debugInfo = debugInfo.concat("<br />Authenticated with token: " + token);
                    $(debug).html(debugInfo); 
                }
            });

            //Get project ID
            var id = -1;
            await $.ajax({
                type: "GET",
                url: "https://192.168.1.183/api/read",
                data: {
                    token: token,
                    model: "project.project",
                    domain: '[["proj_unique_id", "=", "' + projectNumber + '"]]',
                    fields: '["id", "proj_unique_id"]',
                },
                success: function (data) {
                    id = data[0].id;

                    debugInfo = debugInfo.concat("<br />Project id: " + id);
                    $(debug).html(debugInfo); 
                }
            });

            var guidsDemouldedElements = [];
            await $.ajax({
                type: "GET",
                url: "https://192.168.1.183/api/read",
                data: {
                    token: token,
                    model: "trimble.connect.main",
                    domain: '[["project_id.id", "=", "' + id + '"]]',
                    fields: '["id", "name", "date_fab_end"]',
                },
                success: function (data) {
                    var now = Date.now();
                    var regexDate = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
                    //var ids = "";
                    var i = -1;
                    for (const record of data) {
                        i++;
                        var dateStrDemoulded = record.date_fab_end;
                        if (typeof dateStrDemoulded !== 'string')
                            continue;
                        var resultDateDemouled = dateStrDemoulded.match(regexDate);
                        if (resultDateDemouled != null) {
                            var splitDate = resultDateDemouled[0].split("-");
                            var year = splitDate[0];
                            var month = splitDate[1];
                            var day = splitDate[2];
                            var dateDemoulded = new Date(year, month, day);
                            if (dateDemoulded < now) {
                                guidsDemouldedElements.push(record.name);
                            }
                        }
                    }
                    debugInfo = debugInfo.concat("<br />Records iterated: " + i);
                    $(debug).html(debugInfo); 
                }
            });

            for (const i in guidsDemouldedElements) {
                debugInfo = debugInfo.concat("<br />GUID_ENDED_ELE: " + i + " - val: " + guidsDemouldedElements[i]);
                $(debug).html(debugInfo); 
            }

            var allObjects = await API.viewer.getObjects();
            debugInfo = debugInfo.concat("<br />All objects count: " + allObjects.length);
            $(debug).html(debugInfo);
            debugInfo = debugInfo.concat("<br />All objects[0].objects count: " + allObjects[0].objects.length);
            $(debug).html(debugInfo);
            await API.viewer.setObjectState(allObjects, { color: { r: 255, g: 0, b: 0 } });
            debugInfo = debugInfo.concat("<br />Colored allObjects red");
            $(debug).html(debugInfo); 

            //Find specific objects with GUID
            //var demouldedObjectIds = [];
            //try {
            //    var demouldedObjects1 = await API.viewer.getObjects({ parameter: { properties: { ["GUID"]: guidsDemouldedElements } } });
            //    debugInfo = debugInfo.concat("<br />demouldedObjects1 count: " + demouldedObjects1.length);
            //    $(debug).html(debugInfo);
            //    debugInfo = debugInfo.concat("<br />demouldedObjects1[0].objects count: " + demouldedObjects1[0].objects.length);
            //    $(debug).html(debugInfo); 
            //}
            //catch
            //{

            //}
            //try {
            //    var demouldedObjects1b = await API.viewer.getObjects({ parameter: { properties: { ["GUID"]: guidsDemouldedElements } } });
            //    debugInfo = debugInfo.concat("<br />demouldedObjects1b count: " + demouldedObjects1b.length);
            //    $(debug).html(debugInfo);
            //    debugInfo = debugInfo.concat("<br />demouldedObjects1b[0].objects count: " + demouldedObjects1b[0].objects.length);
            //    $(debug).html(debugInfo);
            //}
            //catch
            //{

            //}
            //try {
            //    var demouldedObjects2 = await API.viewer.getObjects({ properties: { "GUID": guidsDemouldedElements } });
            //    debugInfo = debugInfo.concat("<br />demouldedObjects2 count: " + demouldedObjects2.length);
            //    $(debug).html(debugInfo);
            //    debugInfo = debugInfo.concat("<br />demouldedObjects2[0].objects count: " + demouldedObjects2[0].objects.length);
            //    $(debug).html(debugInfo); 
            //}
            //catch
            //{

            //}
            try {
                var demouldedObjects3 = await API.viewer.getObjects({ parameter: { properties: { ["Default.GUID"]: "b56b8bec-a988-4bae-aebf-af3247cdcf57" } } });
                debugInfo = debugInfo.concat("<br />demouldedObjects3 count: " + demouldedObjects3.length);
                $(debug).html(debugInfo);
                debugInfo = debugInfo.concat("<br />demouldedObjects3[0].objects count: " + demouldedObjects3[0].objects.length);
                $(debug).html(debugInfo);
            }
            catch
            {

            }
            try {
                var demouldedObjects4 = await API.viewer.getObjects({ parameter: { properties: { ["Default.GUID"]: guidsDemouldedElements[0] } } });
                debugInfo = debugInfo.concat("<br />demouldedObjects4 count: " + demouldedObjects4.length);
                $(debug).html(debugInfo);
                debugInfo = debugInfo.concat("<br />demouldedObjects4[0].objects count: " + demouldedObjects4[0].objects.length);
                $(debug).html(debugInfo);
            }
            catch
            {

            }
            try {
                var demouldedObjects5 = await API.viewer.getObjects({ parameter: { properties: { ["Default.GUID"]: guidsDemouldedElements } } });
                debugInfo = debugInfo.concat("<br />demouldedObjects5 count: " + demouldedObjects5.length);
                $(debug).html(debugInfo);
                debugInfo = debugInfo.concat("<br />demouldedObjects5[0].objects count: " + demouldedObjects5[0].objects.length);
                $(debug).html(debugInfo);
            }
            catch
            {

            }
            //try {
            //    var demouldedObjects3 = await API.viewer.getObjects({ parameter: { properties: { ["Default.GUID"]: guidsDemouldedElements } } });
            //    debugInfo = debugInfo.concat("<br />demouldedObjects3 count: " + demouldedObjects3.length);
            //    $(debug).html(debugInfo);
            //    debugInfo = debugInfo.concat("<br />demouldedObjects3[0].objects count: " + demouldedObjects3[0].objects.length);
            //    $(debug).html(debugInfo);
            //}
            //catch
            //{

            //}
            //try {
            //    var demouldedObjects4 = await API.viewer.getObjects({ properties: { "Default.GUID": guidsDemouldedElements } });
            //    debugInfo = debugInfo.concat("<br />demouldedObjects4 count: " + demouldedObjects4.length);
            //    $(debug).html(debugInfo);
            //    debugInfo = debugInfo.concat("<br />demouldedObjects4[0].objects count: " + demouldedObjects4[0].objects.length);
            //    $(debug).html(debugInfo);
            //}
            //catch
            //{

            //}
            //try {
            //    var demouldedObjects5 = await API.viewer.getObjects({ properties: { "Default.GUID": "b56b8bec-a988-4bae-aebf-af3247cdcf57" } });
            //    debugInfo = debugInfo.concat("<br />demouldedObjects5 count: " + demouldedObjects5.length);
            //    $(debug).html(debugInfo);
            //    debugInfo = debugInfo.concat("<br />demouldedObjects5[0].objects count: " + demouldedObjects5[0].objects.length);
            //    $(debug).html(debugInfo);
            //}
            //catch
            //{

            //}

            //Filter objects out of all objects
            try {
                const selection = await API.viewer.getSelection();
                const selector = {
                    modelObjectIds: selection
                }
                const mobjectsArr = await API.viewer.getObjects(selector);
                var demouldedObjectIds = [];
                debugInfo = debugInfo.concat("<br />mobjectsArr length: " + mobjectsArr.length);
                $(debug).html(debugInfo);
                for (const mobjects of mobjectsArr) {
                    const objectsIds = mobjects.objects.map(o => o.id);
                    debugInfo = debugInfo.concat("objectsIds length: " + objectsIds.length);
                    debugInfo = debugInfo.concat("objectsIds[0]: " + objectsIds[0]);
                    $(debug).html(debugInfo);
                    const objPropertiesArr = await API.viewer.getObjectProperties(mobjects.modelId, objectsIds);
                    for (const objproperties of objPropertiesArr) {
                        debugInfo = debugInfo.concat("objectsIds[0]: " + objectsIds[0]);
                        $(debug).html(debugInfo);
                        for (const propertyset of objproperties.properties) {
                            for (const property of propertyset.properties) {
                                const propertyName = property.name;
                                const propertyValue = property.value;
                                if (typeof propertyName !== "undefined" && typeof propertyValue !== "undefined") {
                                    if (propertyName === "GUID") {
                                        debugInfo = debugInfo.concat("GUID: " + propertyValue);
                                        $(debug).html(debugInfo);
                                        if (guidsDemouldedElements.includes(propertyValue)) {
                                            demouldedObjectIds.push(objproperties.id)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                DevExpress.ui.notify("found " + demouldedObjectIds.length + " demoulded objects");
                if (demouldedObjectIds.length > 0) {
                    var demouldedObjects = await API.viewer.getObjects(demouldedObjectIds);
                    if (demouldedObjects.length > 0) {
                        await API.viewer.setObjectState(demouldedObjects, { color: { r: 0, g: 155, b: 0 } });
                        DevExpress.ui.notify(demouldedObjects.length);
                    }
                }
            }
            catch
            {

            }

            debugInfo = debugInfo.concat("<br />END ");
            $(debug).html(debugInfo); 

            //await fetchAsync();
        },
    });
});

async function fetchAsync() {
    let response = await fetch("https://192.168.1.183:443/api/authenticate", {
        method: 'POST',
        db: 'uat_20220202',
        login: 'mhemeryck',
        password: ''
    });
    let data = await response.json();
    DevExpress.ui.notify(data.token);
    return data;
}

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