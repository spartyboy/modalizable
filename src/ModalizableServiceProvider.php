<?php


namespace DragonSoftware\Modalizable;


use Illuminate\Support\ServiceProvider;

class ModalizableServiceProvider extends ServiceProvider
{
    public function boot(){
        $this->loadViewsFrom(__DIR__.'/views');
        $this->publishes([
            __DIR__.'/../public' => public_path('vendor/modalizable'),
        ], 'dragon_modal');
    }
    public function register()
    {

    }
}
