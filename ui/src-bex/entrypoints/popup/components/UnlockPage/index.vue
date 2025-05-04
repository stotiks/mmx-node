<template>
    <q-page padding style="padding-top: 66px">
        <div class="fullscreen row justify-center">
            <q-card flat class="self-center col-xl-4 col-lg-6 col-md-8 col-sm-10 col-xs-10">
                <!-- <q-toolbar>
                    <q-toolbar-title>
                        <div class="row justify-center">Unlock</div>
                    </q-toolbar-title>
                </q-toolbar> -->
                <q-card-section>
                    <UnlockForm />
                </q-card-section>
            </q-card>
        </div>
    </q-page>
</template>

<script setup>
import UnlockForm from "./UnlockForm.vue";
</script>
