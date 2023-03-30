var property = new Array();
var unit = new Array();
var factor = new Array();

property[0] = "Length";
unit[0] = new Array(
    "Meter",
    "Centimeter",
    "Kilometer",
    "Foot",
    "Inch",
    "Micrometer",
    "Millimeter",
    "Nanometer",
    "Mile",
    "Yard",
    "light year"
    
);
factor[0] = new Array(1, 0.01, 1000, 0.3048, 0.0254, 0.000001, 0.001, 1e-9, 1852, 0.9144,9460660005707976);

property[1] = "Temperature";
unit[1] = new Array(
    "Celsius ",
    "Fahrenheit",
    "Kelvin",
);
factor[1] = new Array(1, 0.555555555555, 1);
tempIncrement = new Array(0, -32, -273.15);

property[2] = "Area";
unit[2] = new Array(
    "Square meter",
    "Acre ",
    "Hectare",
    "Square centimeter",
    "Square kilometer",
    "Square foot",
    "Square inch",
    "Square mile",
    "Square yard"
);
factor[2] = new Array(1, 4046.856, 10000, 0.0001, 1000000, 9.290304e-2, 6.4516e-4, 2589988, 0.8361274);


property[3] = "Weight";
unit[3] = new Array(
    "Kilogram ",
    "Gram",
    "Milligram ",
    "Microgram ",
    "Carat",
    "Pound mass",
    "Ounce mass ",
    "Ton",
    "Tonne"
);
factor[3] = new Array(1, 0.001, 1e-6, 0.000000001, 0.0002, 0.4535924, 0.02834952, 1000, 1000);



property[4] = "Time";
unit[4] = new Array(
    "Second ",
    "Millisecond",
    "Microsecond",
    "Nanosecond",
    "Picosecond",
    "Minute ",
    "Hour ",
    "Day ",
    "Week",
    "Month",
    "Year"
);
factor[4] = new Array(1, 0.001, 0.000001, 1.E-9, 1.E-12, 60, 3600, 86400, 604800, 2629800,31557600);

//  Functions

function UpdateUnitMenu(propMenu, unitMenu) {
    // Updates the units displayed in the unitMenu according to the selection of property in the propMenu.
    var i;
    i = propMenu.selectedIndex;
    FillMenuWithArray(unitMenu, unit[i]);
}

function FillMenuWithArray(myMenu, myArray) {
    // Fills the options of myMenu with the elements of myArray.
    var i;
    myMenu.length = myArray.length;
    for (i = 0; i < myArray.length; i++) {
        myMenu.options[i].text = myArray[i];
    }
}

function CalculateUnit(sourceForm, targetForm) {
    // A simple wrapper function to validate input before making the conversion
    var sourceValue = sourceForm.unit_input.value;

    // First check if the user has given numbers or anything that can be made to one...
    sourceValue = parseFloat(sourceValue);
    if (!isNaN(sourceValue) || sourceValue == 0) {
        // If we can make a valid floating-point number, put it in the text box and convert!
        sourceForm.unit_input.value = sourceValue;
        ConvertFromTo(sourceForm, targetForm);
    }
}

function ConvertFromTo(sourceForm, targetForm) {
    // Converts the contents of the sourceForm input box to the units specified in the targetForm unit menu and puts the result in the targetForm input box.In other words, this is the heart of the whole script...
    var propIndex;
    var sourceIndex;
    var sourceFactor;
    var targetIndex;
    var targetFactor;
    var result;

    // Start by checking which property we are working in...
    propIndex = document.property_form.the_menu.selectedIndex;

    // Let's determine what unit are we converting FROM (i.e. source) and the factor needed to convert that unit to the base unit.
    sourceIndex = sourceForm.unit_menu.selectedIndex;
    sourceFactor = factor[propIndex][sourceIndex];

    targetIndex = targetForm.unit_menu.selectedIndex;
    targetFactor = factor[propIndex][targetIndex];

    result = sourceForm.unit_input.value;
    // Handle Temperature increments!
    if (property[propIndex] == "Temperature") {
        result = parseFloat(result) + tempIncrement[sourceIndex];
    }
    result = result * sourceFactor;

    // use the targetFactor to convert FROM the base unit
    // to the target unit...
    result = result / targetFactor;
    // Again, handle Temperature increments!
    if (property[propIndex] == "Temperature") {
        result = parseFloat(result) - tempIncrement[targetIndex];
    }

    // All that's left is to update the target input box:
    targetForm.unit_input.value = result;
}

// This fragment initializes the property dropdown menu using the data defined above in the 'Data Definitions' section
window.onload = function (e) {
    FillMenuWithArray(document.property_form.the_menu, property);
    UpdateUnitMenu(document.property_form.the_menu, document.form_A.unit_menu);
    UpdateUnitMenu(document.property_form.the_menu, document.form_B.unit_menu);
};

// Restricting textboxes to accept numbers + navigational keys only
document
    .getElementByClass("numbersonly")
    .addEventListener("keydown", function (e) {
        var key = e.keyCode ? e.keyCode : e.which;

        if (
            !(
                (
                    [8, 9, 13, 27, 46, 110, 190].indexOf(key) !== -1 ||
                    (key == 65 && (e.ctrlKey || e.metaKey)) || // Select All
                    (key == 67 && (e.ctrlKey || e.metaKey)) || // Copy
                    (key == 86 && (e.ctrlKey || e.metaKey)) || // Paste
                    (key >= 35 && key <= 40) || // End, Home, Arrows
                    (key >= 48 && key <= 57 && !(e.shiftKey || e.altKey)) || // Numeric Keys
                    (key >= 96 && key <= 105)(
                        // Numpad
                        key == 190
                    )
                ) // Numpad
            )
        )
            e.preventDefault();
    });