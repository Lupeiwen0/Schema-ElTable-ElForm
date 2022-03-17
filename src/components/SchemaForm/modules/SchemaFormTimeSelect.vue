<template>
  <el-time-select
    style="width: 100%"
    :placeholder="placeholder"
    v-bind="$attrs"
    v-model:modelValue="localValue"
  ></el-time-select>
</template>

<script>
export default {
  inheritAttrs: false,
};
</script>

<script setup>
import { watch, ref } from 'vue'
import { ElTimeSelect } from "element-plus";
import { isEqual } from "@/utils/lodashChunk";

const props = defineProps({
  modelValue: [String],
  placeholder: {
    type: String,
    default: "请选择",
  },
  selectOptions: Array,
});
const emit = defineEmits(["update:modelValue"]);
const localValue = ref(null);

watch(
  () => localValue.value,
  (newVal) => {
    if (!isEqual(newVal, props.modelValue))
      emit("update:modelValue", localValue.value);
  }
);
watch(
  () => props.modelValue,
  newVal => {
    if (!isEqual(newVal, localValue.value)) localValue.value = newVal
  },
  {
    immediate: true
  }
)
</script>
