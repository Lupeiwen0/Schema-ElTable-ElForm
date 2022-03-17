<template>
  <el-select
    style="width: 100%"
    :placeholder="placeholder"
    v-bind="$attrs"
    :options="localOptions"
    v-model:modelValue="localValue"
  >
    <template v-for="item in localOptions">
      <el-option
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled"
      >{{ item.customLabel || item.label }}</el-option>
    </template>
  </el-select>
</template>

<script>
export default {
  inheritAttrs: false,
};
</script>

<script setup>
import { ref, computed, watch } from "vue";
import { ElSelect, ElOption } from "element-plus";
import { isEqual } from "@/utils/lodashChunk";

const props = defineProps({
  modelValue: [String, Number],
  selectOptions: Array,
  placeholder: {
    type: String,
    default: "请选择",
  },
});
const emit = defineEmits(["update:modelValue"]);

const localValue = ref("");
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
