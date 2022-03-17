<template>
  <el-cascader
    style="width: 100%"
    :placeholder="placeholder"
    v-bind="$attrs"
    :options="localOptions"
    v-model:modelValue="localValue"
  ></el-cascader>
</template>

<script>
export default {
  inheritAttrs: false,
};
</script>

<script setup>
import { watch, ref, computed } from 'vue'
import { isEqual } from "@/utils/lodashChunk";
import { ElCascader } from "element-plus";

const props = defineProps({
  modelValue: Array,
  selectOptions: Array,
  placeholder: {
    type: String,
    default: '请选择'
  }
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
