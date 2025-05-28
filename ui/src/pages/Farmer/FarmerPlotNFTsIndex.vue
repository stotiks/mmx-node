<template>
    <q-card flat style="background-color: transparent">
        <FarmerMenu />
        <div class="q-pt-sm q-gutter-y-sm">
            <template v-for="item in list" :key="item">
                <PlotNFTInfo :address="item[0]" :data="item[1]" />
            </template>

            <template v-if="list && !list.length">
                <q-banner rounded>
                    <template v-slot:avatar>
                        <q-icon :name="mdiAlert" color="warning" />
                    </template>
                    {{ t("farmer_plotnfts_index.no_nft_plots") }}
                </q-banner>

                <q-banner rounded>
                    <template v-slot:avatar>
                        <q-icon :name="mdiInformation" color="info" />
                    </template>
                    {{ t("farmer_plotnfts_index.need_create_plotnft") }}
                </q-banner>
            </template>
        </div>
    </q-card>
</template>

<script setup>
import { mdiAlert, mdiInformation } from "@mdi/js";
import FarmerMenu from "../FarmerPage/FarmerMenu";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

import PlotNFTInfo from "./PlotNFTInfo.vue";

import { useFarmInfo } from "@/queries/wapi";
const { data, loading } = useFarmInfo();

const list = computed(() => data.value?.pool_info ?? []);
</script>
