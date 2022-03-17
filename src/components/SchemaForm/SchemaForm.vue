<template>
  <el-form
    :validateOnRuleChange="false"
    v-bind="$attrs"
    :ref="setSchemaFormRef"
    :model="fields"
    :rules="rules"
  >
    <el-row type="flex" :gutter="10" class="schema__form__body">
      <template v-for="formItem in localFormSchema" :key="formItem.field">
        <el-col v-bind="{ ...formItem.layout }">
          <el-form-item v-bind="{ ...formItem.props }" :prop="formItem.field">
            <template v-if="formItem.type !== 'slot'">
              <component
                :is="getComponent(formItem.type)"
                v-bind="formItem.attr"
                :selectOptions="selectOptions[formItem.field]"
                v-model:modelValue="fields[formItem.field]"
              ></component>
            </template>
            <template v-else>
              <slot :name="formItem.field" :formItem="formItem"></slot>
            </template>
          </el-form-item>
        </el-col>
      </template>
    </el-row>
  </el-form>
</template>

<script>
import { ref, isReactive, isRef, computed } from "vue";
import { ElRow, ElCol, ElForm, ElFormItem } from "element-plus";
import { cloneDeep } from "@/utils/lodashChunk";

import modules from "./modules";

export default {
  name: "SchemaForm",
  inheritAttrs: false,
  components: {
    ElRow,
    ElCol,
    ElForm,
    ElFormItem,
    ...modules,
  },
  props: {
    formSchema: {
      required: true,
      type: [Array, Object],
    },
    fields: {
      required: true,
      type: Object,
    },
    selectOptions: {
      type: Object,
      default: () => ({}),
    },
    rules: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { emit }) {
    // form ref
    const SchemaFormRef = ref(null);
    const setSchemaFormRef = (el) => (SchemaFormRef.value = el);

    // 过滤本地显示数据
    const localFormSchema = computed(() =>
      props.formSchema.map(item => {
        let localItem = cloneDeep(item)
        if (typeof localItem?.hidden === 'function') localItem.hidden = localItem.hidden()
        if (typeof localItem?.attr?.disabled === 'function') localItem.attr.disabled = localItem.attr.disabled()
        return localItem
      }).filter(i => !i.hidden)
    )

    // 预设组件索引
    const preset = [
      "input",
      "textarea",
      "select",
      "radio",
      "checkbox",
      "input-number",
      "switch",
      "cascader",
      "date-picker",
      "time-picker",
      "time-select",
    ];
    // 获取组件
    const getComponent = (type) => {
      // 预设组件
      if (preset.includes(type)) {
        return "schema-form-" + type;
      } else if (isReactive(type) || isRef(type)) {
        // 自定义组件
        return createVNode(type);
      } else {
        // 不识别组件
        return type;
      }
    };

    // 校验表单
    const validate = (callback) => {
      return new Promise((resolve, reject) => {
        SchemaFormRef.value.validate((valid, arg) => {
          if (valid) {
            callback && callback(valid, props.fields, arg);
            resolve(valid, props.fields, arg);
          } else {
            reject({
              valid,
              fields: props.fields,
              arg
            });
          }
        });
      });
    };
    // 清除表单校验
    const clearValidate = () => SchemaFormRef.value.clearValidate()
    // 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
    const resetFields = () => SchemaFormRef.value.resetFields()
    // 滚动到指定表单字段
    const scrollToField = (prop) => SchemaFormRef.value.scrollToField(prop)

    return {
      SchemaFormRef,
      localFormSchema,
      setSchemaFormRef,
      getComponent,
      validate,
      clearValidate,
      resetFields,
      scrollToField
    };
  },
};
</script>
