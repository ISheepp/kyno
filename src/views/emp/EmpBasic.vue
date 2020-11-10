<template>
  <div>
    <div style="display: flex;justify-content: space-between">
      <div>
        <el-input placeholder="请输入员工名进行搜索，可以直接回车搜索..."
                  prefix-icon="el-icon-search" style="width: 320px;margin-right: 10px"
                  size="small" v-model="keyword" @keydown.enter.native="initEmps" clearable></el-input>
        <el-button icon="el-icon-search" size="small" type="primary" @click="initEmps">搜索</el-button>
        <el-button type="primary" size="small">
          <i class="fa fa-angle-double-down" aria-hidden="true"></i>
          高级搜索</el-button>
      </div>
      <div>
        <el-upload
            style="display: inline-flex;margin-right: 8px"
            :before-upload="beforeUpload"
            :on-success="onSuccess"
            :on-error="onError"
            :disabled="importDataDisabled"
            class="upload-demo"
            :show-file-list="false"
            action="/employee/basic/import"
            >
          <el-button :disabled="importDataDisabled" type="success" size="small" :icon="importDataBtnIcon">

            {{importDataBtnText}}</el-button>
        </el-upload>

        <el-button type="success" size="small" @click="exportData" icon="el-icon-download">

          导出数据</el-button>
        <el-button type="primary" icon="el-icon-plus" size="small" @click="showAddEmpView">
          添加用户</el-button>
      </div>
    </div>
    <div style="margin-top: 10px">
      <el-table
          v-loading="loading"
          element-loading-text="正在加载..."
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          size="small"
          :data="emps"
          border
          stripe
          style="width: 100%">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            prop="name"
            fixed
            align="left"
            label="姓名"
            width="90">
        </el-table-column>
        <el-table-column
            prop="workID"
            label="工号"
            align="left"
            width="85">
        </el-table-column>
        <el-table-column
            prop="gender"
            label="性别"
            align="left"
            width="85">
        </el-table-column>
        <el-table-column
            prop="birthday"
            width="95"
            align="left"
            label="出生日期">
        </el-table-column>
        <el-table-column
            prop="idCard"
            width="150"
            align="left"
            label="身份证号码">
        </el-table-column>
        <el-table-column
            prop="wedlock"
            width="85"
            label="婚姻">
        </el-table-column>
        <el-table-column
            prop="nation.name"
            width="50"
            label="民族">
        </el-table-column>
        <el-table-column
            prop="nativePlace"
            width="80"
            label="籍贯">
        </el-table-column>
        <el-table-column
            prop="politicsstatus.name"
            label="政治面貌">
        </el-table-column>
        <el-table-column
            prop="email"
            width="180"
            align="left"
            label="电子邮件">
        </el-table-column>
        <el-table-column
            prop="phone"
            width="100"
            align="left"
            label="电话号码">
        </el-table-column>
        <el-table-column
            prop="address"
            width="220"
            align="left"
            label="联系地址">
        </el-table-column>
        <el-table-column
            prop="department.name"
            width="100"
            align="left"
            label="所属部门">
        </el-table-column>
        <el-table-column
            prop="position.name"
            width="100"
            label="职位">
        </el-table-column>
        <el-table-column
            prop="jobLevel.name"
            width="100"
            label="职称">
        </el-table-column>
        <el-table-column
            prop="engageForm"
            width="100"
            align="left"
            label="聘用形式">
        </el-table-column>
        <el-table-column
            prop="tiptopDegree"
            width="80"
            align="left"
            label="最高学历">
        </el-table-column>
        <el-table-column
            prop="specialty"
            width="150"
            align="left"
            label="专业">
        </el-table-column>
        <el-table-column
            prop="school"
            width="150"
            align="left"
            label="毕业院校">
        </el-table-column>
        <el-table-column
            prop="beginDate"
            width="90"
            align="left"
            label="入职日期">
        </el-table-column>
        <el-table-column
            prop="conversionTime"
            width="90"
            align="left"
            label="转正日期">
        </el-table-column>
        <el-table-column
            prop="beginContract"
            width="95"
            align="left"
            label="合同起始日期">
        </el-table-column>
        <el-table-column
            prop="endContract"
            width="95"
            align="left"
            label="合同截止日期">
        </el-table-column>
        <el-table-column
            width="70"
            align="left"
            label="合同期限">
        <template slot-scope="scope">
          <el-tag size="mini">{{scope.row.contractTerm}}</el-tag>年
        </template>

        </el-table-column>
        <el-table-column
            fixed="right"
            width="200"
            label="操作">
          <template slot-scope="scope">
            <el-button @click="showEditView(scope.row)" style="padding: 3px" size="mini">编辑</el-button>
            <el-button style="padding: 3px" size="mini" type="primary">查看高级资料</el-button>
            <el-button @click="deleteEmp(scope.row)" style="padding: 3px" size="mini" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;justify-content: flex-end">
        <el-pagination
            background
            @current-change="currentChange"
            @size-change="sizeChange"
            layout="sizes, prev, pager, next, jumper, ->, total, slot"
            :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="80%">
        <div>
          <el-form :model="emp" :rules="rules" ref="empForm">
            <el-row>
              <el-col :span="6">
                <el-form-item label="姓名:" prop="name">
                  <el-input placeholder="请输入员工姓名" prefix-icon="el-icon-edit" v-model="emp.name" size="mini" style="width: 150px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="性别:" prop="gender">
                  <el-radio-group v-model="emp.gender">
                    <el-radio label="男">男</el-radio>
                    <el-radio label="女" style="margin-left: -15px">女</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="出生日期:" prop="birthday">
                  <el-date-picker
                      v-model="emp.birthday"
                      type="date"
                      size="mini"
                      style="width: 150px"
                      value-format="yyyy-MM-dd"
                      placeholder="出生日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="政治面貌:" prop="politicId">
                  <el-select v-model="emp.politicId" placeholder="政治面貌" size="mini" style="width: 200px;">
                    <el-option
                        v-for="item in politicsstatus"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <!--第二行-->
            <el-row>
              <el-col :span="6">
                <el-form-item label="民族:" prop="nationId">
                  <el-select v-model="emp.nationId" placeholder="民族" size="mini" style="width: 150px;">
                    <el-option
                        v-for="item in nations"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="籍贯:" prop="nativePlace">
                  <el-input placeholder="请输入籍贯" prefix-icon="el-icon-edit" v-model="emp.nativePlace" size="mini" style="width: 120px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="电子邮箱:" prop="email">
                  <el-input placeholder="请输入电子邮箱" prefix-icon="el-icon-message" v-model="emp.email" size="mini" style="width: 150px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="联系地址:" prop="address">
                  <el-input placeholder="请输入联系地址" prefix-icon="el-icon-edit" v-model="emp.address" size="mini" style="width: 200px"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!--第三行-->
            <el-row>
              <el-col :span="6">
                <el-form-item label="职位:" prop="posId">
                  <el-select v-model="emp.posId" placeholder="职位" size="mini" style="width: 150px;">
                    <el-option
                        v-for="item in positions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="职称:" prop="jobLevelId">
                  <el-select v-model="emp.jobLevelId" placeholder="职称" size="mini" style="width: 150px;">
                    <el-option
                        v-for="item in joblevels"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="所属部门:" prop="departmentId">
                  <el-popover
                      placement="right"
                      title="请选择部门"
                      width="200"
                      trigger="manual"
                      v-model="popVisible">
                    <el-tree default-expand-all :data="allDeps" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                    <div slot="reference" style="width: 150px;display: inline-flex;font-size: 13px;border: 1px solid #dedede;height: 26px;
                  border-radius: 5px;cursor: pointer;align-items: center;padding-left: 8px;box-sizing: border-box" @click="showDepView">{{inputDepName}}
                    </div>
                  </el-popover>

                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="电话号码:" prop="address">
                  <el-input placeholder="电话号码" prefix-icon="el-icon-phone" v-model="emp.phone" size="mini" style="width: 200px"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!--第四行-->
            <el-row>
              <el-col :span="6">
                <el-form-item label="工号:" prop="workID">
                  <el-input placeholder="工号" prefix-icon="el-icon-edit" v-model="emp.workID" size="mini" style="width: 150px" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="学历:" prop="tiptopDegree">
                  <el-select v-model="emp.tiptopDegree" placeholder="学历" size="mini" style="width: 150px;">
                    <el-option
                        v-for="item in tiptopDegrees"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="毕业院校:" prop="school">
                  <el-input placeholder="毕业院校名称" prefix-icon="el-icon-edit" v-model="emp.school" size="mini" style="width: 150px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="专业名称:" prop="specialty">
                  <el-input placeholder="请输入专业名称" prefix-icon="el-icon-edit" v-model="emp.specialty" size="mini" style="width: 200px"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <!--第四行-->
            <el-row>
              <el-col :span="6">
                <el-form-item label="入职日期:" prop="beginDate">
                  <el-date-picker
                      v-model="emp.beginDate"
                      type="date"
                      size="mini"
                      style="width: 130px"
                      value-format="yyyy-MM-dd"
                      placeholder="入职日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="转正日期:" prop="conversionTime">
                  <el-date-picker
                      v-model="emp.conversionTime"
                      type="date"
                      size="mini"
                      style="width: 130px"
                      value-format="yyyy-MM-dd"
                      placeholder="转正日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="合同起始日期:" prop="beginContract">
                  <el-date-picker
                      v-model="emp.beginContract"
                      type="date"
                      size="mini"
                      style="width: 130px"
                      value-format="yyyy-MM-dd"
                      placeholder="合同起始日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="合同终止日期:" prop="endContract">
                  <el-date-picker
                      v-model="emp.endContract"
                      type="date"
                      size="mini"
                      style="width: 130px"
                      value-format="yyyy-MM-dd"
                      placeholder="合同终止日期">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <!--第五行-->
            <el-row>
              <el-col :span="8">
                <el-form-item label="身份证号码:" prop="idCard">
                  <el-input placeholder="请输入身份证号码" prefix-icon="el-icon-edit" v-model="emp.idCard" size="mini" style="width: 180px"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="聘用形式:" prop="engageForm">
                  <el-radio-group v-model="emp.engageForm">
                    <el-radio label="劳动合同">劳动合同</el-radio>
                    <el-radio label="劳务合同" style="margin-left: -15px">劳务合同</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="婚姻状况:" prop="wedlock">
                  <el-radio-group v-model="emp.wedlock">
                    <el-radio label="已婚">已婚</el-radio>
                    <el-radio label="未婚">未婚</el-radio>
                    <el-radio label="离异" style="margin-left: -15px">离异</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="doAddEmp">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "EmpBasic",
  data() {
    return {
      importDataBtnText: '导入数据',
      importDataBtnIcon: 'el-icon-upload2',
      importDataDisabled: false,
      title: '',
      rules: {
        name: [{required: true, message: '请输入姓名', trigger: 'blur'}],
        gender: [{required: true, message: '请输入性别', trigger: 'blur'}],
        birthday: [{required: true, message: '请输入出生日期', trigger: 'blur'}],
        idCard: [{required: true, message: '请输入身份证号码', trigger: 'blur'}],
        wedlock: [{required: true, message: '请输入婚姻状况', trigger: 'blur'}],
        nationId: [{required: true, message: '请输入民族', trigger: 'blur'}],
        nativePlace: [{required: true, message: '请输入籍贯', trigger: 'blur'}],
        politicId: [{required: true, message: '请输入政治面貌', trigger: 'blur'}],
        email: [{required: true, message: '请输入邮箱地址', trigger: 'blur'},{type: 'email', message: '邮箱格式不正确', trigger: "blur"}],
        phone: [{required: true, message: '请输入电话号码', trigger: 'blur'}],
        address: [{required: true, message: '请输入员工地址', trigger: 'blur'}],
        departmentId: [{required: true, message: '请输入部门名称', trigger: 'blur'}],
        jobLevelId: [{required: true, message: '请输入职称', trigger: 'blur'}],
        posId: [{required: true, message: '请输入职位', trigger: 'blur'}],
        engageForm: [{required: true, message: '请输入聘用形式', trigger: 'blur'}],
        tiptopDegree: [{required: true, message: '请输入学历', trigger: 'blur'}],
        specialty: [{required: true, message: '请输入专业', trigger: 'blur'}],
        school: [{required: true, message: '请输入毕业学校', trigger: 'blur'}],
        beginDate: [{required: true, message: '请输入入职日期', trigger: 'blur'}],
        workState: [{required: true, message: '请输入工作状态', trigger: 'blur'}],
        workID: [{required: true, message: '请输入工号', trigger: 'blur'}],
        contractTerm: [{required: true, message: '请输入合同期限', trigger: 'blur'}],
        conversionTime: [{required: true, message: '请输入转正日期', trigger: 'blur'}],
        notworkDate: [{required: true, message: '请输入离职日期', trigger: 'blur'}],
        beginContract: [{required: true, message: '请输入合同起始日期', trigger: 'blur'}],
        endContract: [{required: true, message: '请输入合同结束日期', trigger: 'blur'}],
        workAge: [{required: true, message: '请输入工龄', trigger: 'blur'}],

      },
      emps: [],
      loading: false,
      dialogVisible: false,
      total: 0,
      page: 1,
      size: 10,
      keyword: '',
      popVisible: false,
      allDeps: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      emp: {
        name: "",
        gender: "",
        birthday: "",
        idCard: "",
        wedlock: "",
        nationId: null,
        nativePlace: "",
        politicId: 1,
        email: "",
        phone: "",
        address: "",
        departmentId: null,
        jobLevelId: 12,
        posId: 29,
        engageForm: "",
        tiptopDegree: "",
        specialty: "",
        school: "",
        beginDate: "",
        workState: null,
        workID: "",
        contractTerm: 3.0,
        conversionTime: "",
        notworkDate: null,
        beginContract: "",
        endContract: "",
        workAge: null,
      },
      nations: [],
      joblevels: [],
      politicsstatus: [],
      positions: [],
      tiptopDegrees: ['本科','大专','硕士','博士','高中','初中','小学','其他'],
      inputDepName: '',
      value: ''
    }
  },
  mounted() {
    this.initEmps();
    this.initData();
  },
  methods: {
    onError(err, file, fileList) {
      this.importDataBtnText = '导入数据';
      this.importDataBtnIcon = 'el-icon-upload2';
      this.importDataDisabled = false;
    },
    onSuccess(response, file, fileList) {
      this.importDataBtnText = '导入数据';
      this.importDataBtnIcon = 'el-icon-upload2';
      this.importDataDisabled = false;
      this.initEmps();
    },
    beforeUpload() {
      this.importDataBtnText = '正在导入';
      this.importDataBtnIcon = 'el-icon-loading';
      this.importDataDisabled = true;
    },
    exportData() {
      window.open('/employee/basic/export', '_parent');
    },
    emptyEmp() {
      this.emp = {
        name: "",
            gender: "",
            birthday: "",
            idCard: "",
            wedlock: "",
            nationId: null,
            nativePlace: "",
            politicId: 1,
            email: "",
            phone: "",
            address: "",
            departmentId: null,
            jobLevelId: 12,
            posId: 29,
            engageForm: "",
            tiptopDegree: "",
            specialty: "",
            school: "",
            beginDate: "",
            workState: null,
            workID: "",
            contractTerm: 3.0,
            conversionTime: "",
            notworkDate: null,
            beginContract: "",
            endContract: "",
            workAge: null,
      }
      this.inputDepName = '';
    },
    showEditView(data) {
      this.title = '编辑员工信息';
      this.emp = data;
      this.initPositions();
      this.inputDepName = data.department.name;
      this.dialogVisible = true;
    },
    deleteEmp(data) {
      this.$confirm('此操作将永久删除【'+data.name+'】, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/employee/basic/' + data.id).then(resp => {
          if (resp) {
            this.initEmps();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    doAddEmp() {
      // 有id（不是工号）则代表更新
      if (this.emp.id) {
        this.$refs['empForm'].validate(valid => {
          if (valid) {
            this.putRequest('/employee/basic/', this.emp).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initEmps();
              }
            })
          }else {
            this.$message.error("请输入所有字段")
            return false;
          }
        });
      } else {
        this.$refs['empForm'].validate(valid => {
          if (valid) {
            this.postRequest('/employee/basic/', this.emp).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initEmps();
              }
            })
          }else {
            this.$message.error("请输入所有字段")
            return false;
          }
        });
      }
    },
    handleNodeClick(data) {
      this.emp.departmentId = data.id
      this.inputDepName = data.name;
      this.popVisible = !this.popVisible;
    },
    showDepView() {
      this.popVisible = !this.popVisible;
    },
    getMaxWorkID() {
      this.getRequest('/employee/basic/maxWorkID').then(resp => {
        if (resp) {
          this.emp.workID = resp.obj;
        }
      })
    },
    initPositions() {
      this.getRequest('/employee/basic/positions').then(resp => {
        if (resp) {
          this.positions = resp;
        }
      })
    },
    initData() {
      if (!window.sessionStorage.getItem("nations")) {
        this.getRequest('/employee/basic/nations').then(resp => {
          if (resp) {
            this.nations = resp;
            window.sessionStorage.setItem('nations', JSON.stringify(resp));
          }
        })
      }else {
        this.nations = JSON.parse(window.sessionStorage.getItem("nations"));
      }
      if (!window.sessionStorage.getItem("joblevels")) {
        this.getRequest('/employee/basic/joblevels').then(resp => {
          if (resp) {
            this.joblevels = resp;
            window.sessionStorage.setItem('joblevels', JSON.stringify(resp));
          }
        })
      }else {
        this.joblevels = JSON.parse(window.sessionStorage.getItem("joblevels"));
      }
      if (!window.sessionStorage.getItem("deps")) {
        this.getRequest('/employee/basic/deps').then(resp => {
          if (resp) {
            this.allDeps = resp;
            window.sessionStorage.setItem('deps', JSON.stringify(resp));
          }
        })
      }else {
        this.allDeps = JSON.parse(window.sessionStorage.getItem("deps"));
      }
      if (!window.sessionStorage.getItem("politicsstatus")) {
        this.getRequest('/employee/basic/politicsstatus').then(resp => {
          if (resp) {
            this.politicsstatus = resp;
            window.sessionStorage.setItem('politicsstatus', JSON.stringify(resp));
          }
        })
      }else {
        this.politicsstatus = JSON.parse(window.sessionStorage.getItem("politicsstatus"));
      }
    },
    showAddEmpView() {
      this.emptyEmp();
      this.title = '添加员工'
      this.getMaxWorkID();
      this.initPositions();
      this.dialogVisible = true;
    },
    sizeChange(currentSize) {
      this.size = currentSize;
      this.initEmps();
    },
    currentChange(currentPage) {
      this.page = currentPage;
      this.initEmps();
    },
    initEmps() {
      this.loading = true;
      this.getRequest("/employee/basic/?page=" + this.page + "&size=" + this.size + "&keyword=" + this.keyword).then(resp => {
        this.loading = false
        if (resp) {
          this.emps = resp.data;
          this.total = resp.total;
        }
      });
    }
  }
}
</script>

<style scoped>

</style>
