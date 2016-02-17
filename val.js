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
                hint: true,
                validHandler: null,
                invalidHandler: null,
                additionalRules: null,
                hintHandler: null,
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
                        if($entry.next('.'+errorMsgClass).length > 0){
                            $entry.next('.'+errorMsgClass).text(errorMsg);
                        } else {
                            $entry.after(messageView);
                        }
                       
                    };
                } else {
                    settings.invalidHandler = function($entry, validClass, invalidClass){
                        $entry.addClass(invalidClass).removeClass(validClass);
                    };
                }
            }
            
            if($.isFunction(settings.hintHandler)){
                // do nothing
            } else if ($.type(settings.hintHandler) === "null") {
                if (settings.hint) {
                    console.log('define hinthandler');
                    settings.hintHandler = function($entry, hintClass, errorMsgClass, hint, visible){
                        if (visible) {
                            var hintView = "<p class='"+ hintClass +"'>" + hint + "</p>";
                            if ($entry.next('.'+errorMsgClass).length < 1) {
                                $entry.after(hintView);
                            } else {
                                $entry.next('.'+errorMsgClass).after(hintView);
                            }
                        } else {
                            $entry.nextAll('.'+hintClass).remove();
                        }
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
            
            this.getErrorMessage = function(errorMsg, value){
                var message;
                if($.type(errorMsg) === "string") {
                    message = errorMsg;
                } else {
                    message = "";
                    $.each(errorMsg, function(index, msgObject){
                        var condition = msgObject.condition;
                        if (condition(value)){
                            message = msgObject.msg;
                        }
                    });
                }
                return message;
            };
            
            this.checkRegex = function(entry, content) {
                var isValid, isEmpty, msg;
                var placeholder = entry.placeholder;
                var regex = self.generateRegex(entry.constraint);
                var errorMsg = self.getErrorMessage(entry.errorMessage, content);
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
                        var isMessageSame = ($entry.next('.'+settings.errorMsgClass).length < 1 && $.type(message) === "null") || ($entry.next('.'+settings.errorMsgClass).text() === message);
                        var isValidityChange = ($entry.hasClass(settings.validClass) && !status.isValid) || ($entry.hasClass(settings.invalidClass) && status.isValid) || (!$entry.hasClass(settings.invalidClass) && !$entry.hasClass(settings.validClass));
                        if (isValidityChange || !isMessageSame) {
                            updateValidityView($entry, settings.validClass, settings.invalidClass, settings.errorMsgClass, message);
                        }
                        
                    }
                });
            };
            
            // this.showHint = function($entry, hint) {
            //     var hintClass = settings.hintClass;
            //     var errorMsgClass = settings.errorMsgClass;
            //     var hintView = "<p class='"+ hintClass +"'>" + hint + "</p>";
            //     if ($entry.next('.'+errorMsgClass).length < 1) {
            //         $entry.after(hintView);
            //     } else {
            //         $entry.next('.'+errorMsgClass).after(hintView);
            //     }
                
            // };
            
            // this.hideHint = function($entry) {
            //     var hintClass = settings.hintClass;
            //     $entry.nextAll('.'+hintClass).remove();
            // };
            
            this.updateValidity = function (wrapper, currIndex) {
                var validate = self.validate;
                var results = validate(wrapper, currIndex);
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
                // var validate = self.validate;
                // // initialise
                // var results = validate(wrapper, -1);
                // self.validity = {
                //     value: (function(r){
                //         var invalidEntries = $.grep(r, 
                //             function(n ,i) {
                //                 return n.isValid === false;
                //             });
                //         return invalidEntries.length === 0;
                //     })(results),
                //     detail: results,
                // };
                
                self.updateValidity(wrapper, -1);
                console.log(self.validity);
                // bind event with each entry
                $.each(settings.entries, function(index, entry) {
                    var $entry = wrapper.find(entry.selector);
                    $entry.on('input', function(){
                        self.updateValidity(wrapper, index);
                        self.showMessage(wrapper, self.validity, null);
                        self.updateSubmitButton(wrapper, self.validity.value);
                    });
                    if (entry.hasOwnProperty('hint')) {
                        $entry.on('focus', function(){
                            console.log(entry.hint);
                            var isValid = self.validity.detail[index].isValid;
                            if (!isValid) {
                                settings.hintHandler($entry, settings.hintClass, settings.errorMsgClass, entry.hint, true);
                            }
                        });
                        
                        $entry.on('blur', function(){
                            settings.hintHandler($entry, settings.hintClass, settings.errorMsgClass, entry.hint, false);
                        });
                    }
                });
            };
            
            return this.each(function() {
                var $this = $(this);
                self.watch($this);
            });
        }
    });
})(jQuery);