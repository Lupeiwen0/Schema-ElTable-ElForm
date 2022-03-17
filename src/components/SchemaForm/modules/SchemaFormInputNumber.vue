<template>
  <el-input-number
    style="width: 100%"
    v-bind="$attrs"
    :modelValue="props.modelValue"
    @input="inputHandler"
  ></el-input-number>
</template>

<script>
export default {
  inheritAttrs: false,
};
</script>

<script setup>
import { ElInputNumber } from "element-plus";

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  placeholder: {
    type: String,
    default: "请输入",
  },
  selectOptions: Array,
});
const emit = defineEmits(["update:modelValue"]);
const inputHandler = (e) => {
  emit("update:modelValue", e);
};
</script>
