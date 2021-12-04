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

async function setObjectsByProp(e) {
    SetText("setObjectsByProp");
	return doObjectsFilter(async () => API.viewer.setSelection(getPropSelector(), "set"));
}

async function doObjectsFilter(action) {
    SetText("doObjectsFilter");
  return doWorkRes("#objectsResult", "#objectsLoading", action);
}

async function doWorkRes(selResult, selLoading, action) {

    SetText("doWorkRes");
  return doWorkSafe(() => {
	$(selResult).html("");
	$(selLoading).show();
  }, action, r => {
	$(selLoading).hide();
	$(selResult).html(r);
  });
}

async function doWorkSafe(preAction, action, postAction) {
    SetText("doWorkSafe started");
  preAction();
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
  }
    postAction(result)

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

// My Vector class
class vector {
    constructor(x, y, z) {
        this.X = x;
        this.Y = y;
        this.Z = z;
    }
}