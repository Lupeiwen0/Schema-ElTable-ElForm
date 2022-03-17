<template>
  <el-date-picker
    style="width: 100%"
    :placeholder="placeholder"
    :startPlaceholder="startPlaceholder"
    :endPlaceholder="endPlaceholder"
    v-bind="$attrs"
    v-model:modelValue="localValue"
  ></el-date-picker>
</template>

<script>
export default {
  inheritAttrs: false,
};
</script>

<script setup>
import { ref, watch } from "vue";
import { ElDatePicker } from "element-plus";
import { isEqual } from "@/utils/lodashChunk";

const props = defineProps({
  modelValue: [Object, Array, String],
  placeholder: {
    type: String,
    default: "请选择",
  },
  startPlaceholder: {
    type: String,
    default: "请选择开始时间",
  },
  endPlaceholder: {
    type: String,
    default: "请选择结束时间",
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
