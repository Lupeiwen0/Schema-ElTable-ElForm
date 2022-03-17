<template>
  <el-switch
    style="width: 100%"
    :placeholder="placeholder"
    v-bind="$attrs"
    :options="localOptions"
    v-model:modelValue="localValue"
  ></el-switch>
</template>

<script>
export default {
  inheritAttrs: false,
};
</script>

<script setup>
import { watch, ref, computed } from 'vue'
import { ElSwitch } from "element-plus";
import { isEqual } from "@/utils/lodashChunk";

const props = defineProps({
  modelValue: [String, Number, Boolean],
  selectOptions: Array,
  placeholder: {
    type: String,
    default: "请选择",
  },
});
const emit = defineEmits(["update:modelValue"]);

const localValue = ref(null);
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
  newVal => {
    if (!isEqual(newVal, localValue.value)) localValue.value = newVal
  },
  {
    immediate: true
  }
)
</script>
