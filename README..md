## SchemaElTable

#### Attribute

```typescript
interface props {
  rowKey: String;
  columns: tableColumnsItem[];
  data: (e: parameter) => Promise<sourceData>;
  rowSelection?: (selection: any) => void;
  expand?: Boolean; // 开启 折叠扩展列
  index?: Boolean; // 开启序号列
  autoHeight?: Boolean; // 自动计算表格高度
  startColumnsFixed?: Boolean; // 左侧扩展列是否固定 优先级高于 indexFixed selectionFixed  expandFixed
  indexFixed?: Boolean; // 序号扩展列是否固定
  selectionFixed?: Boolean; // 选择扩展列是否固定
  expandFixed?: Boolean; // 展开行扩展列是否固定
  showPagination?: Boolean; // 展示分页
  keepReload?: Boolean; // 组件被缓存时 再次展示是否重载数据
  pagination?: ElPagination; // ElPagination props
}

interface tableColumnsItem {
  label: String; // 表头文字
  prop: String; // 数据索引字段
  width?: Number | String; // 表格宽度
  align?: String; // left | center | right
  fixed?: Boolean;
  showOverflowTooltip?: Boolean;
  slots?: tableColumnsItemSlots;
}

interface tableColumnsItemSlots {
  customRender?: String; // 内容模板插槽名
  customHeader?: String; // 自定义表头插槽名
}

interface parameter {
  currentPage: Number;
  pageSize: Number;
  sortField: String;
  sortOrder: String;
}

interface sourceData {
  currentPage: Number;
  total: Number;
  list: any[];
}
```

#### Features Event

```typescript
interface Event {
  expand?: (rows: any, rowList: []) => volid;
  expandClosed: (rows: any, rowList: []) => volid;
  // ...ElTable Events
}
```

#### Methods

```typescript
interface ScrollOptions {
  top?: Number;
  left?: Number;
}

interface Methods {
  refresh: (bool: Boolean) => volid; // 刷新表格数据 bool: { ture: 重置页码 }
  clearSelection: () => volid; // 清楚选中状态
  toggleRowSelection: (rowItem: any, flag: Boolean) => volid; // 改变数据选中状态
  initRowSelection: (selectRows: []) => volid; // 初始化选中数据
  setCurrentRow: (row: any) => volid; // 设定某一行为选中行
  sort: (prop: String, order: String) => volid; // 手动对 Table 进行排序。
  clearSort: () => volid; // 用于清空排序条件，数据会恢复成未排序的状态
  doLayout: () => volid; // 表格重新布局
  scrollTo: (options: ScrollOptions) => volid; // scrolls to a particular set of coordinates
  setScrollTop: (top: Number) => volid; // set vertical scroll position
  setScrollLeft: (left: Number) => volid; // set horizontal scroll position
}
```

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
