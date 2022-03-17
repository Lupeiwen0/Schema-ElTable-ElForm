<template>
  <el-checkbox-group
    style="width: 100%"
    :placeholder="placeholder"
    v-bind="$attrs"
    v-model:modelValue="localValue"
  >
    <template v-for="item in localOptions">
      <el-checkbox-button
        v-if="item.type === 'button'"
        :label="item.value"
        :disabled="item.disabled"
      >{{ item.label }}</el-checkbox-button>
      <el-checkbox v-else :label="item.value" :disabled="item?.disabled">{{ item.label }}</el-checkbox>
    </template>
  </el-checkbox-group>
</template>

<script>
export default {
  inheritAttrs: false,
};
</script>

<script setup>
import { computed, watch, ref } from "vue";
import { isEqual } from "@/utils/lodashChunk";
import { ElCheckbox, ElCheckboxButton, ElCheckboxGroup } from "element-plus";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  selectOptions: Array,
  placeholder: {
    type: String,
    default: "请选择",
  },
});
const emit = defineEmits(["update:modelValue"]);

const localValue = ref([]);
const localOptions = computed(() => props.selectOptions || []);

watch(
  () => localValue.value,
  (newVal) => {
    if (!isEqual(newVal, props.modelValue))
      emit("update:modelValue", localValue.value);
  }
);
watch(
  () => props.modelValue,
  (newVal) => {
    if (!isEqual(newVal, localValue.value)) localValue.value = newVal;
  },
  {
    immediate: true,
  }
);
</script>
