Validator.js
=============
Simple and customizable jQuery form validation plugin.

### Usage
```
$(".testForm").validator({
    button: '#submitButtonIdName',
    entries: [{
        id: "#fieldOneIdName",
        regex: FIELD_ONE_REGEX,
        placeholder: "any placeholder text, currently in dev",
        errorMessage: "default error message"
    },
    {
        id: "#fieldTwoIdName",
        regex: FIELD_TWO_REGEX,
        placeholder: "any placeholder text, currently in dev",
        errorMessage: "default error message"
    }
    ],
    validHandler: validHandler,         // what happens when a field is valid. eg.
                                        // validHandler($entry, validClass, invalidClass, errorMsgClass)
    invalidHandler: invalidHandler,     // what happens when a field is invalid. eg.
                                        // invalidHandler($entry, validClass, invalidClass, errorMsgClass, errorMsg)
    validClass: 'validClassName',       // append to field when it is valid
    invalidClass: 'invalidClassName',   // append to field when it is invalid
    errorMsgClass: 'errorMsgClassName'  // create an div with this class when msg need to be shown
    errorMsg: 'boolean"                 // turn on/off error message display, default: true
});
```
See `demo.html` for more information.
