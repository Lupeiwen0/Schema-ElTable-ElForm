## SchemaElTable

#### Attribute

```typescript
interface props {
  rowKey: String;
  columns: tableColumnsItem[];
  data: (e: parameter) => Promise<sourceData>;
  selection?: Boolean; // 开启 多选
  expand?: Boolean; // 开启 折叠扩展列
  index?: Boolean; // 开启序号列
  selectedRows?: Array; // 选中的数据 v-model:selectedRows
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

## Example of SchemaElTable

```html
<template>
  <SchemaElTable
    ref="SchemaTableRef"
    index
    expand
    selection
    autoHeight
    rowKey="id"
    startColumnsFixed
    :data="loadData"
    :columns="columns"
    v-model:selectedRows="selectedRows"
    @expand="expandHandler"
  >
    <template #actionHeader> 操 作 </template>
    <template #action="scope">
      <span @click.stop="editHandler(scope.row)">编辑</span>
      <span @click.stop="delHandler(scope.row)">删除</span>
    </template>
    <template #expand="scope">
      <span>{{ scope.row.name }}</span>
    </template>
  </SchemaElTable>
</template>
```

```javascript
import { SchemaElTable } from "schema-eltable-elform";

function getTableList() {
  return new Promise((resolve) => {
    const rows = [
      {
        id: 1,
        name: "小兮",
        gender1: 18,
        gender2: 19,
        gender3: 40,
        age: 18,
      },
    ];
    return { currentPage: 1, total: 1, list: rows };
  });
}

export default {
  components: {
    SchemaElTable,
  },
  setup() {
    // 表格 ref
    const SchemaTableRef = ref(null);
    // 选中行数据
    const selectedRows = ref([]);
    // 表格列 配置项
    const columns = [
      {
        width: 50,
        label: "id",
        prop: "id",
        align: "center",
        fixed: true,
      },
      {
        width: 80,
        label: "姓名",
        prop: "name",
        align: "center",
      },
      {
        label: "性别",
        align: "center",
        children: [
          {
            label: "男",
            align: "center",
            children: [
              {
                width: 80,
                label: "18+",
                prop: "gender1",
                align: "center",
              },
              {
                width: 80,
                label: "18-",
                prop: "gender2",
                align: "center",
              },
            ],
          },
          {
            width: 80,
            label: "女",
            prop: "gender3",
            align: "center",
          },
        ],
      },
      {
        width: 80,
        label: "年龄",
        prop: "age",
        align: "center",
      },
      {
        width: 150,
        fixed: "right",
        label: "操作",
        prop: "id",
        align: "center",
        slots: { customRender: "action", customHeader: "actionHeader" },
      },
    ];
    // 加载数据
    const loadData = (parameter) => {
      // 这里可以对搜索参数做一些格式化的操作
      const newQueryInfo = unref(queryInfo).map((i) => ({ ...i }));
      return getTableList(Object.assign({}, newQueryInfo, parameter)).then(
        (res) => res.data
      );
    };
    // 编辑事件
    const editHandler = (row) => {
      // clone数据，避免表单编辑时更改table中的数据
      console.log("editHandler: ", row);
    };
    // 删除事件
    const delHandler = (row) => {
      console.log("delHandler: ", row);
    };
    // 重置事件
    const restTable = () => SchemaTableRef.value.refresh();

    const expandHandler = (expandedRows, expanded) => {
      console.log("expandHandler", { expandedRows, expanded });
    };

    return {
      SchemaTableRef,
      selectedRows,
      columns,
      loadData,
      editHandler,
      delHandler,
      restTable,
      expandHandler,
    };
  },
};
```

## Example of SchemaElForm

```html
<template>
  <SchemaForm
    ref="SchemaElFormRef"
    :fields="fields"
    :rules="SchemaFormRules"
    :form-schema="dynamicForm"
    :selectOptions="SchemaFormSelectOptions"
    :label-width="120"
  ></SchemaForm>
</template>
```

```javascript
import { SchemaElForm } from "schema-eltable-elform";

export const getFormSchema = () => [
  {
    field: "name",
    type: "input",
    props: { label: "姓名" },
    layout: { xs: 24, sm: 12, md: 8 },
  },
  {
    field: "gender",
    type: "select",
    props: { label: "性别" },
    layout: { xs: 24, sm: 12, md: 8 },
    attr: {
      onChange: (e) => {
        console.log("on-change: ", e);
      },
    },
  },
  {
    field: "age",
    type: "input",
    props: { label: "年龄" },
    layout: { xs: 24, sm: 12, md: 8 },
    attr: {
      controlsPosition: "right",
      placeholder: "请输入",
    },
  },
  {
    field: "height",
    type: "input-number",
    props: { label: "身高" },
    layout: { xs: 24, sm: 12, md: 8 },
    attr: {
      controlsPosition: "right",
      placeholder: "请输入",
    },
  },
  {
    field: "birthday",
    type: "date-picker",
    props: { label: "出生日期" },
    layout: { xs: 24, sm: 12, md: 8 },
    attr: {
      type: "daterange",
      format: "YYYY-MM-DD HH:mm",
      valueFormat: "YYYY-MM-DD HH:mm",
      placeholder: "请选择",
    },
  },
  {
    field: "eatDinnerTime",
    type: "time-picker",
    props: { label: "用餐时间" },
    layout: { xs: 24, sm: 12, md: 8 },
    attr: {
      isRange: true,
      format: "HH:mm",
      valueFormat: "HH:mm",
      placeholder: "请选择",
    },
  },
  {
    field: "workingTime",
    type: "time-select",
    props: { label: "上班时间" },
    layout: { xs: 24, sm: 12, md: 8 },
    attr: {
      start: "07:00",
      end: "13:00",
      step: "00:30",
      placeholder: "请选择时间",
    },
  },
  {
    field: "single",
    type: "switch",
    props: { label: "是否单身" },
    layout: { xs: 24, sm: 12, md: 8 },
    attr: {
      activeText: "是",
      inactiveText: "否",
    },
  },
  {
    field: "loveHistory",
    type: "radio",
    props: { label: "有无恋爱经验" },
    layout: { xs: 24, sm: 12, md: 8 },
  },
  {
    field: "occupation",
    type: "checkbox",
    props: { label: "主要经济来源" },
    layout: { xs: 24, sm: 12, md: 8 },
  },
  {
    field: "like",
    type: "cascader",
    props: { label: "兴趣爱好" },
    layout: { xs: 24, sm: 12, md: 8 },
    attr: {
      showAllLevels: false,
      clearable: true,
      collapseTags: true,
      props: {
        expandTrigger: "hover",
        emitPath: false,
        multiple: true,
      },
    },
  },
  {
    field: "desc",
    type: "textarea",
    props: { label: "简介" },
    layout: { span: 24 },
    attr: {
      maxLength: 30,
      placeholder: "请输入内容",
    },
  },
  {
    field: "selfFile",
    type: createVNode(UploadFile, {
      listType: "text",
      multiple: true,
      uploadFn: fileUploadApi,
      uploadParams: { type: 1 },
      onRemove: (file) => console.log("fileRemove: ", file),
    }),
    props: { label: "本人生活照" },
    layout: { span: 24 },
  },
];

export default {
  components: {
    SchemaElForm,
  },
  setup() {
    const SchemaElFormRef = ref(null);
    const fields = reactive({
      name: "小明",
      gender: 1,
      occupation: [],
    });
    const dynamicForm = getFormSchema();

    const SchemaFormRules = ref({
      name: [{ required: true, message: "请输入姓名", trigger: ["blur"] }],
      gender: [{ required: true, message: "请选择性别", trigger: ["change"] }],
      age: [
        { required: false, message: "请输入年龄", trigger: ["change"] },
        { pattern: /^\d{1,}$/, message: "只能输入正整数", trigger: ["change"] },
      ],
      desc: [{ required: true, message: "请输入个人简介", trigger: ["blur"] }],
    });

    const SchemaFormSelectOptions = reactive({
      gender: [
        { label: "女", value: 0, customLabel: "0-女" },
        { label: "男", value: 1 },
      ],
      loveHistory: [
        { label: "工作", value: 0 },
        { label: "其他", value: 1 },
      ],
      occupation: [
        { label: "上班", value: 0 },
        { label: "啃老", value: 1 },
      ],
      like: [
        {
          label: "声乐",
          value: "1",
          children: [
            {
              value: "1-1",
              label: "乐器",
              children: [
                { label: "吉他", value: "1-1-1" },
                { label: "钢琴", value: "1-1-2" },
              ],
            },
            {
              value: "1-2",
              label: "舞蹈",
              children: [
                { label: "宅舞", value: "1-2-1" },
                { label: "民族舞", value: "1-2-2" },
              ],
            },
          ],
        },
        {
          label: "表演",
          value: "2",
          children: [
            {
              value: "2-1",
              label: "话剧",
              children: [
                { label: "抒情", value: "2-1-1" },
                { label: "历史", value: "2-1-2" },
              ],
            },
          ],
        },
      ],
    });

    const confirmHandler = () => {
      SchemaElFormRef.value
        .validate((valid, form) => {
          console.log(valid, form);
        })
        .catch((err) => {
          // 捕获校验未通过数据并使页面滚动到相应位置
          const { valid, fields, arg } = err;
          const validKeys = Object.keys(arg);
          SchemaElFormRef.value.scrollToField(validKeys[0]);
        });
    };
    const restHandler = () => {
      SchemaElFormRef.value.resetFields();
    };

    return {
      dynamicForm,
      SchemaFormRules,
      SchemaFormSelectOptions,
      confirmHandler,
      restHandler,
    };
  },
};
```
