<template>
  <div>
    <div style="margin-top: 15px;display: flex;justify-content: center">
      <el-input v-model="keywords" placeholder="通过用户名搜索用户..." prefix-icon="el-icon-search" style="width: 400px;margin-right: 10px" @keydown.enter.native="doSearch"></el-input>
      <el-button round icon="el-icon-search" type="primary" size="small" @click="doSearch">搜索</el-button>
    </div>
    <div class="hr-container">
      <el-card class="hr-card" v-for="(hr, index) in hrs" :key="index">
        <div slot="header" class="clearfix">
          <span>{{hr.name}}</span>
          <el-button style="float: right; padding: 3px 0; color: red" type="text" icon="el-icon-delete" @click="deleteHr(hr)"></el-button>
        </div>
        <div>
          <div class="img-container">
            <img :src="hr.userface" :alt="hr.name" :title="hr.name" class="userface-img">
          </div>
          <div class="userinfo-container">
            <div>用户名：{{hr.name}}</div>
            <div>手机号码：{{hr.phone}}</div>
            <div>电话号码：{{hr.telephone}}</div>
            <div>地址：{{hr.address}}</div>
            <div>用户状态：<el-switch
                @change="enabledChange(hr)"
                v-model="hr.enabled"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="启用"
                inactive-text="禁用">
            </el-switch></div>
            <div>用户角色：<el-tag style="margin-right: 5px" size="mini" type="success" v-for="(role, indexj) in hr.roles" :key="indexj">{{role.nameZh}}</el-tag>
              <el-popover
                  placement="right"
                  @show="showPop(hr)"
                  @hide="hidePop(hr)"
                  title="角色列表"
                  width="200"
                  trigger="click">
                <!--预选中，就是给seletedRoles赋值-->
                <el-select v-model="seletedRoles" multiple placeholder="请选择">
                  <el-option
                      v-for="(r,indexk) in allroles"
                      :key="indexk"
                      :label="r.nameZh"
                      :value="r.id">
                  </el-option>
                </el-select>
                <el-button slot="reference" type="text" icon="el-icon-more"></el-button>
              </el-popover>

            </div>
            <div>
              备注{{hr.remark}}
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "SysHr",
  data() {
    return {
      keywords: '',
      hrs: [],
      allroles: [],
      seletedRoles: [],
    }
  },
  mounted() {
    this.initHrs();
  },
  methods: {
    deleteHr(hr) {
      this.$confirm('此操作将永久删除【'+hr.name+'】操作员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest("/system/hr/" + hr.id).then(resp => {
          if (resp) {
            this.initHrs();
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    doSearch() {
      this.initHrs();
    },
    // todo 不懂
    hidePop(hr) {
      let roles = [];
      Object.assign(roles, hr.roles);
      let flag = false;
      if (roles.length != this.seletedRoles.length) {
        flag = true;
      }else {
        for (let i = 0; i < roles.length; i++) {
          let role = roles[i]
          for (let j = 0; j < this.seletedRoles.length; j++) {
            let sr = this.seletedRoles[j];
            if (role.id == sr) {
              // 移除一个数据
              roles.splice(i, 1);
              i--;
              break;
            }
          }
        }
        if (roles.length != 0) {
          flag = true;
        }
      }
      if (flag) {
        let url = '/system/hr/role?hrid=' + hr.id;
        this.seletedRoles.forEach(sr => {
          url += '&rids=' + sr;
        });
        this.putRequest(url).then(resp => {
          if (resp) {
            this.initHrs();
          }
        });
      }
    },
    showPop(hr) {
      this.initAllRoles();
      let roles = hr.roles;
      this.seletedRoles = [];
      roles.forEach(r => {
        this.seletedRoles.push(r.id)
      });
    },
    enabledChange(hr) {
      delete hr.roles;
      this.putRequest("/system/hr/", hr).then(resp => {
        if (resp) {
          this.initHrs();
        }
      })
    },
    initAllRoles() {
      this.getRequest("/system/hr/roles").then(resp => {
        if (resp) {
          this.allroles = resp;
        }
      })
    },
    initHrs() {
      this.getRequest("/system/hr/?keywords=" + this.keywords).then(resp => {
        if (resp) {
          this.hrs = resp;
        }
      })
    }
  }
}
</script>

<style>
  .hr-container {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  .hr-card {
    width: 350px;
    margin-bottom: 20px;
  }
  .userface-img {
    width: 72px;
    height: 72px;
    border-radius: 72px;
  }
  .img-container {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .userinfo-container {
    margin-top: 20px;
  }
  .userinfo-container div {
    font-size: 12px;
    color: #409EFF;
  }

</style>
