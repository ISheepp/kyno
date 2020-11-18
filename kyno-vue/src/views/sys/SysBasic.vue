<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="部门管理" name="depmana">
        <!--组件化开发-->
        <DepMana></DepMana>
      </el-tab-pane>
      <el-tab-pane label="职位管理" name="postmana"><PostMana></PostMana></el-tab-pane>
      <el-tab-pane label="职称管理" name="joblevelmana"><JobLevelMana></JobLevelMana></el-tab-pane>
      <el-tab-pane label="奖惩规则" name="ecmana"><Ecmana></Ecmana></el-tab-pane>
      <el-tab-pane label="权限组" name="permissmana"><PermissMana></PermissMana></el-tab-pane>
    </el-tabs>
  </div>

</template>

<script>
  import DepMana from "@/components/sys/basic/DepMana";
  import Ecmana from "@/components/sys/basic/Ecmana";
  import JobLevelMana from "@/components/sys/basic/JobLevelMana";
  import PermissMana from "@/components/sys/basic/PermissMana";
  import PostMana from "@/components/sys/basic/PostMana";

  export default {
    name: "SysBasic",
    data() {
      return{
        activeName: 'depmana'
      }

    },
    components: {
      DepMana,
      Ecmana,
      JobLevelMana,
      PermissMana,
      PostMana
    }
  };

</script>

<style>

</style>
