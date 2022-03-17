import { cloneDeep, debounce } from "@/utils/lodashChunk";
import { ElLoading, ElTable } from "element-plus";
import { h, resolveComponent } from "vue";

let TableLoadingInstance = null;

export default {
  name: "SchemaTable",
  data() {
    return {
      localInitFlag: false,
      selectedRows: [],
      localLoading: false,
      localData: [],
      localPagination: Object.assign(
        {},
        {
          currentPage: 1,
          pageSize: 10,
          total: 0,
          layout: "total,sizes,prev,pager,next,jumper",
          pageSizes: [5, 10, 20, 30, 40, 50],
          background: true,
          hideOnSinglePage: false, // 仅有一页时是否隐藏分页
        },
        this.pagination
      ),
      autoScrollHeight: "400px", // table 滚动高度
      expandStatusFields: {},
    };
  },
  props: Object.assign({}, ElTable.props, {
    // 渲染循环索引
    rowKey: {
      type: [String, Function],
      required: true,
    },
    // 数据
    data: {
      type: Function,
      required: true,
    },
    // 表格配置
    columns: {
      type: Array,
      default: () => [],
    },
    // 选中事件
    rowSelection: {
      type: Function,
    },
    // 展开行
    expand: {
      type: Boolean,
      default: false,
    },
    // 序号
    index: {
      type: Boolean,
      default: false,
    },
    // 自动设置最大高度
    autoHeight: {
      type: Boolean,
      default: false,
    },
    // 显示分页
    showPagination: {
      type: Boolean,
      default: true,
    },
    // 分页配置
    pagination: {
      type: Object,
      default: () => {},
    },
    // 组件被缓存时，重新载入时刷新列表
    keepReload: {
      type: Boolean,
      default: false,
    },
    // 左侧扩展列是否固定
    startColumnsFixed: {
      type: Boolean,
      default: false,
    },
    // 序号扩展列是否固定
    indexFixed: {
      type: Boolean,
      default: false,
    },
    // 选择扩展列是否固定
    selectionFixed: {
      type: Boolean,
      default: false,
    },
    // 展开行扩展列是否固定
    expandFixed: {
      type: Boolean,
      default: false,
    },
  }),
  computed: {
    paginationStyle() {
      return `box-sizing:border-box; width:100%; padding:10px; display:flex; flex-direction: 
      ${this.pagination?.position === "left" ? "row" : "row-reverse"};`;
    },
  },
  watch: {
    localLoading(newVal) {
      if (newVal) {
        if (TableLoadingInstance) return;
        this.$nextTick(() => {
          TableLoadingInstance = ElLoading.service({
            target: ".el-table__body-wrapper",
            background: "rgba(230,247,255,0.4)",
          });
        });
      } else {
        this.$nextTick(() => {
          // 以服务的方式调用的 Loading 需要异步关闭
          TableLoadingInstance.close();
          TableLoadingInstance = null;
        });
      }
    },
  },
  created() {
    this.loadData();
  },
  activated() {
    if (this.localInitFlag && this.keepReload) this.loadData();
    if (this.autoHeight) this.getTableScrollHeight();
    if (!this.localInitFlag) this.localInitFlag = true;
  },
  mounted() {
    if (this.autoHeight) {
      this.getTableScrollHeight();
      window.addEventListener("resize", this.getTableScrollHeight);
    }
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.getTableScrollHeight);
  },
  methods: {
    /**
     * 加载数据方法
     * @param {Object} pagination 分页选项器
     * @param {Object} filters 过滤条件
     * @param {Object} sorter 排序条件
     */
    loadData(pagination, filters, sorter) {
      this.localLoading = true;
      const parameter = Object.assign(
        {
          currentPage:
            (pagination && pagination.currentPage) ||
            this.localPagination.currentPage,
          pageSize:
            (pagination && pagination.pageSize) ||
            this.localPagination.pageSize,
        },
        (sorter && sorter.prop && { sortField: sorter.prop }) || {},
        (sorter && sorter.order && { sortOrder: sorter.order }) || {},
        { ...filters }
      );
      const result = this.data(parameter);
      // 对接自己的通用数据接口需要修改下方代码中的 r.currentPage, r.total, r.list
      // eslint-disable-next-line
      if (
        (typeof result === "object" || typeof result === "function") &&
        typeof result.then === "function"
      ) {
        result.then((r) => {
          this.localPagination = Object.assign({}, this.localPagination, {
            currentPage: r.currentPage, // 返回结果中的当前分页数
            total: r.total, // 返回结果中的总记录数
            pageSize:
              (pagination && pagination.pageSize) ||
              this.localPagination.pageSize,
          });
          // 为防止删除数据后导致页面当前页面数据长度为 0 ,自动翻页到上一页
          if (
            r.list &&
            r.list.length === 0 &&
            this.showPagination &&
            this.localPagination.currentPage > 1
          ) {
            this.localPagination.currentPage--;
            this.loadData();
            return;
          }
          this.localData = r.list || []; // 返回结果中的数组数据
          this.localLoading = false;
        });
      }
    },
    // 分页 页码改变
    paginationCurrentChange(current) {
      this.localPagination.currentPage = current;
      this.loadData();
    },
    // 分页 size 改变
    paginationSizeChange(pageSize) {
      this.localPagination.pageSize = pageSize;
      this.loadData();
    },
    // 获取table高度
    getTableScrollHeight: debounce(
      function () {
        this.$nextTick(() => {
          const windowClintHeight = document.documentElement.clientHeight;
          const tableRect = document
            .querySelector(".table-wrapper")
            ?.getBoundingClientRect();
          const footerRect = document
            .querySelector(".el-footer")
            .getBoundingClientRect();

          if (!tableRect) return;
          const tableHeight =
            windowClintHeight - tableRect.top - footerRect.height - 52;
          // 52 是 分页器高度
          this.autoScrollHeight = `${tableHeight < 350 ? 350 : tableHeight}px`;
        });
      },
      600,
      { leading: true }
    ),
    // 获取table columns
    getTableColumns(item) {
      if (Array.isArray(item.children) && item.children.length) {
        const attrs = {};
        Object.keys(item).forEach((key) => {
          if (key === "children" || key === "prop") return;
          attrs[key] = item[key];
        });
        return (
          <el-table-column showOverflowTooltip {...attrs}>
            {item.children.map((son) => this.getTableColumns(son))}
          </el-table-column>
        );
      } else {
        if (item.slots) {
          const TableColumn = resolveComponent("ElTableColumn");
          const slots = {};
          if (item.slots.customRender) {
            slots["default"] = (props) => {
              return (
                this.$slots[item.slots.customRender] &&
                this.$slots[item.slots.customRender](props)
              );
            };
          }
          if (item.slots.customHeader) {
            slots["header"] = (props) => {
              return (
                this.$slots[item.slots.customHeader] &&
                this.$slots[item.slots.customHeader](props)
              );
            };
          }
          return h(TableColumn, { showOverflowTooltip: true, ...item }, slots);
        } else {
          return (
            <el-table-column showOverflowTooltip {...item}></el-table-column>
          );
        }
      }
    },
    // 展开行
    expandChange(expandedRows, expanded) {
      if (!this.rowKey) return;
      if (this.expandStatusFields[expandedRows[this.rowKey]]) {
        this.$emit("expandClosed", expandedRows, expanded);
      } else {
        this.$emit("expand", expandedRows, expanded);
      }
      this.expandStatusFields[expandedRows[this.rowKey]] =
        !this.expandStatusFields[expandedRows[this.rowKey]];
    },
    // export Methods start=====================================================================================
    /**
     * 表格重新加载方法.
     * @param {Boolean} bool true 则重置页码
     */
    refresh(bool = false) {
      bool &&
        (this.localPagination = Object.assign({}, this.localPagination, {
          currentPage: 1,
          pageSize: this.pagination?.pageSize || 10,
        }));
      this.clearSelection();
      this.loadData();
    },
    // 清除选中状态
    clearSelection() {
      this.$refs["ElTableRef"].clearSelection();
    },
    // 切换行选中状态
    toggleRowSelection(rowItem, flag = null) {
      this.$refs["ElTableRef"].toggleRowSelection(rowItem, flag);
    },
    // 切换全选和全不选
    toggleAllSelection() {
      this.$refs["ElTableRef"].toggleAllSelection();
    },
    // 初始化选中数据
    initRowSelection(selectRows) {
      this.clearSelection();
      const selectRowsKeys = selectRows.map((item) => item[this.rowKey]);
      const tempRows = this.localData.filter((item) =>
        selectRowsKeys.includes(item[this.rowKey])
      );
      tempRows.forEach((item) => {
        this.toggleRowSelection(item, true);
      });
    },
    // 设定某一行为选中行
    setCurrentRow(row) {
      this.$refs["ElTableRef"].setCurrentRow(row);
    },
    // 手动对 Table 进行排序。
    sort(prop, order) {
      this.$refs["ElTableRef"].sort(prop, order);
    },
    // 用于清空排序条件，数据会恢复成未排序的状态
    clearSort() {
      this.$refs["ElTableRef"].clearSort();
    },
    // 表格重新布局
    doLayout() {
      this.$refs["ElTableRef"].doLayout();
    },
    // scrolls to a particular set of coordinates
    scrollTo({ top, left }) {
      this.$refs["ElTableRef"].scrollTo({ top, left });
    },
    // set vertical scroll position
    setScrollTop() {
      this.$refs["ElTableRef"].setScrollTop();
    },
    // set horizontal scroll position
    setScrollLeft() {
      this.$refs["ElTableRef"].setScrollLeft();
    },
    // export Methods end=====================================================================================
  },
  render() {
    const props = {};
    const localKeys = Object.keys(this.$data);
    // 合并localProps到Table的props中
    Object.keys(ElTable.props).forEach((k) => {
      const localKey = `local${k.substring(0, 1).toUpperCase()}${k.substring(
        1
      )}`;
      if (localKeys.includes(localKey)) {
        props[k] = this[localKey];
        return props[k];
      }
      this[k] && (props[k] = this[k]);
      return props[k];
    });
    // 初始化local配置
    const localColumns = cloneDeep(this.columns);
    // 添加索引序号
    if (this.index) {
      localColumns.unshift({
        type: "index",
        width: "50",
        align: "center",
        label: "#",
        fixed: this.startColumnsFixed || this.indexFixed,
      });
    }
    // 添加选择项
    if (typeof this.rowSelection === "function") {
      localColumns.unshift({
        type: "selection",
        width: "50",
        fixed: this.startColumnsFixed || this.selectionFixed,
      });
    }
    // 添加展开项
    if (this.expand) {
      localColumns.unshift({
        fixed: this.startColumnsFixed || this.expandFixed,
        type: "expand",
        width: "50",
        slots: { customRender: "expand" },
      });
    }
    // 表格Columns
    const tableColumns = localColumns.map((item) => this.getTableColumns(item));
    // 表格
    const table = (
      <el-table
        style="width: 100%;"
        ref="ElTableRef"
        stripe
        highlightCurrentRow
        max-height={this.autoHeight ? this.autoScrollHeight : "auto"}
        {...props}
        // 当表格的当前行发生变化的时候会触发该事件
        onCurrentChange={(currentRow, oldCurrentRow) => {
          this.setCurrentRow(currentRow);
          this.$emit("currentChange", currentRow, oldCurrentRow);
        }}
        // 多选 - 选中变化
        onSelectionChange={(selection) => {
          if (typeof this.rowSelection === "function") {
            this.rowSelection(selection);
          }
        }}
        // 展开行
        onExpandChange={(expandedRows, expanded) => {
          this.expandChange(expandedRows, expanded);
        }}
        // 排序
        onSortChange={(sortProp) => {
          this.loadData(null, {}, sortProp);
        }}
        // 筛选
        onFilterChange={(filters) => {
          this.$emit("filterChange", filters);
        }}
        // 行双击
        onRowDblclick={(row, column, event) => {
          this.$emit("row-dblclick", row, column, event);
        }}
        // 行 点击
        onRowClick={(row, column, event) => {
          this.toggleRowSelection(row);
          this.$emit("row-click", row, column, event);
        }}
        // 行 右击
        onRowContextmenu={(row, column, event) => {
          this.$emit("row-contextmenu", row, column, event);
        }}
        // 单元格 点击
        onCellClick={(row, column, event) => {
          this.$emit("cell-click", row, column, event);
        }}
        // 单元格双击
        onCellDblclick={(row, column, event) => {
          this.$emit("cell-dblclick", row, column, event);
        }}
        // 单元格 右击
        onCellContextmenu={(row, column, event) => {
          this.$emit("cell-contextmenu", row, column, event);
        }}
      >
        {tableColumns}
      </el-table>
    );
    // 分页
    const pagination = (
      <el-pagination
        {...this.localPagination}
        onCurrentChange={(current) => {
          this.paginationCurrentChange(current);
        }}
        onSizeChange={(pageSize) => {
          this.paginationSizeChange(pageSize);
        }}
      ></el-pagination>
    );
    return (
      <div class="table-wrapper">
        {table}
        {this.showPagination && (
          <div style={this.paginationStyle}>{pagination}</div>
        )}
      </div>
    );
  },
};
