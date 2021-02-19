
[![Issues](https://img.shields.io/github/issues/spartyboy/modalizable?style=for-the-badge)](https://github.com/spartyboy/modalizable/issues)
[![Forks](https://img.shields.io/github/forks/spartyboy/modalizable?style=for-the-badge)](https://github.com/spartyboy/modalizable/network/members)
[![Stars](https://img.shields.io/github/stars/spartyboy/modalizable?style=for-the-badge)](https://github.com/spartyboy/modalizable/stargazers)
[![Total Downloads](https://poser.pugx.org/dragonsoftware/modalizable/downloads)](//packagist.org/packages/dragonsoftware/modalizable)
[![License](https://poser.pugx.org/dragonsoftware/modalizable/license)](//packagist.org/packages/dragonsoftware/modalizable)



Modalizable is a bootstrap 4 styled popup modal edit plugin that enables you create edit modal popup with ease and could be customized to fit your needs. it currently supports all input types and could as well auto submit the form
# Requirement
* Bootstrap 4
* Jquery
* Laravel
# Usage

require via composer
```sh
composer require dragonsofware/modalizable
```

publish assets
```sh
php artisan vendor:publish --tag="dragon_modal"
```
include scripts
```sh
@include("modalizable::modalscript",["click"=>"","modal"=>"","autoSubmit"=>(bool)])
```
The click, modal and autoSubmit key in the array of the @include above are optional.
But do provide them if you want to give the bootstrap modal a different id,
by default, the click is a html 5 class attribute that triggers the modal
when the edit button on your front end is clicked. This is set to modalizable by default,
this implies that if you have a mark up code for your edit you should have the following class attached to it

```sh
<button class="modalizable">Edit</button>
```
# Features!

To use the library do ensure you do the following
  - call the modalizableGenerator() as shown in the code sample below, 
    for input type text, number, tel, file,range, datetime, date, email, search, color,textarea,
  ```sh
   Modalizable::modalizableGenerator()
   ```
 # Example: 
   ```sh

   <td>
        <div data-edit="{!! Modalizable::modalizableGenerator('text',['Salam Justice',false, 'Full Name'],'user',['name'=>'full_name','data-menu'=>'main'],'form-control clearError','edit-name') !!}">
        {{$name/anything}}
        </div>
    </td>;
   ``` 
   
   
   the above would create this in the modal popup
   
   ```sh
   <div class='form-group'>
            <div class='input-group'>
              <div class='input-group-prepend'>
                <span class='input-group-text'>Full Name <i class="fa fa-user"></i></span>
              </div>
                <input type="text" name='edit-name' value="Salam Justice" data-menu='main' />
            </div>
    </div>        
            
   ```

  The first argument passed to the modalizableGenerator() denotes the tye of input to be created.
  
  The second argument is an array that contains [The value to be used for input, This has no effect ,Label to be given to Input group Prepend]  .
  
  The third argument is a font awesome icon to be used.

  The fourth argument is an array that entails attribute key and respective value to be used as html 5 tag attribute and value,
  each key is the attribute itself and value of the attribute is the value of the associated key.

  The fifth argument are classes to be applied to the input tag

  The sixth argument is the id to be given to the input tag


  Meanwhile, for inputs of type select,multiselect, checkbox,radio, switch follows same pattern, 
  But has slight modification to be made for the second parameter passed to the modalizable generator method you just have to pass an array of values that should be used as value, label for each element. e.g
  
  ```sh
  [
      ["id"=>1,"name"=>"Alaska","created_at"=>'2012-02-03'],
      ["id"=>2,"name"=>"Newyork", "created_at"=>'2012-02-03']
  ] 
  the above similar type of array should be used as the second argument passed to the method of the modalizableGenerator.
  ```
Then you also pass a label to be used for selectLabel argument(6th) of the modalizableGenerator method. for select option this label is used as the optgroup, for radios, checkboxes and switch it is used as a caption for what the entire radio or checkbox is meant for.

The next argument(7th) are the selected values that shows the item to be selected or checked this should be passed as an array. for select a single value is  needed for checkboxes multiple or single are required e.g. for the above values array previously defined
```sh
[1] for select means Alaska is selected
[1,2] for checkbox or radio or multiSelect means Newyork and Alaska are checked
```

The next argument(8th) is the keys which is to be defined to know what key is to be used from the values argument array for label, value, and which is to be used to determine what is selected or checked e.g.

```sh
['label'=>'name','value'=>'id','selected'=>'id'] 
```

The next argument(9th) is the custom attribute, this is to be used if you want an array to be passed as a custom attribute of selext,radio, checkbox, switch tag each index of the value key is used for attribute e.g.
```sh
['name'=>'my',values=>[ array of values each index corresponds to input of the value argument]] to access this a custom attribute of data-my is created with value of index of the currently iterated value argument
```

The last argument is parent class which defines what class to be appended at main div housing the entire input tag

To initialize this do make sure your button to be clicked for edit has the following

```sh
 $text = "Name: {$collection->get('name')},";
                $option= json_encode(["id"=>$collection->get('id'),"caption"=>"Edit Programme For $text","url"=>route('crudprogramme.update',['crudprogramme'=>$collection->get('id')]),"csrf"=>csrf_token(),"class"=>"silentSubmit","placeholder"=>"editErrorMessages","errors"=>"clearEditInvalidity","type"=>"edit"]);
<button type='button' data-option='".$option."' class='mx-1 modalizable my-1 btn btn-sm btn-primary'><i class='fa fa-edit'></i>
```

- The above could be interpreted as seen below.

The id denotes a unique identifier of the currently edited form,

The caption denotes the caption to be used as modal heading,

The url denotes the where the form is to be submitted,

The class denotes what should be used to trigger autoSubmit when the save button on the modal is clicked,

The placeholder denotes the name it should give to the id of the tag where the errors should be shown,

The errors denotes the class to be used to clear field found to have validation errors this is automatically handled if autosubmit is enabled

The type denotes what was used to prefix id's in markup on modalizable Controller e.g. edit-name


#More Examples
checkbox usage

```shell script
$nestedArray['attributes'] = "<div data-edit='".Modalizable::modalizableGenerator('checkbox',Attribute::all()->sortBy('name')->toArray(),'',['name'=>'attribute_id[]'],'clearEditInvalidity custom-select form-control my-2','edit-attribute_id','Attribute',collect($collection->get('attributes_model'))->pluck('id')->all(),['selected'=>'id','label'=>'name','value'=>'id'])."'>" . $name . "</div>";
```

select Option Usage

```shell script
$nestedArray['admin_category_id']= "<div data-edit='".Modalizable::modalizableGenerator('select',AdminCategory::all()->toArray(),'',['name'=>'admin_category_id'],'clearEditInvalidity searchableSelect form-control','edit-admin_category_id','Admin Category',[$collection->get('admin_category_id')],['selected'=>'id','label'=>'name','value'=>'id'])."'>".optional($collection->get('admin_category'))['name']."</div>";
```

# Upcoming features

* File Preview
* Much more from your suggestions
