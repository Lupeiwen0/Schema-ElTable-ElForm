<template>
  <div class="schema__form__textarea_container">
    <el-input
      style="width: 100%"
      :autosize="{ minRows: 4 }"
      :placeholder="placeholder"
      v-bind="$attrs"
      type="textarea"
      :model-value="props.modelValue"
      @input="inputHandler"
    ></el-input>
    <div
      class="schema__form__textarea__num-tips"
      v-if="localMaxlength"
    >{{ currentLength }}/{{ localMaxlength }}</div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
};
</script>

<script setup>
import { computed } from "vue";
import { ElInput } from "element-plus";

const props = defineProps({
  modelValue: String,
  autosize: {
    type: Object,
    default: () => ({ minRows: 4 }),
  },
  placeholder: {
    type: String,
    default: "请输入",
  },
  maxlength: {
    type: Number,
    default: -1,
  },
  selectOptions: Array,

});
const emit = defineEmits(["update:modelValue"]);
const inputHandler = (e) => {
  emit("update:modelValue", e);
};

const localMaxlength = computed(() => props.maxLength || 0);
const currentLength = computed(() => props.modelValue?.length || 0);
</script>

<style lang="scss">
.schema__form__textarea_container {
  position: relative;
  width: 100%;

  .schema__form__textarea__num-tips {
    position: absolute;
    bottom: -4px;
    right: 12px;
    color: #999;
    font-size: 10px;
    pointer-events: none;
  }
}
</style>
