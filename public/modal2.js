class Modal {
    objectParent; data; objectParentSiblings; uniqueIdentifier; caption; url; token; btnClass; placeholder; clearErrors; outputString; optType; found;
    constructor(this_obj,modal) {
        this.acceptableTypesInput=['password','text','datetime','datetime-local','file','date','number','email','hidden','color','range','search','tel'];
        this.acceptableTypesDifferent=['select','radio','checkbox','textarea','switch'];
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
                        returnValue = '<div class="form-group">' +
                            '               <select id="'+editOptions.id+'" '+options+' class="custom-select '+editOptions.classes+'">' +
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
        for (let i = 0; i <hayStack.length-1 ; i++) {
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
            let radios = "<div class='row' id='"+id+"'><div class='col-12'><h3 class='text-capitalize text-wrap text-center'>"+editOption.selectLabel+"</h3></div>";
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
}
