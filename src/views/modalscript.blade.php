<script src="{{url('/vendor/modalizable/sweetalert.all.js')}}"></script>
<script src="{{url('/vendor/modalizable/modal2.js')}}"></script>
<script>
    @php
     $click= empty($click) ? "modalizable" : $click;
     $modal= empty($modal) ? "modalizableModal" : $modal;
     $autoSubmit= empty($autoSubmit) ? false : $autoSubmit;
    @endphp
        let modal;
    $(document).on('click','.{{$click}}',function () {
        var this_obj = $(this);
        modal = new Modal(this_obj,"{{$modal}}");
    });
    @if($autoSubmit)
    $(document).on('click','.'+modal.btnClass,function (e) {
        this_obj = $(this);
        e.preventDefault();
        var type = this_obj.data('type');
        var clearErrors = this_obj.data('clearerrors');
        var placeHolder = this_obj.data('placeholder');
        var closestForm = this_obj.closest('form');
        var serializedArray = new FormData(closestForm[0]);
        modal.swalMultipartSubmit(closestForm.attr('action'),serializedArray,type,clearErrors,placeHolder,closestForm,this_obj)
    });
    @endif
</script>
