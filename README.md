val.js
=============
Simple and customizable jQuery form validation plugin. Required jQuery.

### Usage
```javascript
$(".testForm").validator({
    button: "#submit",
    entries: [{
        selector: "#name",
        constraint: "name",
        placeholder: "any placeholder text",
        errorMessage: "invalid name"
    }]
});
```
See `demo.html` for more information.

### Options
##### button
String, selector of the submit button.
eg. `#submitButtonIdName`
##### entries
Array of json objects. Each object represents an input field, containing following keys: `id`, `regex`, `placeholder` and `errorMessage`.
**selector**: String, selector of the input field.
**constraint**: String, defines the constraint of the input field. Four constraint types are offered as default (`name`, `phone`, `country code` and `email`). Regular Expression is also accepted. eg. `/^[0-9]{0,4}$/`. 
**placeholder**: please leave blank for now.
**errorMessage**: String, error message that displays when user input does not meet the constraints.
##### validHandler
(Optional) Function, defines what happens when a field is valid. It should take in following parameters:
**$entry**: jQuery Object, the input field. eg. $(selector).
**validClass**: String, CSS class name for valididated input field.
**invalidClass**: String, CSS class name for invalid input field.
**errorMsgClass**: (Optional), CSS class name for error message div container.
##### invalidHandler
(Optional) Function, defines what happens when a field is valid. It should take in following parameters:
**$entry**: jQuery Object, the input field. eg. $(selector).
**validClass**: String, CSS class name for validated input field.
**invalidClass**: String, CSS class name for invalid input field.
**errorMsgClass**: (Optional), CSS class name for error message div container.
**errorMsg**: (Optional), String, content of the error message.
##### validClass
(Optional) String, CSS class name for validated input field. default: `valid`.
##### invalidClass
(Optional) String, CSS class name for invalid input field. default: `invalid`.
##### errorMsgClass
(Optional) String, CSS class name for error message container. default: `invalid`.
##### errorMsg
(Optional) Boolean, display error message when user input does not meet the given contraint. default: true.
##### additionalRules
(Optional) Function, defines customized validation condition that must be satisfied before user can proceed on submitting the form. 
eg. a checkbox must be checked.

