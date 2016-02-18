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
        errorMessage: "invalid name",
        hint: "this is a name"
    }]
});
```
See `demo.html` for more information.

### Options
##### button
String, selector of the submit button.
eg. `#submitButtonIdName`
##### entries
Array of json objects. Each object represents an input field, containing following keys: `id`, `regex`, `placeholder`, `hint`, 'passwordSelector' and `errorMessage`.
**selector**: String, selector of the input field.
**constraint**: String, defines the constraint of the input field. Four constraint types are offered as default (`name`, `phone`, `country code` and `email`). Regular Expression is also accepted. eg. `/^[0-9]{0,4}$/`. 
**placeholder**: please leave blank for now.
**hint**: (Optional) String, hint text that displays when input is focused.
**passwordSelector**: (Optional) String, selector of password field, if the current field is a confirm password field.
**errorMessage**: (Optional) String, error message that displays when user input does not meet the constraints.
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
##### hintHandler
(Optional) Function, defines what happens when a field is valid. It should take in following parameters:
**$entry**: jQuery Object, the input field. eg. $(selector).
**hintClass**: String, CSS class name for hint container.
**errorMsgClass**: CSS class name for error message div container.
**hint**: String, content of the error hint.
**visible**: Boolean, whether current handler showing/hiding the hint.
##### validClass
(Optional) String, CSS class name for validated input field. default: `valid`.
##### invalidClass
(Optional) String, CSS class name for invalid input field. default: `invalid`.
##### errorMsgClass
(Optional) String, CSS class name for error message container. default: `invalid`.
##### hintClass
(Optional) String, CSS class name for hint inpu container. default: `hint`.
##### errorMsg
(Optional) Boolean, display error message when user input does not meet the given contraint. default: true.
##### hint
(Optional) Boolean, display hint when user focus on an input field. default: true.
##### additionalRules
(Optional) Function, defines customized validation condition that must be satisfied before user can proceed on submitting the form. 
eg. a checkbox must be checked.
##### checkEvent
(Optional) String, defines when will validation check be triggered. default: 'input'.

### Update
##### 0.0.3
- include support for hint text
- able to specify when does validation check happen