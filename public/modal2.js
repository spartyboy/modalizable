class Modal {
    objectParent; data; objectParentSiblings; uniqueIdentifier; caption; url; token; btnClass; placeholder; clearErrors; outputString; optType; found;
    Toast;
    constructor(this_obj,modal) {
        this.acceptableTypesInput=['password','text','datetime','datetime-local','file','date','number','email','hidden','color','range','search','tel'];
        this.acceptableTypesDifferent=['select','radio','checkbox','textarea','switch','multi-select'];
        this.this_obj=this_obj;
        this.objectParent=this.this_obj.parent().parent();
        this.data = this.this_obj.data('option');
        this.objectParentSiblings=this.objectParent.siblings();
        this.uniqueIdentifier=this.data.id
        this.caption=this.data.caption;
        this.url=this.data.url;
        this.token=this.data.csrf;
        this.btnClass = this.data.class
        this.placeholder =this.data.placeholder;
        this.clearErrors=this.data.errors;
        this.optType=this.data.type;
        this.modal=modal;
        this.found=false;
        this.outputString='<div>';
        this.constructModal();

    }
    constructModal(){
        if($("#"+this.modal).length >0){
            $("#"+this.modal).remove();
        }
        for (let i=0; i<=this.objectParentSiblings.length-1;i++){
            let currentTableData = this.objectParentSiblings[i];
            let editOptions = $($($(currentTableData)[0]).children()[0]).data('edit');
            if(editOptions.type!==null){
                this.outputString += this.constructInput(editOptions);
            }
        }
        if(typeof this.data.editor !== 'undefined'){
            let config = window[this.data.editor];
            tinyMCE.remove(config.selector);
            tinyMCE.init(config);
        }
        this.appendModalToElement().showModal();
    }
    appendModalToElement(){
        this.outputString+='<input type="hidden" value="'+this.uniqueIdentifier+'" name="itemUniqueIdentifier">' +
            '<div class="form-group">' +
            '    <button data-type="'+this.optType+'" data-clearerrors="'+this.clearErrors+'" data-placeholder="'+this.placeholder+'" class="btn btn-info btn-block '+this.btnClass+'" type="submit">Save <i class="fa fa-save"></i></button>' +
            '</div>' +
            '</div>';
        this.this_obj.after(' <div role="dialog" id="'+this.modal+'" tabindex="-1" class="modal fade">\n' +
            '               <div class="modal-dialog modal-lg" role="document">\n' +
            '                   <div class="modal-content">\n' +
            '                       <div class="modal-header">\n' +
            '                           <h4 class="modal-title text-wrap"><span>'+this.caption+'</span> <i class="fa fa-edit"></i></h4><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true"> × </span></button></div>\n' +
            '                       <div class="modal-body">\n' +
            '                            <form action="'+this.url+'" id="'+this.modal+'Form" method="post">\n' +
            '                               <input type="hidden" name="_method" value="PUT"/>\n'+
            '                             <div id="'+this.placeholder+'" class="my-1"></div>\n'+
            '                               <input type="hidden" value="'+this.token+'" name="_token">\n' +
            '                               <div>\n' +
            '\n' +  this.outputString +
            '                               </div>\n' +
            '                           </form>\n' +
            '                       </div>\n' +
            '                   </div>\n' +
            '               </div>\n' +
            '           </div>'
        );
        return this;
    }
    showModal(modal='modalizableModal'){
        $("#"+modal).modal('show');
        return this;
    }
    constructInput(editOptions=null) {
        if(editOptions==null || editOptions.length<1){
            alert('No Option Set');
        }else{
            let options = '';
            $.each(editOptions.options,function (i,value) {
                options+="  "+i+"='"+value+"' ";
            });
            let returnValue = '';
            let type = editOptions.type.toString().toLowerCase();
            if(this.exist(this.acceptableTypesInput,type) || this.exist(this.acceptableTypesDifferent,type)){

                if(this.exist(this.acceptableTypesInput,type)){

                    returnValue =  '<div class="form-group '+editOptions.parentClass+'">' +
                        '             <div class="input-group">' +
                        '                 <div class="input-group-prepend">' +
                        '                     <span class="input-group-text">'+editOptions.values.label +'' +
                        '                         &nbsp;  <i class="fa fa-'+editOptions.icon+'"></i>' +
                        '                     </span>' +
                        '               </div>' +
                        `               <input id="${editOptions.id}" ${options} type="${type}" class="${editOptions.classes}" value="${editOptions.values.value}">` +
                        '             </div>' +
                        '           </div>'
                }else{
                    if(type==='select'){
                        let selectOptions = this.selectOption(editOptions);
                        returnValue = '<div class="form-group '+editOptions.parentClass+' ">' +
                            '               <select id="'+editOptions.id+'" '+options+' class="custom-select '+editOptions.classes+'">' +
                            '                   <optgroup label="'+editOptions.selectLabel+'">' +
                            '     '+selectOptions+'              </optgroup> ' +
                            '               </select>' +
                            '          </div>';
                    }else if(type==='multi-select'){
                        let selectOptions = this.multiSelect(editOptions);
                        returnValue = '<div class="form-group">' +
                            '               <select multiple id="'+editOptions.id+'" '+options+' class="custom-select '+editOptions.classes+'">' +
                            '                   <optgroup label="'+editOptions.selectLabel+'">' +
                            '     '+selectOptions+'              </optgroup> ' +
                            '               </select>' +
                            '          </div>';
                    }else if(type==='radio'){
                        returnValue = this.radio(editOptions,options);
                    }else if(type==='checkbox'){
                        returnValue = this.checkBox(editOptions,options);
                    }else if(type==='textarea'){
                        returnValue = this.textArea(editOptions,options);
                    }else if(type==='switch'){
                        returnValue = this.customSwitch(editOptions,options);
                    }

                }
                return returnValue;
            }else{
                alert('un-acceptable type');
            }
        }
    }
    exist(hayStack,needle) {
        for (let i = 0; i <=hayStack.length-1 ; i++) {
            let text = hayStack[i];
            if(text===needle){
                this.found=true;
                break;
            }
        }
        if(this.found){
            this.found =false;
            return true;
        }else{
            return false;
        }
    }
    textArea(editOption,options) {
        let  textArea = '';
        textArea+= '<div class="form-group '+editOption.parentClass+'">' +
            `        <textarea id="${editOption.id}" class="${editOption.classes}" ${options}>${editOption.values.value}</textarea>` +
            '      </div>';
        return textArea;
    }
    radio(editOption,options) {
        if(editOption.values.length >= 1) {
            let id= editOption.id;
            //let split=id.split('-')[1];
            let radios = "<div class='row "+editOption.parentClass+"' id='"+id+"'><div class='col-12'><h3 class='text-capitalize text-wrap text-center'>"+editOption.selectLabel+"</h3></div>";
            let counter = 0;
            $.each(editOption.values,function (key, value) {
                let checked = null;
                if (value.selected) {
                    checked = 'checked';
                }
                counter++;
                radios+='<div class="col-12 col-md-6 col-lg-4 col-xl-3"><div class="form-group">\n' +
                    '                    <div class="custom-control">\n' +
                    `                        <input class="custom-control-input ${editOption.classes}" ${checked} ${options}  value="${value.value}" type="radio" id="${editOption.id+counter}">\n` +
                    '                        <label class="custom-control-label text-wrap" for="'+editOption.id+counter+'">'+value.label+'</label>\n' +
                    '                    </div>\n' +
                    '                </div></div>';
            });
            return radios+='</div>';
        }else{
            return '';
        }
    }
    checkBox(editOption,options) {
        if(editOption.values.length >= 1) {

            let id= editOption.id;
            //let split=id.split('-')[1];
            let checkbox = "<div class='row "+editOption.parentClass+"' id='"+id+"'><div class='col-12'><h3 class='text-center text-wrap text-capitalize'>"+editOption.selectLabel+"</h3></div>";
            let counter = 0;

            $.each(editOption.values,function (key, value) {
                let checked = null;
                if (value.selected) {
                    checked = 'checked';
                }
                counter++;
                checkbox+='<div class="col-12 col-md-6 col-lg-4 col-xl-3"><div class="form-group">\n' +
                    '                    <div class="custom-control custom-checkbox">\n' +
                    `                        <input class="custom-control-input ${editOption.classes}" ${checked} ${options}  value="${value.value}" type="checkbox" id="${editOption.id+counter}">\n` +
                    '                        <label class="custom-control-label text-wrap" for="'+editOption.id+counter+'">'+value.label+'</label>\n' +
                    '                    </div>\n' +
                    '                </div></div>';
            });
            return checkbox+='</div>';
        }else{
            return '';
        }
    }
    customSwitch(editOption,options) {
        if(editOption.values.length >= 1) {

            let id= editOption.id;
            //let split=id.split('-')[1];
            let checkbox = "<div class='row "+editOption.parentClass+"' id='"+id+"'><div class='col-12'><h3 class='text-center text-wrap text-capitalize'>"+editOption.selectLabel+"</h3></div>";
            let counter = 0;

            $.each(editOption.values,function (key, value) {
                let checked = null;
                if (value.selected) {
                    checked = 'checked';
                }
                counter++;
                checkbox+='<div class="col-12 col-md-6 col-lg-4 col-xl-3"><div class="form-group">\n' +
                    '                    <div class="custom-control custom-switch">\n' +
                    `                        <input class="custom-control-input ${editOption.classes}" ${checked} ${options}  value="${value.value}" type="checkbox" id="${editOption.id+counter}">\n` +
                    '                        <label class="custom-control-label text-wrap" for="'+editOption.id+counter+'">'+value.label+'</label>\n' +
                    '                    </div>\n' +
                    '                </div></div>';
            });
            return checkbox+='</div>';
        }else{
            return '';
        }
    }
    selectOption(editOption) {
        let options = '';
        if(editOption.values.length >= 1){
            let selected = '';

            for(let i=0;i<=editOption.values.length-1;i++){
                let value = editOption.values[i];
                if(value.selected){
                    selected = 'selected';
                }else{
                    selected ='';
                }
                if(Object.keys(editOption.custom_attribute).length>0) {
                    let obj = JSON.stringify(editOption.custom_attribute.value[i]);
                    //console.log(editOption.custom_attribute.value[i]);
                    options+=`<option data-${editOption.custom_attribute.name}="${obj}" ${selected} value="${value.value}">${value.label}</option>`
                }else {
                    options += `<option  ${selected} value="${value.value}">${value.label}</option>`;
                }
            }
        }else{
            options+='<option value="">No Options</option>'
        }
        return options
    }
    multiSelect(editOption){
        let options = '';
        if(editOption.values.length >= 1){
            let selected = '';

            for(let i=0;i<=editOption.values.length-1;i++){
                let value = editOption.values[i];
                if(value.selected){
                    selected = 'selected';
                }else{
                    selected ='';
                }
                if(Object.keys(editOption.custom_attribute).length>0) {
                    let obj = JSON.stringify(editOption.custom_attribute.value[i]);
                    //console.log(editOption.custom_attribute.value[i]);
                    options+=`<option data-${editOption.custom_attribute.name}="${obj}" ${selected} value="${value.value}">${value.label}</option>`
                }else {
                    options += `<option  ${selected} value="${value.value}">${value.label}</option>`;
                }
            }
        }else{
            options+='<option value="">No Options</option>'
        }
        return options
    }
    timer(str) {
        var secPer10len = 2000;
        var strlen =str.length;
        var parseIntDiv10 = parseInt(strlen/10);
        return parseIntDiv10*secPer10len;
    }
    clearAllErrors(className) {
        $("."+className).removeClass('is-invalid');
    }
    errorConstructor(errorArray,type,clearAllErrorsClassName,placeHolder) {
        // clear all previous errors
        this.clearAllErrors(clearAllErrorsClassName);
        //get the errors returned from server as a JSON array
        //make an  alert box for displaying validation errors
        var errors = '<div class="row"> <div class="col-12 col-md-8 offset-md-2">' +
            '<div role="alert" class="alert alert-danger">' +
            '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
            '<span aria-hidden="true">×</span>' +
            '</button> <ul class="text-dark">';
        //for each of the error show their messages
        $.each(errorArray,function (index,value) {
            index = index.replace('.','');
            $('#'+type+'-'+index).addClass('is-invalid');
            errors+='<li class="text-wrap">'+value[0]+'</li>';
        });
        //place the error in the view
        errors +='</ul></div></div></div>';
        $('#'+placeHolder).html(errors);
    }
    swalMultipartSubmit(url,arrayOfDataToSend,type,clearAllErrorsClassName,placeHolder,form,btn) {
        var originalText = btn.html();
        btn.prop('disabled',true);
        btn.text('Processing...').button('refresh');
        $.ajax({
            url:url,
            type:"POST",
            data:arrayOfDataToSend,
            cache:false,
            contentType:false,
            processData:false,
            async:false,
            enctype:'multipart/form-data',
            success: (data, status, xhr)=> {
                if (parseInt(xhr.status) === 200) {
                    btn.prop('disabled',false);
                    btn.html(originalText).button('refresh');
                    Swal.fire({
                        text: data.status,
                        icon:data.icon,
                        closeModal: true,
                        button:true,
                        timer:timer(data.status),
                    });
                    form[0].reset();
                    if(functions instanceof Array) {
                        if (functions.length > 0) {
                            for (var i = 0; i < functions.length; i++) {
                                var funcObj = functions[i];
                                var funct = window[funcObj.name];
                                if(funcObj.params==='paramPass'){
                                    var params = data;
                                }else{
                                    var params = funcObj.params;
                                }
                                funct(params);
                            }
                        }
                    }else{
                        var funct = window[functions];
                        funct(tabledata);
                    }

                    clearAllErrors(clearAllErrorsClassName);
                    $("#" + placeHolder).children().remove();
                }
            },
            error: (data,status,xhr)=> {
                btn.prop('disabled',false);
                btn.html(originalText).button('refresh');
                this.Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000
                });
                if(data.status===422){
                    this.errorConstructor(data.responseJSON.errors,type,clearAllErrorsClassName,placeHolder);
                }else if(data.status === 403){
                    Toast.fire({
                        title:'Sorry You Are Unauthorized To Do This',
                        icon:'error'
                    });
                }else if(data.status===500){
                    Toast.fire({
                        title:'Whoops! Something Went Wrong',
                        icon:'error'
                    });
                }else if (data.status===404){
                    Toast.fire({
                        title:'Document Not Found',
                        icon:'error'
                    });
                }else if (data.status===419){
                    Toast.fire({
                        title:'CSRF Token Mismatch',
                        icon:'error'
                    });
                }else{
                    Toast.fire({
                        title:'Something Went Wrong',
                        icon:'error'
                    });
                }
            }
        });
    }
}
