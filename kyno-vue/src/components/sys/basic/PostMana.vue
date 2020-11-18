<template>
  <div>
    <div>
      <el-input
          size="small"
          style="width: 300px;margin-right: 9px"
          placeholder="添加职位..."
          prefix-icon="el-icon-plus"
          v-model="pos.name"
          clearable
          @keydown.enter.native="addPosition">
      </el-input>
      <el-button icon="el-icon-plus" size="small" type="primary" @click="addPosition">添加</el-button>
    </div>
    <div>
      <el-table
          size="small"
          stripe
          :data="positions"
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
            label="职位名称"
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
        title="修改职位"
        :visible.sync="dialogVisible"
        width="30%"
    >
        <div>
          <el-tag>职位名称</el-tag>
          <el-input class="updatePosInput" size="small" v-model="updatePos.name"></el-input>
        </div>
      <div>
        <el-tag style="margin-right: 10px">是否启用</el-tag>
        <el-switch
            v-model="updatePos.enabled"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="启用"
            inactive-text="禁用">
        </el-switch>
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
  name: "PostMana",
  data() {
    return {
      pos: {
        name: '',
      },
      dialogVisible: false,
      updatePos: {
        name: '',
        enabled: false
      },
      positions: [],
      multipleSelection: []
    }
  },
  // 数据初始化一般放在mounted函数里
  mounted() {
    this.initPosition();
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val)
    },
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
        this.deleteRequest("/system/basic/pos/" + ids).then(resp => {
          if (resp) {
            this.initPosition();
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    doUpdate() {
      this.putRequest("/system/basic/pos/", this.updatePos).then(resp => {
        if (resp) {
          this.initPosition();
          this.dialogVisible = false;
        }

      });
    },
    initPosition() {
      this.getRequest("/system/basic/pos/").then(resp => {
        if (resp) {
          this.positions = resp.obj;
        }
      });
    },
    showEditView(index, data) {
      // this.updatePos = data;
      // 拷贝数据,防止点击取消后同样不修改
      Object.assign(this.updatePos, data);
      this.dialogVisible = true;
    },
    handleDelete(index, data) {
      // 先来个确认框
      this.$confirm('此操作将永久删除【'+data.name+'】职位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest("/system/basic/pos/" + data.id).then(resp => {
          if (resp) {
            this.initPosition();
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    addPosition() {
      // 先判断有没有输入值
      if (this.pos.name) {
        this.postRequest("/system/basic/pos/", this.pos).then(resp => {
          if (resp) {
            // 添加成功，刷新表格
            this.initPosition();
            this.pos.name = '';
          }
        })
      }else {
        this.$message.error('职位名称不可以为空');
      }
    }
  }

}
</script>

<style scoped>
  .updatePosInput {
    width: 200px;
    margin-left: 8px;
  }
</style>
