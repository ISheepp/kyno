<template>
  <div style="width: 500px">
    <el-input
        placeholder="输入部门名称进行搜索..."
        v-model="filterText"
        prefix-icon="el-icon-search">

    </el-input>

    <el-tree
        :data="deps"
        :expand-on-click-node="false"
        ref="tree"
        :props="defaultProps"
        :filter-node-method="filterNode">
      <span class="custom-tree-node" style="display: flex;justify-content: space-between;width: 100%" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
              class="depButton"
              type="primary"
              size="mini"
              @click="() => showDepView(data)">
            添加部门
          </el-button>
          <el-button
              class="depButton"
              type="danger"
              size="mini"
              @click="() => deleteDep(data)">
            删除部门
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog
        title="添加部门"
        :visible.sync="dialogVisible"
        width="30%"
        >
      <div>
        <table>
          <tr>
            <td><el-tag>上级部门</el-tag></td>
            <td>{{pname}}</td>
          </tr>
          <tr>
            <td><el-tag>部门名称</el-tag></td>
            <td><el-input v-model="dep.name" placeholder="请输入部门名称..." size="small"></el-input></td>
          </tr>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="doAddDep">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "DepMana",
  data() {
    return {
      dep: {
        name: '',
        parentId: -1
      },
      pname: '',
      dialogVisible: false,
      filterText: '',
      deps: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    };
  },
  // 监控器
  watch: {
    filterText(val) {
      // 这个filter方法就是上面配的filter-node-method
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.initDeps();
  },
  methods: {
    addDep2Deps(deps, dep) {
      // 遍历deps
      for (let i = 0; i < deps.length; i++) {
        let d = deps[i];
        if (d.id == dep.parentId) {
          // 说明dep就是d的children的值
          d.children = d.children.concat(dep);
          return;
        } else {
          this.addDep2Deps(d.children, dep)
        }
      }
    },
    initDep() {
      this.dep = {
        name: '',
        parentId: -1
      }
      this.pname='';
    },
    doAddDep() {
      this.postRequest("/system/basic/department/", this.dep).then(resp => {
        if (resp) {
          // 这种刷新添加成功后树会收起来
          // this.initDeps();
          // 通过递归来进行数组操作
          this.addDep2Deps(this.deps, resp.obj);
          this.dialogVisible = false;
          // 初始化页面
          this.initDep();
        }
      })
    },
    removeDepFromDeps(deps, id) {
      for (let i = 0; i < deps.length; i++) {
        let d = deps[i];
        if (d.id == id) {
          deps.splice(i, 1);// 从i开始删除，删除1个
          return;
        } else {
          this.removeDepFromDeps(d.children, id);
        }
      }
    },
    deleteDep(data) {
      if (data.parent) {
        this.$message.error("父部门删除失败");
      }else {
        this.$confirm('此操作将永久删除【'+data.name+'】部门, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest("/system/basic/department/" + data.id).then(resp => {
            if (resp) {
              this.removeDepFromDeps(this.deps, data.id)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
    showDepView(data) {
      this.pname = data.name
      this.dep.parentId = data.id
      this.dialogVisible = true;
    },
    initDeps() {
      this.getRequest("/system/basic/department/").then(resp => {
        if (resp) {
          this.deps = resp
        }
      })
    },
    // data定义的是json对象
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) != -1;
    }
  }
}
</script>

<style>
.depButton {
  padding: 2px;
}
</style>
