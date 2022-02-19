
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
    'K',
    'BV',
    'BD',
    'BS',
];

const prefixSelectionTagBox = $('#prefixSelection').dxTagBox({
    items: prefixes,
    showSelectionControls: true,
    applyValueMode: 'useButtons',
    onValueChanged: function () {
        DevExpress.ui.notify("The button was clicked");
    },
});

$(function () {
    $("#button").dxButton({
        stylingMode: "outlined",
        text: "Filter toepassen",
        type: "success",
        onClick: function () {
            var selected = prefixSelectionTagBox.dxTagBox("instance").option("selectedItems");
            for (let i = 0; i < selected.length; i++) {
                var actionType = i == 0 ? "set" : "add";
                setObjectsByPropnameAndValue("Default.MERKPREFIX", selected[i], actionType);
            }
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
