<template>
    <q-input v-bind="$attrs" :type="showPassword ? 'text' : 'password'">
        <template v-slot:append>
            <q-icon :name="showPassword ? mdiEye : mdiEyeOff" class="cursor-pointer" @click="toggleShowPassword" />
        </template>

        <!-- Pass all slots through to ChildComponent -->
        <template v-for="(_, slotName) in $slots" v-slot:[slotName]>
            <slot :name="slotName" />
        </template>
    </q-input>
</template>

<script setup>
import { mdiEye, mdiEyeOff } from "@mdi/js";

const showPassword = ref(false);
const toggleShowPassword = () => (showPassword.value = !showPassword.value);
</script>
