## SchemaElForm

#### Attribute

```typescript
// 表单配置
interface formSchema: formItem[]
// 表单数据
interface fields { [key: string]: any }
// 表单为选择类型时的选择数据
interface selectOptions: formItemOptions[]
// 表单校验规则
interface rules extends ElFormRules // Element-plus form rules


interface formItem {
  field: String
  type:
    | 'input'
    | 'textarea'
    | 'select'
    | 'radio'
    | 'checkbox'
    | 'input-number'
    | 'switch'
    | 'cascader'
    | 'date-picker'
    | 'time-picker'
    | 'time-select'
    | VNode,
  props?: ElFormItem
  attr?: { [key: string]: any } // type对应组件的props属性 及 事件(例： @change => onChange)
  layout?: { [key: string]: any } // Element-plus ElCol props
}

interface formItemOptions {
  label: String
  value: String | Number,
  children?: []
}
```
