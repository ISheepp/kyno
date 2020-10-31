<template>
  <div>
    <div>
      <el-input
          placeholder="请输入角色英文名称..."
          style="width: 300px;margin-right: 9px"
          v-model="role.name"
          size="small">
        <template slot="prepend">ROLE_</template>
      </el-input>
      <el-input
          size="small"
          style="width: 250px;margin-right: 9px"
          placeholder="请输入角色中文名称..."
          v-model="role.nameZh"
          clearable @keydown.enter.native="doAddRole">
      </el-input>
      <el-button icon="el-icon-plus" size="small" type="primary" @click="doAddRole">添加角色</el-button>
    </div>

    <div style="margin-top: 13px;width: 800px">
      <el-collapse accordion @change="change" v-model="activeName">
        <el-collapse-item :title="r.nameZh" :name="r.id" v-for="(r, index) in roles" :key="index">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>可访问的资源</span>
              <el-button style="float: right; padding: 3px 0; color: #ff0000" icon="el-icon-delete" type="text" @click="deleteRole(r)"></el-button>
            </div>
            <div>
              <!-- :key 是为了区分每一个tree-->
              <el-tree
                  :key="index"
                  :data="menus"
                  ref="tree"
                  :props="defaultProps"
                  show-checkbox
                  node-key="id"
                  :default-checked-keys="selectMenus">
              </el-tree>
              <div style="display: flex; justify-content: flex-end">
                <el-button size="mini" @click="cancelUpdate">取消修改</el-button>
                <el-button size="mini" type="primary" @click="doUpdate(r.id, index)">确认修改</el-button>
              </div>
            </div>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
export default {
  name: "PermissMana",
  data() {
    return {
      activeName: -1,
      role: {
        name: '',
        nameZh: '',
      },
      roles: [],
      menus: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      selectMenus: []
    }
  },
  mounted() {
    this.initRoles();
  },
  methods: {
    deleteRole(role) {
      this.$confirm('此操作将永久删除【'+role.nameZh+'】角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest("/system/basic/permiss/role/"+role.id).then(resp => {
          if (resp) {
            this.initRoles();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    doAddRole() {
      if (this.role.name && this.role.nameZh){
        this.postRequest("/system/basic/permiss/role", this.role).then(resp => {
          if (resp) {
            this.role.name = '';
            this.role.nameZh = '';
            this.initRoles();
          }
        })
      }else {
        this.$message.error('数据不可以为空');
      }
    },
    cancelUpdate() {
      this.activeName = -1;
    },
    doUpdate(rid, index) {
      // 获取当前页面的所有ref(引用)
      let tree = this.$refs.tree[index];
      // 只返回叶子节点
      let selectKeys = tree.getCheckedKeys(true);
      let url = "/system/basic/permiss/?rid=" + rid;
      selectKeys.forEach(key => {
        url += '&mids=' + key;
      });
      this.putRequest(url).then(resp => {
        if (resp) {
          // this.initRoles(); 不需刷新，直接关闭面板
          this.activeName = -1;
        }
      })
    },
    initSelectMenus(rid) {
      this.getRequest("/system/basic/permiss/mids/" + rid).then(resp => {
        if (resp) {
          this.selectMenus = resp;
        }
      });
    },
    change(rid) {
      // 点击当前卡片才加载当前信息
      if (rid) {
        this.initMenus();
        this.initSelectMenus(rid)
      }
    },
    initMenus() {
      this.getRequest("/system/basic/permiss/menus").then(resp => {
        if (resp) {
          this.menus = resp
        }
      });
    },
    initRoles() {
      this.getRequest("/system/basic/permiss/").then(resp => {
        if (resp) {
          this.roles = resp
        }
      });
    },
  }
}
</script>

<style scoped>

</style>
