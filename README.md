
[![Issues](https://img.shields.io/github/issues/spartyboy/modalizable?style=for-the-badge)](https://github.com/spartyboy/modalizable/issues)
[![Forks](https://img.shields.io/github/forks/spartyboy/modalizable?style=for-the-badge)](https://github.com/spartyboy/modalizable/network/members)
[![Stars](https://img.shields.io/github/stars/spartyboy/modalizable?style=for-the-badge)](https://github.com/spartyboy/modalizable/stargazers)
[![Total Downloads](https://poser.pugx.org/dragonsoftware/modalizable/downloads)](//packagist.org/packages/dragonsoftware/modalizable)
[![License](https://poser.pugx.org/dragonsoftware/modalizable/license)](//packagist.org/packages/dragonsoftware/modalizable)



Modalizable is a bootstrap 4 styled popup modal edit plugin that enables you create edit modal popup with ease and could be customized to fit your needs. it currently supports all input types
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
@include("modalizable::modalscript",["click"=>"","modal"=>""])
the click and modal array is optional but pass if you want to give the modal a different id, by default this is called modalizableModal for modal name and the click is the class name that triggers the event.
```
# Features!

  - create a json array containing the following the for input type text, number, tel, file,range, datetime, date, email, search, color, textarea on the
  ```sh
   ModalizableController::modalizableGenerator()
   ```
 # Example: 
   ```sh
   ModalizableController::modalizableGenerator('text',['Salam Justice',false, 'Full Name'],'user',['name'=>'full_name','data-menu'=>'main'],'form-control clearError','edit-name');
   ``` 
   
   
   this would create this in html
   
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
  Meanwhile, for select, checkbox,radio, switch follows same pattern for the second parameter passed to the modalizable generator method you just have to pass an array of values that should be used as value,label for each element. e.g assuming the id of each state is to be used as the value for each element then you pass
  
  ```sh
  [
  ["id"=>1,"name"=>"Alaska"],
  ["id"=>2,"name"=>"Newyork"]
  ] as second argument to the method of the modalizableGenerator.
  ```
Then you also pass a label to be used for selectLabel argument of the modalizableGenerator method. for select option this label is used as the optgroup, for radios, checkboxes and swith it is used as a caption for what the entire radio or checkbox is meant for.

The next argument are the selected values that shows the item to be selected or checked this should be passed as an array. for select a single value is  needed for checkboxes multiple or single are required e.g. for the above values array previously defined
```sh
[1] for select means Alaska is selected
[1,2] for checkbox or radio means Newyork and Alaska are checked
```

The next argument is the keys which is to be defined to know what key is to be used from the values argument array for label, value, and which is to be used to determine what is selected or checked e.g.

```sh
['label'=>'name','value'=>'id','selected'=>'id'] 
```

The next argument is the custom attribute, this is to be used if you want an array to be passed as a custom attribute of selext,radio, checkbox, switch tag each index of the value key is used for attribute e.g.
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

checkbox usage

```shell script
$nestedArray['attributes'] = "<div data-edit='".GeneralController::modalizableGenerator('checkbox',Attribute::all()->sortBy('name')->toArray(),'',['name'=>'attribute_id[]'],'clearEditInvalidity custom-select form-control my-2','edit-attribute_id','Attribute',collect($collection->get('attributes_model'))->pluck('id')->all(),['selected'=>'id','label'=>'name','value'=>'id'])."'>" . $name . "</div>";
```

select Option Usage

```shell script
$nestedArray['admin_category_id']= "<div data-edit='".GeneralController::modalizableGenerator('select',AdminCategory::all()->toArray(),'',['name'=>'admin_category_id'],'clearEditInvalidity searchableSelect form-control','edit-admin_category_id','Admin Category',[$collection->get('admin_category_id')],['selected'=>'id','label'=>'name','value'=>'id'])."'>".optional($collection->get('admin_category'))['name']."</div>";
```

# Upcoming features

* File Preview
* Multi select menu
* Much more from your suggestions
