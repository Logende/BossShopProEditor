<template>
<div>
    <h1 class="mb-3">Settings</h1>
    <v-checkbox label="Avanced Features" v-model="etShopAdv" @change="update()"></v-checkbox>
    <v-checkbox label="Conditions" v-model="etConditions" @change="update()"></v-checkbox>
    <v-checkbox label="Different ClickTypes" v-model="etClickTypes" @change="update()"></v-checkbox>
    <v-checkbox label="PlayerInput" v-model="etPlayerInput" @change="update()"></v-checkbox>
    <v-checkbox label="Sounds" v-model="etSounds" @change="update()"></v-checkbox>
    <v-checkbox label="ItemShop Addon" v-model="etItemshop" @change="update()"></v-checkbox>
    <v-checkbox label="ItemShop Addon Advanced Features" v-model="etItemshopAdv" @change="update()"></v-checkbox>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import YAML from 'js-yaml';
import Component from 'vue-class-component';
import _ from 'lodash';
import { data } from '@/data/Data';

@Component
export default class Settings extends Vue {

    public etItemshop: boolean = data.etItemshop;
    public etItemshopAdv: boolean = data.etItemshopAdv;
    public etShopAdv: boolean = data.etShopAdvShop;
    public etConditions: boolean = data.etConditions;
    public etClickTypes: boolean = data.etClickTypes;
    public etPlayerInput: boolean = data.etPlayerInput;
    public etSounds: boolean = data.etSoundsShop;


    private update(){
        data.etItemshop = this.etItemshop;
        data.etItemshopAdv = this.etItemshopAdv;
        data.etShopAdvShop = this.etShopAdv;
        data.etShopAdvShopItem = this.etShopAdv;
        data.etConditions = this.etConditions;
        data.etClickTypes = this.etClickTypes;
        data.etPlayerInput = this.etPlayerInput;
        data.etSoundsShop = this.etSounds;
        data.etSoundsShopItem = this.etSounds;
        data.update();
    }

}
</script>

