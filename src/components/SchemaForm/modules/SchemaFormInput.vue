<template>
  <el-input
    style="width: 100%"
    :placeholder="placeholder"
    v-bind="$attrs"
    :modelValue="props.modelValue"
    @input="inputHandler"
  ></el-input>
</template>

<script>
export default {
  inheritAttrs: false,
};
</script>

<script setup>
import { ElInput } from "element-plus";

const props = defineProps({
  modelValue: [String, Number],
  selectOptions: Array,
  placeholder: {
    type: String,
    default: "请输入",
  },
});
const emit = defineEmits(["update:modelValue"]);
const inputHandler = (e) => {
  emit("update:modelValue", e);
};
</script>
