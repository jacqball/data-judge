(function( $ ) {
    var iam='judge'; //so we can change this plugin's name
    //builds html for responses
    var reply=function(msg){
        return '<div class="'+iam+'_reply">'+msg+'</div>';
    };
    var hint=function(mtype,el){
        //did they put a specific hint on the element
        var custom=$(el).attr('data-'+iam+'-'+mtype+'-hint')
        if(custom){
            return custom;
        } else {
            //get hint for validation type
            return settings[mtype+'_hint'];
        }
    };
    var findTarget=function(target){

        if('#'==target.substr(0,1)){ //Is it an id?
            search=target;
        } else { //must be a name 
            search='[name="'+target+'"]';
        }
        return search;
    };
    var settings;
    $.fn[iam] = function(options) {
        //if not form, do nothing
        if(!this.is('form')){
            console.log('NOT A FORM!');
            return this;
        }
        console.log('Cool, its a form');

        settings = $.extend({
            // defaults
            iam:iam,
            required_hint:'This is required',
            or_hint:'OR FAILED',
            and_hint:'AND FAILED',
            regex_hint:'PATTERN FAILED',
            regexi_hint:'PATTERN FAILED'
        }, options );

        //now hook up the validation
        this.submit(function(event){
            var valid=true;//until something fails
            //clear old responses
            $('.'+iam+'_reply').remove();

            //are all required elements present?
            $('[data-'+iam+'-required]', this).each(function() {
                var val=$(this).val();
                if(!val){
                    $(reply(hint('required',this))).insertBefore(this);
                    valid=false;
                }
            });
            //regular expression tests
            $('[data-'+iam+'-regex]', this).each(function() {
                var val=$(this).val();
                if(val){
                    var rgx=new RegExp($(this).attr('data-'+iam+'-regex'));
                    if(!rgx.test(val)){
                        $(reply(hint('regex',this))).insertBefore(this);
                        valid=false;
                    }
                }
            });
            //case insensitive regex
            $('[data-'+iam+'-regexi]', this).each(function() {
                var val=$(this).val();
                if(val){
                    var rgx=new RegExp($(this).attr('data-'+iam+'-regexi'),"i");
                    if(!rgx.test(val)){
                        $(reply(hint('regexi',this))).insertBefore(this);
                        valid=false;
                    }
                }
            });
            //this OR another
            $('[data-'+iam+'-or]', this).each(function() {
                var val=$(this).val();
                if(!val){
                    var or_fields=$(this).attr('data-'+iam+'-or').split('|');
                    var theform=$(this).closest('form');//FIXME see about storing as var at submit the form whose submit
                    var or_len=or.length;
                    var or_valid=false; //until SOMETHING has a value
                    for (var i = 0; i < or_len; i++){
                        var target=also[i];
                        //find target differently depending on whether it's #name, .name or name
                        var search=findTarget(target);
                        theform.find(search).each(
                            function(index,child){
                                //good if it has a value
                                if($(child).val()){
                                    or_valid=true;
                                }
                            }
                        );
                    }
                }
                if(!or_valid){
                    //mark this as invalid
                    $(reply('At least one of these is required')).insertBefore($(this));
                    $(reply(hint('or',this))).insertBefore(this);
                    //loop through the others and amrk them invalid also IF they don't have data-or? FIXME Consider
                }
                
            });

            //FIXME add data-xor
            
            //this AND another
            $('[data-'+iam+'-and]', this).each(function() {
                var val=$(this).val();
                if(val){
                    //check for presense of others
                    var also=$(this).attr('data-'+iam+'-and').split('|');
                    var theform=$(this).closest('form');//FIXME see about storing as var at submit the form whose submit
                    var also_len=also.length;
                    var and_valid=true;
                    //refactor this?
                    for(var i=0;i<also_len;i++){
                        var target=also[i];
                        //find target differently depending on whether it's #name, .name or name
                        var search=findTarget(target);
                        theform.find(search).each(
                            function(index,child){
                                //good if it has a value
                                if($(child).val()){
                                } else {
                                    //value not provided
                                    and_valid=false;
                                    // may not want to do if THIS also has data-and? well maybe if it matches the first element...getting complicated...
                                    // hint this and other might need different hints
                                    $(reply('This is required to go along with other data provided')).insertBefore($(this));
                                    
                                }
                            }
                        );
                    }

                    if(!and_valid){
                        $(reply(hint('and',this))).insertBefore(this);
                        valid=false;
                    }
                    
                }
            });

            if(!valid){
                event.preventDefault();
            }
        });

        return this;
    };
 
}( jQuery ));
