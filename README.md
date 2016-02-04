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
    validHandler: validHandler,         // what happens when a field is valid, optional. eg.
                                        // validHandler($entry, validClass, invalidClass, errorMsgClass)
    invalidHandler: invalidHandler,     // what happens when a field is invalid, optional. eg.
                                        // invalidHandler($entry, validClass, invalidClass, errorMsgClass, errorMsg)
    validClass: 'validClassName',       // append to field when it is valid, optional, default: '.valid'
    invalidClass: 'invalidClassName',   // append to field when it is invalid, optional, default: '.invalid'
    errorMsgClass: 'errorMsgClassName', // create an div with this class when msg need to be shown, optional, default: '.errorMsg'
    errorMsg: 'boolean",                // turn on/off error message display, default: true
    additionalRules: 'function',        // function that returns a boolean, representing customized condition that 
                                        // must be satisfied before user can proceed to submit the form. 
                                        // eg. checkbox must be checked.
});
```
See `demo.html` for more information.
