<template>
  <div>
    <!-- Content Header (Page header) -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0 text-dark">教學資源內容管理</h1>
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

    <!-- Main content -->
    <section class="content" id="doc">
      <div class="container-fluid">
        <div class="card card-info">
          <div class="card-header">
            <h3 class="card-title">{{ Title }}</h3>
          </div>
          <!-- /.card-header -->
          <!-- form start -->
          <div class="card-body">
            <form role="form">
              <div class="form-group">
                <label>教案名稱</label>
                <input
                  type="text"
                  class="form-control"
                  required
                  placeholder="請輸入教案名稱，最多100個字"
                  maxlength="100"
                  v-model="techplan.Name"
                />
              </div>
              <div class="form-group">
                <label>設計者</label>
                <input
                  type="text"
                  class="form-control"
                  required
                  placeholder="請輸入設計者，最多50個字"
                  maxlength="50"
                  v-model="techplan.Teacher"
                />
              </div>
              <div class="form-group" v-if="false">
                <label>學校</label>
                <input
                  type="text"
                  class="form-control"
                  v-if="false"
                  v-model="techplan.School"
                />
              </div>
              <div class="form-group">
                <label>教學領域</label>
                <select
                  class="form-control"
                  required
                  v-model="techplan.TeachPlanCategoryID"
                >
                  <option
                    :value="c.TeachPlanCategoryID"
                    v-for="c in Categories"
                    :key="c.TeachPlanCategoryID"
                  >
                    {{ c.Name }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>適用對象</label>
                <input
                  type="text"
                  class="form-control"
                  required
                  v-model="techplan.Domain"
                />
              </div>
              <div class="form-group">
                <label>外部連結</label>
                <input
                  type="text"
                  class="form-control"
                  required
                  v-model="techplan.ExternalLink"
                />
              </div>
              <div class="form-group" v-if="false">
                <label>欣賞影片</label>
                <input
                  type="text"
                  class="form-control"
                  required
                  v-model="techplan.VideoName"
                />
              </div>
              <div class="form-group">
                <label>教學簡介</label>
                <textarea
                  rows="8"
                  class="form-control"
                  required
                  v-ckeditor="techplan.Goal"
                />
              </div>
              <div class="form-group">
                <label>教案上傳</label>
                <div class="input-group">
                  <div class="drag-area" @dragover="fileDragover" @drop="fileDrop">
                    <div class="uploader-tips" id="upload-drag-plan-file">
                      <span>將文件拖曳至此</span>
                    </div>
                  </div>
                  <div class="filebox">
                    <p v-if="FileList.length < 1">暫無檔案</p>
                    <ol>
                        <li v-for="(item, index) in FileList" :key="index">
                          {{item.FileName}}
                            <button
                            class="btn btn-default"
                            @click="download(item.FileUrl)"
                            >
                              下載
                            </button>
                            <button
                            class="btn btn-default"
                            @click="fileRemove(index)"
                            >
                              移除
                            </button>
                        </li>
                    </ol>
                  </div>
                </div>
                <div
                  class="progress progress-xxs mb-3"
                  v-if="planfile.Status > 0"
                >
                  <div
                    class="progress-bar bg-success"
                    role="progressbar"
                    :aria-valuenow="planfile.Progress"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    :style="`width: ${planfile.Progress}%`"
                  ></div>
                </div>
              </div>
              <div class="form-group">
                <label>學習單上傳</label>
                <div class="input-group">
                  <div class="custom-file">
                    <input
                      type="text"
                      class="form-control"
                      v-model="learnsheet.SrcFileName"
                      disabled
                    />
                  </div>
                  <div class="input-group-append">
                    <button
                      class="input-group-text"
                      @click="download(learnsheet.Url)"
                    >
                      下載
                    </button>
                    <button
                      class="input-group-text"
                      id="upload-learn-sheet-file"
                    >
                      上傳
                    </button>
                  </div>
                </div>
                <div
                  class="progress progress-xxs mb-3"
                  v-if="learnsheet.Status > 0"
                >
                  <div
                    class="progress-bar bg-success"
                    role="progressbar"
                    :aria-valuenow="learnsheet.Progress"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    :style="`width: ${learnsheet.Progress}%`"
                  ></div>
                </div>
              </div>
              <div class="form-group">
                <label>線上師培課程</label>
                <select
                  class="form-control"
                  v-model="techplan.LessonID"
                >
                  <option :value="null">無</option>
                  <option
                    :value="c.LessonID"
                    v-for="c in Lessons"
                    :key="c.LessonID"
                  >
                    {{ c.LessonName }}
                  </option>
                </select>
              </div>
              <!-- /.card-body -->
            </form>
          </div>
          <div class="card-footer">
            <button
              type="button"
              class="btn btn-primary pull-right w150"
              @click="save()"
            >
              儲存
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- /.content -->
  </div>
</template>
<script>
import $ from "jquery";
export default {
  data() {
    return {
      MAX_FILE_SIZE: 20 * 1000 * 1000,
      FileList: [],
      Title: "",
      Categories: [],
      techplan: {
        IsNew: true,
        Title: "",
        Content: "",
        LessonID: null,
        TeachPlanFiles: [],
      },
      planfile: {
        Status: 0,
        CancelToken: null,
        Progress: 0,
        SrcFileName: "",
        Url: "",
        File: null,
      },
      learnsheet: {
        Status: 0,
        CancelToken: null,
        Progress: 0,
        SrcFileName: "",
        Url: "",
        File: null,
      },
      video: {
        Status: 0,
        CancelToken: null,
        Progress: 0,
        SrcFileName: "",
        Url: "",
        File: null,
      },
      Lessons: [],
    };
  },
  async mounted() {
    window.model = this;
    this.Categories = await this.$api.getTechPlanCategories();
    this.Lessons = (await this.$api.getLessons()).filter(
      (x) => x.LessonCategoryID == 1
    );
    this.techplan.IsNew = this.$route.params.id == "new";
    if (!this.techplan.IsNew) {
      var doc = await this.$api.getTechPlan(this.$route.params.id);
      this.techplan = $.extend(this.techplan, doc);
      this.techplan.TeachPlanFiles.forEach((file) => {
        this.FileList.push({
          FileName: file.Name,
          FileUrl: file.Url,
        });
      });
      this.planfile.Url = this.techplan.TeachPlanUrl;
      this.planfile.SrcFileName = this.techplan.TeachPlanFileName;
      this.learnsheet.Url = this.techplan.LearnSheetUrl;
      this.learnsheet.SrcFileName = this.techplan.LearnSheetFileName;
      this.video.Url = this.techplan.VideoUrl;
      this.video.SrcFileName = this.techplan.VideoFileName;
      this.Title = "編輯教學資源";
    } else {
      this.Title = "新增教學資源";
    }
    this.load();

    this.$nextTick(() => {
      this.fileUpload(
        "#upload-learn-sheet-file",
        this.callback(this.learnsheet, "/api/backend/UploadLearnSheetFile", "learnSheet")
      );
    });
  },
  methods: {
    async load() {},
    async save() {
      if (!this.validate("#doc")) {
        return;
      }
      if (this.planfile.Status == 2) {
        this.techplan.TeachPlanUrl = this.planfile.Url;
        this.techplan.TeachPlanFileName = this.planfile.SrcFileName;
      }
      if (this.learnsheet.Status == 2) {
        this.techplan.LearnSheetUrl = this.learnsheet.Url;
        this.techplan.LearnSheetFileName = this.learnsheet.SrcFileName;
      }
      if (this.video.Status == 2) {
        this.techplan.VideoUrl = this.video.Url;
        this.techplan.VideoFileName = this.video.SrcFileName;
      }
      this.techplan.TeachPlanFiles = [];
      await this.FileList.forEach((file) => {
        this.techplan.TeachPlanFiles.push({
          Name: file.FileName,
          Url: file.FileUrl,
        });
      });
      if (this.techplan.IsNew) {
        var did = await this.$api.addTechPlan(this.techplan);
      } else {
        await this.$api.updateTechPlan(this.techplan);
        console.log(this.techplan);
      }
      alert("儲存完成", () => {
        this.$router.push(`/techplans`);
      });
    },
    uploadDragFile(file, callback) {
      callback(file);
    },
    callback(data, url, type) {
      console.log('callback');
      return async (file) => {
        data.Status = 1;
        data.CancelToken = this.$api.getCancelToken();
        data.Progress = 0;
        data.SrcFileName = file.name;
        data.File = file;
        this.$api.setEnableBlockUI(false);
        var response = await this.$api.upload(
          url,
          file,
          data.CancelToken,
          (progress) => {
            if (progress >= 100) {
              alert("上傳完成", () => {
                data.Status = 2;
                data.Progress = 0;
              });
              return;
            }
            data.Progress = progress;
          }
        );
        data.Url = response.Item2;
        if (type === "teachPlanFile") {
          this.FileList.push({
            FileName: file.name,
            FileUrl: response.Item2,
          });
        }
        this.$api.setEnableBlockUI(true);
      };
    },
    download(url) {
      window.open(this.$options.filters.imageCDN(url));
    },
    fileRemove(index) {
        confirm("請問要刪除此檔案?", async (r) => {
          this.FileList.splice(index, 1);
        });  
    },
    fileDragover (e) {
      e.preventDefault()
    },
    fileDrop (e) {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      console.log('拖曳放開滑鼠時')

      if (!file) return
      if (file.size > this.MAX_FILE_SIZE) {
        alert('文件大小不能超過20MB');
        return;
      }
      this.uploadDragFile(file, 
        this.callback(this.planfile, "/api/backend/UploadTeachPlanFile", "teachPlanFile")
      );
    },
  },
};
</script>