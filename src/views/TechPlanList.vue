<template>
  <div>
    <!-- Content Header (Page header) -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0 text-dark">教學資源管理</h1>
          </div>
          <!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item">
                <router-link to="/">首頁</router-link>
              </li>
              <li class="breadcrumb-item active">教學資源管理</li>
            </ol>
          </div>
          <!-- /.col -->
        </div>
        <!-- /.row -->
      </div>
      <!-- /.container-fluid -->
    </div>
    <!-- /.content-header -->

    <!-- <RankCharts v-if="ShowTechPlanRankCharts" :xValues="ChartsXValues" :yValues="ChartsYValues"/> -->

    <!-- Main content -->
    <section class="content" id="tabs">
      <div class="row">
        <div class="col-12 col-sm-12">
          <ul
            class="nav nav-tabs"
            id="custom-tabs-two-tab"
            role="tablist"
          >
            <li class="nav-item">
              <a
                class="nav-link active"
                id="custom-tabs-teachplan-tab"
                data-toggle="pill"
                href="#custom-tabs-teachplan"
                role="tab"
                aria-controls="custom-tabs-teachplan"
                aria-selected="true"
                onclick="window.model.updateTeachPlanMgtFlag(true)"
                >教學資源管理</a
              >
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                id="custom-tabs-teachplan-statistics-tab"
                data-toggle="pill"
                href="#custom-tabs-teachplan-statistics"
                role="tab"
                aria-controls="custom-tabs-teachplan-statistics"
                aria-selected="false"
                onclick="window.model.updateTeachPlanMgtFlag(false)"
                >教學資源統計</a
              >
            </li>
          </ul>
          <button v-if="teachPlanMgtFlag" class="btn btn-success pull-right" @click="create">
            新增
          </button>
        </div>
      </div>
      <div class="row" style="margin-top: 10px">
        <div class="col-12 col-sm-12">
          <div class="card">
            <div class="card-body">
              <div class="tab-content" id="custom-tabs-two-tabContent">
                <div
                  class="tab-pane fade active show"
                  id="custom-tabs-teachplan"
                  role="tabpanel"
                  aria-labelledby="custom-tabs-teachplan-tab"
                >
                  <div id="tabTeachPlan"></div>
                  <!-- <div id="tabRoles" v-auth="'Role'"></div> -->
                </div>
                <div
                  class="tab-pane fade"
                  id="custom-tabs-teachplan-statistics"
                  role="tabpanel"
                  aria-labelledby="custom-tabs-teachplan-statistics-tab"
                >
                  <!-- <DateIntervalPicker></DateIntervalPicker> -->
                  <el-date-picker
                    v-model="getDates" 
                    name="name"
                    type="daterange"
                    align="right"
                    unlink-panels range-separator="至"
                    start-placeholder="開始日期"
                    end-placeholder="結束日期"
                    value-format='yyyy-MM-dd'
                    :picker-options="pickerOptions">
                  </el-date-picker>
                  <br><br>
                  <div class="form-group">
                    <label>選擇下載檔案類型</label>
                    <select class="form-control" v-model="selectFileType">
                      <option value="xls">xls</option>
                      <option value="html">html</option>
                      <option value="pdf">pdf</option>
                    </select>
                  </div>
                  <ExcelExport
                    class   = "btn btn-default"
                    :data   = "teachPlanStatisticsExcelDatas"
                    :fields = "teachPlanStatisticsExcelField"
                    :type    = "selectFileType"
                    name    = "教學資源統計.xls">
                    下載教學資源統計
                  </ExcelExport>
                  <div id="tabTeachPlanStatistics"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- /.content -->
  </div>
</template>
<script>
import RankCharts from "../components/RankCharts.vue";
import ExcelExport from "../components/ExcelExport.vue";
export default {
  components: {
    RankCharts,
    ExcelExport
  },
  data() {
    return {
      selectFileType: 'xls',
      teachPlanStatisticsExcelField : {
        教學資源名稱 : 'TeachPlanName',
        下載次數 : 'TotalCount'
      },
      teachPlanStatisticsExcelDatas : [], 
      teachPlanMgtFlag: true,
      items: [],
      currentItem: '',
      ShowTechPlanRankCharts: true,
      ChartsXValues: [],
      ChartsYValues: [],
      getDates: '',
      pickerOptions: {
        shortcuts: [{
            text: '最近一週',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
            }
        }, {
            text: '最近30天',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
            }
        }, {
            text: '最近90天',
            onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
            }
        }]
      },
    };
  },
  mounted() {
    window.model = this;
    this.load();
  },
  watch: {
    getDates(val) {
      this.teachPlanStatistics(val[0], val[1]);
    }
  },
  methods: {
    async load() {
      var cols = [
        {
          title: "#",
          render: function (data, type, row, meta) {
            return meta.row + 1;
          },
        },
        { title: "教案名稱", data: "Name" },
        { title: "設計教師", data: "Teacher" },
        //{ title: "教師學校", data: "School" },
        {
          title: "教學領域",
          data: "Category",
          render: function (data, type, row, meta) {
            return data.Name;
          },
        },
        {
          title: "上下架狀態",
          data: "Active",
          render: function (data) {
            if (data) {
              return '<span class="badge badge-success">上架</span>';
            }
            return '<span class="badge badge-warning">隱藏</span>';
          },
        },
        {
          title: "建立時間",
          data: "CreateTime",
          render: window.Filter.dateFormat,
        },
        {
          title: "功能",
          data: "TeachPlanID",
          width: 180,
          render: function (data, type, row, meta) {
            return (
              '<button type="button" class="btn btn-default" onclick="window.model.editItem(' +
              data +
              ')">編輯</button>'
              + (row["Active"]
                ? '<button type="button" class="btn btn-default" onclick="window.model.updateItemPublishStatus(' +
                  data +
                  ')">隱藏</button>'
                : '<button type="button" class="btn btn-default" onclick="window.model.updateItemPublishStatus(' +
                  data +
                  ')">上架</button>')
              + '<button type="button" class="btn btn-default" onclick="window.model.deleteItem(' +
                  data +
              ')">刪除</button>'
            );
          },
        },
      ];

      this.teachPlanStatistics("", "");
      var categories = await this.$api.getTechPlanCategories();
      var response = await this.$api.getTechPlans();
      var catMap = {};
      categories.forEach((c) => (catMap[c.TeachPlanCategoryID] = c));
      response.forEach((t) => {
        t.Category = catMap[t.TeachPlanCategoryID];
      });
      this.createDataTable("#tabTeachPlan", cols, response, {
      });
      this.items = response;
    },
    updateTeachPlanMgtFlag(flag) {
      this.teachPlanMgtFlag = flag;
    },
    create() {
      this.$router.push("/techplan/new");
    },
    editItem(id){
      this.$router.push("/techplan/" + id);
    },
    async deleteItem(id) { 
      $.each(this.items, (i, r) => {
        if (r.TeachPlanID == id) {
          this.currentItem = r;
        }
      }); 
      if (this.currentItem) {
        confirm("請問要刪除此教學資源?", async (r) => {
          await this.$api.deleteTechPlan(id);
          this.load();
        });
      }
    },
    async updateItemPublishStatus(id) {      
      await this.$api.updateTechPlanPublishStatus(id);
      this.load();
    },
    async teachPlanStatistics(start, end) {
      var teachPlanStatisticsCols = [
        {
          title: "#",
          render: function (data, type, row, meta) {
            return meta.row + 1;
          },
        },
        { title: "教學資源名稱", data: "TeachPlanName" },
        { title: "下載次數", data: "TotalCount" },
      ];
      var statisticsResponse = await this.$api.getTeachPlanStatistics(start, end);
      this.teachPlanStatisticsExcelDatas = statisticsResponse;
      this.createDataTable("#tabTeachPlanStatistics", teachPlanStatisticsCols, statisticsResponse, {
      });
    },
  },
};
</script>