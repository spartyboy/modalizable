<?php

namespace DragonSoftware\Modalizable\Helper;

use App\Http\Controllers\Controller;

class Modalizable extends Controller
{
    private static $acceptableTypesInput;
    private static $acceptableTypesDifferent;
    public static function modalizableGenerator($type='',$values=[],$icon='',$options=[],$classes='',$id='',$selectLabel='',$selectedValues=[],$keys=[],$customAttribute=[],$parentClass='',$parentId=''){
        $returnArray = null;
        $type= strtolower($type);
        self::$acceptableTypesInput = collect(['password','text','month','year','datetime','datetime-local','file','date','number','email','hidden','color','range','search','tel','url']);
        self::$acceptableTypesDifferent =collect(['select','radio','checkbox','textarea','switch','multi-select']);
        if(!empty($type) && count($values)>0 && count($options)>0 && is_array($selectedValues) && !empty($id) && is_string($type) &&is_string($selectLabel) && is_string($classes) && is_string($icon) && is_array($values) && is_array($options)){
            if(self::$acceptableTypesInput->contains($type) && count($values)===3){
                $returnArray =  [
                    'type'=>$type,
                    'icon'=>$icon,
                    'values'=>['value'=>$values[0],'selected'=>$values[1],'label'=>$values[2]],
                    'options'=>$options,
                    'classes' =>$classes,
                    'id'=>$id,
                    'parentClass'=>$parentClass,
                    'parentId'=>$parentId,
                ];
            }elseif(self::$acceptableTypesDifferent->contains($type)) {
                if ($type !== 'textarea') {
                    $val = [];
                    foreach ($values as $value) {
                        // the array of all values so the current array if the value of the selected one exists in single array of selected values
                        if (in_array($value[$keys['selected']], $selectedValues, false)) {
                            $selected = true;
                        } else {
                            $selected = false;
                        }
                        $label = $keys['label'];
                        $mainLabel = "";
                        if(strpos($label,'.') !==false){
                            $arr= explode('.',$label);
                            foreach ($arr as $item){
                                [$name, $accessor] = explode(":", $item);
                                $mainLabel.="$name : ".self::find($accessor,$value)." ";
                            }
                        }else{
                            $mainLabel = $value[$label];
                        }
                        $val[] = ['value' => $value[$keys['value']], 'selected' => $selected, 'label' => $mainLabel];
                    }
                    $returnArray = [
                        'type' => $type,
                        'icon' => $icon,
                        'values' => $val,
                        'options' => $options,
                        'classes' => $classes,
                        'selectLabel' => $selectLabel,
                        'id'=>$id,
                        'custom_attribute'=>$customAttribute,
                        'parentClass'=>$parentClass,
                        'parentId'=>$parentId,
                    ];
                }else{
                    $returnArray =  [
                        'type'=>$type,
                        'icon'=>$icon,
                        'values'=>['value'=>$values[0],'selected'=>$values[1],'label'=>$values[2]],
                        'options'=>$options,
                        'classes' =>$classes,
                        'id'=>$id,
                        'custom_attribute'=>$customAttribute,
                        'parentClass'=>$parentClass,
                        'parentId'=>$parentId,
                    ];
                }
            }
        }else{
            $returnArray=['type'=>null,'error'=>'invalid'];
        }

        try {
            $returnArray = json_encode($returnArray, JSON_THROW_ON_ERROR | JSON_HEX_APOS);
        } catch (\Exception $e) {
            $returnArray=['type'=>null,'error'=>'invalid'];
        }
        return $returnArray;
    }
    public static function find($key, $array) {
        $parts = explode('+', $key);
        foreach ($parts as $part) {
            $array = $array[$part];
        }
        return $array;
    }
}
