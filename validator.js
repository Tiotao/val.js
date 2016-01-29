;(function($){
    $.fn.extend({
        validator: function(options) {
            var self = this;
            this.defaultOptions = {};
            var settings = $.extend({}, this.defaultOptions, options);
            
            this.validity = {
                value: false,
                detail: {},
            };
            
            this.touched = [];
            
            this.IELowerThan = function(ver) {
                var myNav = navigator.userAgent.toLowerCase();
                var version = (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
                if ( version ) {
                    return version < ver
                } else {
                    return false;
                }
            }
            
            this.checkRegex = function(entry, content) {
                var isValid, isEmpty, msg;
                var placeholder = entry.placeholder;
                var regex = entry.regex;
                var errorMsg = entry.errorMessage;
                if (content.length == 0 || (this.IELowerThan(10) && content === placeholder)) {
                    isValid = false;
                    isEmpty = true;
                    msg = errorMsg;
                } else if (!regex.test(content)) {
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
                }
            }
            
            this.getViewHandler = function(isValid) {
                if(isValid) {
                    return settings.validHandler;
                } else {
                    return settings.invalidHandler;
                }
            }
            
            this.validate = function(wrapper, currIndex) {
                
                function unique(array) {
                    return $.grep(array, function(el, index) {
                        return index === $.inArray(el, array);
                    });
                }
                
                var results = [];
                $.each(settings.entries, function(index, entry) {
                    var $entry = wrapper.find(entry.id);
                    var entryVal = $entry.val();
                    var result = self.checkRegex(entry, entryVal);
                    if(index === currIndex){
                        self.touched.push(index);
                        self.touched = unique(self.touched);
                    }
                    results.push(result);
                });
                return results;
            }
            
            this.showMessage = function(wrapper, validity) {
                $.each(validity.detail, function(index, status){
                    if($.inArray(index, self.touched) > -1){
                        var message = status.msg;
                        var updateValidityView = self.getViewHandler(status.isValid);
                        var entryId = settings.entries[index].id;
                        var $entry = wrapper.find(entryId);
                        var isValidityChange = ($entry.hasClass(settings.validClass) && !status.isValid) || ($entry.hasClass(settings.invalidClass) && status.isValid) || (!$entry.hasClass(settings.invalidClass) && !$entry.hasClass(settings.validClass));
                        if (isValidityChange) {
                            console.log("change")
                            updateValidityView($entry, settings.validClass, settings.invalidClass, settings.errorMsgClass, message);
                        }
                        
                    }
                })
            }
            
            this.updateSubmitButton = function(wrapper, isValid) {
                var $button = wrapper.find(settings.button);
                console.log(isValid);
                if (isValid) {
                    $button.removeAttr("disabled");
                } else {
                    $button.attr("disabled", true);
                }
            }

            this.watch = function(wrapper) {
                var validate = self.validate;

                $.each(settings.entries, function(index, entry) {
                    var $entry = wrapper.find(entry.id);
                    $entry.on('input', function(){
                        var results = validate(wrapper, index);
                        self.validity = {
                            value: (function(r){
                                var invalidEntries = $.grep(r, 
                                    function(n ,i) {
                                        return n.isValid == false
                                    });
                                return invalidEntries.length == 0
                            })(results),
                            detail: results,
                        }
                        self.showMessage(wrapper, self.validity, null);
                        self.updateSubmitButton(wrapper, self.validity.value);
                    });
                });
            }
            
            return this.each(function() {
                var $this = $(this);
                self.watch($this);
            });
        }
    });
})(jQuery);