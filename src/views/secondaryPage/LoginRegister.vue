<template>
  <div class="container" style="width: 60%; margin: 30px auto">
    <!-- register -->
    <div class="form-container sign-up-container">
      <div class="form">
        <h2>注册</h2>
        <input
          type="text"
          placeholder="Username..."
          v-model="registerForm.userAccount"
        />
        <input
          type="password"
          placeholder="Password..."
          v-model="registerForm.userPassword"
        />
        <el-select v-model="registerForm.roleId" placeholder="请选择">
          <el-option
            v-for="item in roles"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId"
          >
          </el-option>
        </el-select>
        <button class="signUp" @click="register">注册</button>
      </div>
    </div>
    <!-- login -->
    <div class="form-container sign-in-container">
      <div class="form">
        <h2>登录</h2>
        <input
          type="email"
          placeholder="UserName..."
          v-model="loginForm.userName"
        />
        <input
          type="password"
          placeholder="Password..."
          v-model="loginForm.password"
        />
        <a href="#" class="forget-password">forget your password</a>
        <button class="signIn" @click="login">登录</button>
      </div>
    </div>
    <!-- overlay container -->
    <div class="overlay_container">
      <div class="overlay">
        <!-- overlay left -->
        <div class="overlay_panel overlay_left_container">
          <h2>welcome back!</h2>
          <p>To keep connected with us please login with your personal info</p>
          <button id="sign-in" @click="signInClick">登录</button>
        </div>
        <!-- overlay right -->
        <div class="overlay_panel overlay_right_container">
          <h2>hello friend!</h2>
          <p>Enter your personal details and start journey with us</p>
          <button id="sign-up" @click="signUpClick">注册</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginRegister",
  data() {
    return {
      registerForm: {
        userAccount: "",
        userPassword: "",
        roleId: "",
      },
      loginForm: {
        userName: "",
        password: "",
      },
      roles: [],
    };
  },
  created() {
    this.getAllRoles();
  },
  methods: {
    //获取所有角色列表
    async getAllRoles() {
      const { data: res } = await this.$http.get("role/getallrole");
      this.roles = res.data;
      for (let roleInd = 0; roleInd < this.roles.length; roleInd++) {
        if (this.roles[roleInd].roleName == "管理员") {
          this.roles.splice(roleInd, 1);
        }
      }
    },
    signInClick() {
      const container = document.getElementsByClassName("container")[0];
      container.classList.remove("active");
    },
    signUpClick() {
      const container = document.getElementsByClassName("container")[0];
      container.classList.add("active");
    },
    //提交登录
    async login() {
      const { data: res } = await this.$http.post("login/", this.loginForm);
      console.log("登录返回信息", res);
      this.$store.dispatch("asyncUpdateUser", res.data);
      this.$emit("judgeLogin");
      this.$message({
        showClose: true,
        message: "登录成功",
        type: "success",
      });
      this.$router.push("/frontPage");
    },
    //提交注册
    async register() {
      console.log("注册表单", this.registerForm);
      const { data: res } = await this.$http.post(
        "login/regist",
        this.registerForm
      );
      console.log("注册返回信息", res);
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f6f5f7;
}

h2 {
  margin-bottom: 10px;
  font-size: 32px;
  text-transform: capitalize;
}

.container {
  position: relative;
  width: 768px;
  height: 480px;
  background-color: white;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  overflow: hidden;
}

.form-container {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  background-color: white;
  transition: all 0.6s ease-in-out;
}

.form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 0 50px;
}

input {
  width: 100%;
  margin: 8px 0;
  padding: 12px;
  background-color: #eee;
  border: none;
}

.el-select {
  width: 100%;
  margin: 8px 0;
}

.forget-password {
  display: inline-block;
  height: 20px;
  text-decoration: none;
  color: #bbb;
  text-transform: capitalize;
  font-size: 12px;
}

.forget-password:hover {
  color: lightslategray;
  border-bottom: 2px solid #ff4b2b;
}

button {
  background: #ff4b2b;
  padding: 10px 50px;
  border: 1px solid transparent;
  border-radius: 20px;
  text-transform: uppercase;
  color: white;
  margin-top: 10px;
  outline: none;
  transition: transform 80;
}

button:active {
  transform: scale(0.95);
}

.overlay_container {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  z-index: 100;
  right: 0;
  overflow: hidden;
  transition: all 0.6s ease-in-out;
}

.overlay {
  position: absolute;
  width: 200%;
  height: 100%;
  left: -100%;
  background-color: #ff4b2b;
}

.overlay_panel {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 100%;
  color: white;
  padding: 0 40px;
  text-align: center;
}

.overlay_panel button {
  background-color: transparent;
  border: 1px solid white;
}

.overlay_panel p {
  font-size: 12px;
  margin: 10px 0 15px 0;
}

.overlay_right_container {
  right: 0;
}

.container.active .sign-up-container {
  transform: translateX(100%);
  z-index: 5;
}

.container.active .sign-in-container {
  transform: translateX(100%);
}

.container.active .overlay_container {
  transform: translateX(-100%);
}

.container.active .overlay {
  transform: translateX(50%);
}
</style>
