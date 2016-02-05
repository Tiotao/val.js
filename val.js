;(function($){
    $.fn.extend({

        validator: function(options) {
            var self = this;
            
            // default options
            this.defaultOptions = {
                validClass: 'valid',
                invalidClass: 'invalid',
                errorMsgClass: 'errorMsg',
                errorMsg: true,
                validHandler: null,
                invalidHandler: null,
                additionalRules: null,
            };
            
            var settings = $.extend({}, this.defaultOptions, options);
            
            // define valid handler

            if($.isFunction(settings.validHandler)){                 // handler overridden
                // do nothing
            } else if ($.type(settings.validHandler) === "null") {   // use default handler
                if (settings.errorMsg) {
                    settings.validHandler = function($entry, validClass, invalidClass, errorMsgClass){
                        $entry.addClass(validClass).removeClass(invalidClass);
                        $entry.next('.'+errorMsgClass).remove();
                    };
                } else {
                    settings.validHandler = function($entry, validClass, invalidClass){
                        $entry.addClass(validClass).removeClass(invalidClass);
                    };
                }
            }

            // define invalid handler

            if($.isFunction(settings.invalidHandler)){                 // handler overridden
                // do nothing
            } else if ($.type(settings.invalidHandler) === "null") {   // use default handler
                if (settings.errorMsg) {
                    settings.invalidHandler = function($entry, validClass, invalidClass, errorMsgClass, errorMsg){
                        var messageView = "<p class='"+ errorMsgClass +"'>" + errorMsg + "</p>";
                        $entry.addClass(invalidClass).removeClass(validClass);
                        $entry.after(messageView);
                    };
                } else {
                    settings.invalidHandler = function($entry, validClass, invalidClass){
                        $entry.addClass(invalidClass).removeClass(validClass);
                    };
                }
            }
            
            this.validity = {
                value: false,
                detail: {},
            };
            
            this.touched = [];
            
            this.IELowerThan = function(ver) {
                var myNav = navigator.userAgent.toLowerCase();
                var version = (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
                if ( version ) {
                    return version < ver;
                } else {
                    return false;
                }
            };
            
            this.generateRegex = function(type) {
                var regex;
                if($.type(type) === 'regexp') {                                             // customized regex
                    regex = type;
                } else if(type.indexOf('number') > -1){                                     // has number range
                    regex = new RegExp("^[0-9]" + type.split("number")[1] + "$");
                } else {                                                                    // default regex
                   switch(type){
                        case 'text':
                            regex = /[A-Za-z]/;
                            break;
                        case 'email':
                            regex =  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                            break;
                        case 'phone':
                            regex =  /^[0-9]{6,15}$/;
                            break;
                        case 'country code':
                            regex = /^[0-9]{1,3}$/;
                            break;
                        default:
                            regex = /.*/;
                    }
                }
                
                return regex;
            };
            
            this.checkRegex = function(entry, content) {
                var isValid, isEmpty, msg;
                var placeholder = entry.placeholder;
                var regex = self.generateRegex(entry.constraint);
                var errorMsg = entry.errorMessage;
                var passRegexTest = regex.test(content);
                if (content.length === 0 || (this.IELowerThan(10) && content === placeholder)) {
                    isValid = false;
                    isEmpty = true;
                    msg = errorMsg;
                } else if (!passRegexTest) {
                    isValid = false;
                    isEmpty = false;
                    msg = errorMsg;
                } else {
                    isValid = true;
                    isEmpty = false;
                    msg = null;
                }
                return {
                    isValid: isValid,
                    isEmpty: isEmpty,
                    msg: msg
                };
            };
            
            this.getViewHandler = function(isValid) {
                if(isValid) {
                    return settings.validHandler;
                } else {
                    return settings.invalidHandler;
                }
            };
            
            this.validate = function(wrapper, currIndex) {
                
                function unique(array) {
                    return $.grep(array, function(el, index) {
                        return index === $.inArray(el, array);
                    });
                }
                
                var results = [];
                $.each(settings.entries, function(index, entry) {
                    var $entry = wrapper.find(entry.selector);
                    var entryVal = $entry.val();
                    var result = self.checkRegex(entry, entryVal);
                    if(index === currIndex){
                        self.touched.push(index);
                        self.touched = unique(self.touched);
                    }
                    results.push(result);
                });
                return results;
            };
            
            this.showMessage = function(wrapper, validity) {
                $.each(validity.detail, function(index, status){
                    if($.inArray(index, self.touched) > -1){
                        var message = status.msg;
                        var updateValidityView = self.getViewHandler(status.isValid);
                        var entryId = settings.entries[index].selector;
                        var $entry = wrapper.find(entryId);
                        var isValidityChange = ($entry.hasClass(settings.validClass) && !status.isValid) || ($entry.hasClass(settings.invalidClass) && status.isValid) || (!$entry.hasClass(settings.invalidClass) && !$entry.hasClass(settings.validClass));
                        if (isValidityChange) {
                            updateValidityView($entry, settings.validClass, settings.invalidClass, settings.errorMsgClass, message);
                        }
                        
                    }
                });
            };
            
            this.updateSubmitButton = function(wrapper, isValid) {
                var $button = wrapper.find(settings.button);
                var rules;
                if ($.isFunction(settings.additionalRules)) {
                    rules = settings.additionalRules();
                } else {
                    rules = true;
                }
                if (isValid && rules) {
                    $button.removeAttr("disabled");
                } else {
                    $button.attr("disabled", true);
                }
            };

            this.watch = function(wrapper) {
                var validate = self.validate;

                $.each(settings.entries, function(index, entry) {
                    var $entry = wrapper.find(entry.selector);
                    $entry.on('input', function(){
                        var results = validate(wrapper, index);
                        self.validity = {
                            value: (function(r){
                                var invalidEntries = $.grep(r, 
                                    function(n ,i) {
                                        return n.isValid === false;
                                    });
                                return invalidEntries.length === 0;
                            })(results),
                            detail: results,
                        };
                        self.showMessage(wrapper, self.validity, null);
                        self.updateSubmitButton(wrapper, self.validity.value);
                    });
                });
            };
            
            return this.each(function() {
                var $this = $(this);
                self.watch($this);
            });
        }
    });
})(jQuery);