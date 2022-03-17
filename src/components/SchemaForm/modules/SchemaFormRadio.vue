<template>
  <el-radio-group style="width: 100%" v-bind="$attrs" v-model:modelValue="localValue">
    <template v-for="item in localOptions">
      <el-radio-button v-if="item.type === 'button'" :label="item.value">
        {{
        item.label
        }}
      </el-radio-button>
      <el-radio v-else :label="item.value" :border="$attrs.border">
        {{
        item.label
        }}
      </el-radio>
    </template>
  </el-radio-group>
</template>

<script>
export default {
  inheritAttrs: false,
};
</script>

<script setup>
import { isEqual } from "@/utils/lodashChunk";
import { ElRadio, ElRadioGroup, ElRadioButton } from "element-plus";
import { watch, ref, computed } from 'vue'

const props = defineProps({
  modelValue: [String, Number],
  selectOptions: Array,
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
