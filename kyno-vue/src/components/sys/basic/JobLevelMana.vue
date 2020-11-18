<template>
  <div>
    <div>
      <el-input
          size="small"
          style="width: 300px;margin-right: 9px"
          placeholder="添加职称..."
          prefix-icon="el-icon-plus"
          v-model="jl.name"
          clearable>
      </el-input>
      <el-select v-model="jl.titleLevel" placeholder="职称等级" size="small" style="margin-right: 6px">
        <el-option
            v-for="item in titleLevel"
            :key="item"
            :label="item"
            :value="item">
        </el-option>
      </el-select>
      <el-button icon="el-icon-plus" size="small" type="primary" @click="addJob">添加</el-button>
    </div>
    <div>
      <el-table
          size="small"
          stripe
          :data="jobs"
          border
          @selection-change="handleSelectionChange"
          style="width: 60%;margin-top: 9px">
        <el-table-column
            type="selection"
            width="55"
        ></el-table-column>
        <el-table-column
            prop="id"
            label="编号"
            width="55">
        </el-table-column>
        <el-table-column
            prop="name"
            label="职称名称"
            width="140">
        </el-table-column>
        <el-table-column
            prop="titleLevel"
            label="职称级别"
            width="140">
        </el-table-column>
        <el-table-column
            prop="createDate"
            label="创建时间">
        </el-table-column>
        <el-table-column
            label="是否启用">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.enabled">已启用</el-tag>
            <el-tag type="danger" v-else="scope.row.enabled">未启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            width="150">
          <!--提前定位好占位符scope-->
          <template slot-scope="scope">
            <el-button
                type="primary"
                size="mini"
                @click="showEditView(scope.$index, scope.row)">编辑</el-button>
            <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="danger" size="small" style="margin-top: 10px" @click="deleteMany" :disabled="multipleSelection.length==0">批量删除</el-button>
    </div>
    <el-dialog
        title="修改职称"
        :visible.sync="dialogVisible"
        width="30%"
    >
      <div>
        <table>
          <tr>
            <td><el-tag>职称名</el-tag></td>
            <td><el-input size="small" v-model="updateJob.name"></el-input></td>
          </tr>
          <tr>
            <td><el-tag>职称等级</el-tag></td>
            <td><el-select v-model="updateJob.titleLevel" placeholder="职称等级" size="small">
              <el-option
                  v-for="item in titleLevel"
                  :key="item"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select></td>
          </tr>
          <tr>
            <td><el-tag>是否启用</el-tag></td>
            <td>
              <el-switch
                v-model="updateJob.enabled"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="启用"
                inactive-text="禁用">
              </el-switch>
            </td>
          </tr>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="dialogVisible = false">取 消</el-button>
    <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "JobLevelMana",
  data() {
    return {
      jl: {
        name: '',
        titleLevel: ''
      },
      dialogVisible: false,
      titleLevel: [
        '正高级',
        '副高级',
        '初级',
        '中级',
        '员级',
      ],
      jobs: [],
      updateJob: {
        name: '',
        titleLevel: '',
        enabled: false
      },
      multipleSelection: []
    }
  },
  mounted() {
    this.initJob();
  },
  methods: {
    deleteMany() {
      this.$confirm('此操作将永久删除【'+this.multipleSelection.length+'】条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = '?';
        this.multipleSelection.forEach(item => {
          ids += 'ids=' + item.id + '&';
        });
        this.deleteRequest("/system/basic/job/" + ids).then(resp => {
          if (resp) {
            this.initJob();
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    initJob() {
      this.getRequest("/system/basic/job/").then(resp => {
        if (resp) {
          this.jobs = resp.obj
        }
      });
    },
    // Content type 'application/x-www-form-urlencoded;charset=UTF-8' not supported]
    // 将传输的类型改为json对象即可
    addJob() {
      if (this.jl.name && this.jl.titleLevel) {
        this.postRequest("/system/basic/job/", this.jl).then(resp => {
          if (resp) {
            this.initJob();
            this.jl = {
              name: '',
              titleLevel: ''
            }
          }
        });
      } else {
        this.$message.error("职称名字或级别不可以为空");
      }
    },
    handleDelete(index, data) {
      this.$confirm('此操作将永久删除【' + data.name + '】职称, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest("/system/basic/job/" + data.id).then(resp => {
          if (resp) {
            this.initJob();
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    showEditView(index, data) {
      Object.assign(this.updateJob, data);
      this.dialogVisible = true;
    },
    doUpdate() {
      this.putRequest("/system/basic/job/", this.updateJob).then(resp => {
        if (resp) {
          this.initJob();
          this.dialogVisible = false;
        }
      });
    }

  }
}
</script>

<style>
.updateJobInput {
  width: 200px;
  margin-left: 8px;
  margin-bottom: 8px;
}
.select {
  width: 200px;
  margin-left: 8px;
}

</style>
