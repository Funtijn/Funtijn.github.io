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

// Method to refresh poins and to set when to start watching
function OnPickedRefresh() {
    origin = undefined;
    point1 = undefined;
    point2 = undefined;
    canCalculate = true;
    var txtAngle = document.getElementById('txtAngle');
    txtAngle.value = "Pick center point";
}

// Determines whether watch picked points
let canCalculate = false;

// First picked point
let origin;

// Second picked points
let point1;

// Last picked point
let point2;

// OnPicked event called every time picker picks point
function OnPicked(pickedData) {
    if (!canCalculate) {
        return;
    }

    var txtAngle = document.getElementById('txtAngle');

    if (origin == undefined) {
        origin = pickedData.position;
        txtAngle.value = "Pick second point";
        //console.log("P1: " + origin);
    } else if (point1 == undefined) {
        point1 = pickedData.position;
        txtAngle.value = "Pick third point";
        //console.log("P2: " + point1);
    } else if (point2 == undefined) {
        point2 = pickedData.position;
        //console.log("P3: " + point2);
    }

    if (origin != undefined && point1 != undefined && point2 != undefined) {
        var vector1 = GetVectorLineSegment(origin, point1);
        var vector2 = GetVectorLineSegment(origin, point2);

        var angle = Math.acos(
            (vector1.X * vector2.X + vector1.Y * vector2.Y + vector1.Z * vector2.Z) /
            Math.sqrt((vector1.X * vector1.X + vector1.Y * vector1.Y + vector1.Z * vector2.Z) * (vector2.X * vector2.X + vector2.Y * vector2.Y + vector2.Z * vector2.Z))
        );

        var txtAngle = document.getElementById('txtAngle');
        txtAngle.value = +ToDegree(angle).toFixed(3);
        canCalculate = false;
    }
}

// Gets vector from two points
function GetVectorLineSegment(point1, point2) {
    return new vector(point1.x - point2.x, point1.y - point2.y, point1.z - point2.z);
}

// Recalculate Radians to degrees
function ToDegree(angle) {
    return angle * (180.0 / Math.PI);
}

function SetText(text)
{
    var txtInfo = document.getElementById('txtInfo');
    txtInfo.value = text;
}

async function setObjectsByProp() {
    SetText("setObjectsByProp");
	return doObjectsFilter(async () => API.viewer.setSelection(getPropSelector(), "set"));
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

async function addTextMarkups() {
    SetText("Start adding markups");
    const jsonArray = "[";
    const modelObjects = API.viewer.getObjects(getPropSelector());
    for (const mo of modelObjects) {
        SetText("Going through array");
        jsonArray.concat("{");
        SetText(jsonArray);
        jsonArray.concat("\"id\": ");
        SetText(jsonArray);
        jsonArray.concat(mo.objects[0].id);
        SetText(jsonArray);
        jsonArray.concat(",");
        SetText(jsonArray);
        jsonArray.concat("\"start\": ");
        SetText(jsonArray);
        jsonArray.concat("{");
        SetText(jsonArray);
        jsonArray.concat("\"positionX\": ");
        SetText(jsonArray);
        jsonArray.concat(mo.properties.find(p => p.name === "Default.COG_X"));
        SetText(jsonArray);
        jsonArray.concat(",");
        SetText(jsonArray);
        jsonArray.concat("\"positionY\": ");
        SetText(jsonArray);
        jsonArray.concat(mo.properties.find(p => p.name === "Default.COG_Y"));
        SetText(jsonArray);
        jsonArray.concat(",");
        SetText(jsonArray);
        jsonArray.concat("\"positionZ\": ");
        SetText(jsonArray);
        jsonArray.concat(mo.properties.find(p => p.name === "Default.COG_Z"));
        SetText(jsonArray);
        jsonArray.concat(",");
        SetText(jsonArray);
        jsonArray.concat("\"modelId\": ");
        SetText(jsonArray);
        jsonArray.concat(modelObjects.modelId);
        SetText(jsonArray);
        jsonArray.concat(",");
        SetText(jsonArray);
        jsonArray.concat("\"objectId\": null");
        SetText(jsonArray);
        jsonArray.concat("}");
        SetText(jsonArray);
        jsonArray.concat(",");
        SetText(jsonArray);
        jsonArray.concat("\"end\": ");
        SetText(jsonArray);
        jsonArray.concat("{");
        SetText(jsonArray);
        jsonArray.concat("\"positionX\": ");
        SetText(jsonArray);
        jsonArray.concat(mo.properties.find(p => p.name === "Default.COG_X"));
        SetText(jsonArray);
        jsonArray.concat(",");
        SetText(jsonArray);
        jsonArray.concat("\"positionY\": ");
        SetText(jsonArray);
        jsonArray.concat(mo.properties.find(p => p.name === "Default.COG_Y"));
        SetText(jsonArray);
        jsonArray.concat(",");
        SetText(jsonArray);
        jsonArray.concat("\"positionZ\": ");
        SetText(jsonArray);
        jsonArray.concat(mo.properties.find(p => p.name === "Default.COG_Z"));
        SetText(jsonArray);
        jsonArray.concat(",");
        SetText(jsonArray);
        jsonArray.concat("\"objectId\": null");
        SetText(jsonArray);
        jsonArray.concat("}");
        SetText(jsonArray);
        jsonArray.concat(",");
        SetText(jsonArray);
        jsonArray.concat("\"text\": ");
        SetText(jsonArray);
        jsonArray.concat(mo.properties.find(p => p.name === "Default.MERKNUMMER"));
        SetText(jsonArray);
        jsonArray.concat("}");
        SetText(jsonArray);
        jsonArray.concat(",");
        SetText(jsonArray);
    }
    SetText("Finished going through array");
    jsonArray = jsonArray.slice(0, -1);
    jsonArray.concat("]");
    API.markup.removeMarkups();
    SetText(jsonArray);
    API.markup.addTextMarkup(jsonArray);
}

// My Vector class
class vector {
    constructor(x, y, z) {
        this.X = x;
        this.Y = y;
        this.Z = z;
    }
}