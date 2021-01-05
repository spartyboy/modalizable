<script src="{{url('/vendor/modalizable/modal2.js')}}"></script>
<script>
    @php
     $click= empty($click) ? "modalizable" : $click;
     $modal= empty($modal) ? "modalizableModal" : $modal;
    @endphp
    $(document).on('click','.{{$click}}',function () {
        var this_obj = $(this);
        new Modal(this_obj,"{{$modal}}");
    });
</script>
