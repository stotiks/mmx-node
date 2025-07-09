<template>
    <q-markup-table flat>
        <tbody>
            <template v-for="(value, key) in data" :key="key">
                <tr v-if="key != '__type'">
                    <td class="key-cell m-bg-grey">{{ key }}</td>
                    <td class="textwarp mono">
                        <template v-if="value instanceof Object || key == 'source'">
                            <q-btn
                                v-if="isExpandable(value, key)"
                                :icon="!isExpanded(key) ? mdiArrowExpand : mdiArrowCollapse"
                                fab-mini
                                class="float-right"
                                @click="handleToggleExpand(key)"
                                :aria-label="isExpanded(key) ? 'Collapse' : 'Expand'"
                            />
                            <highlightjs
                                :code="stringify(value)"
                                :class="{ hljsCode: true, collapsed: !isExpanded(key) }"
                            />
                        </template>
                        <template v-else>
                            <template v-if="isAddress(value)">
                                <RouterLink :to="`/explore/address/${value}`" class="text-primary mono">
                                    {{ value }}
                                </RouterLink>
                            </template>
                            <template v-else-if="isHex(value)">
                                <q-btn
                                    :icon="!isExpanded(key) ? mdiArrowExpand : mdiArrowCollapse"
                                    fab-mini
                                    class="float-right"
                                    @click="handleToggleExpand(key)"
                                    :aria-label="isExpanded(key) ? 'Collapse hex dump' : 'Expand hex dump'"
                                />
                                <HexDump :data="value" :expanded="isExpanded(key)" />
                            </template>
                            <template v-else>
                                {{ value }}
                            </template>
                        </template>
                    </td>
                </tr>
            </template>
        </tbody>
    </q-markup-table>
</template>

<script setup>
import { mdiArrowExpand, mdiArrowCollapse } from "@mdi/js";
import HexDump from "@/components/UI/HexDump.vue";
import { stringify, isMMXAddress, isHexString, isExpandable } from "@/utils/dataFormatters";
import { useObjectTableExpansion } from "@/composables/useObjectTableExpansion";

const props = defineProps({
    data: {
        type: Object,
        default: null,
        validator: (value) => value === null || typeof value === "object",
    },
});

// Use the expansion composable
const { expanded, toggleExpansion, isExpanded } = useObjectTableExpansion();

// Wrapper function to maintain component API
const handleToggleExpand = (key) => {
    toggleExpansion(key);
};

// Use utility functions
const isAddress = isMMXAddress;
const isHex = isHexString;
</script>

<style lang="scss" scoped>
.textwarp {
    text-wrap: wrap;
    overflow-wrap: anywhere;
}

.collapsed {
    white-space: normal;
    /* font-size: 0.8em; */
}

:deep(.hljs) {
    background: transparent !important;
    padding: 0px !important;
}

:deep(pre.hljsCode) {
    margin: 0px !important;
}
</style>
