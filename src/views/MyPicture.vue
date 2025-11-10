<template>
    
    <div class="my-picture" style="padding-bottom: 100px">
        
        <div class="nav">
            <van-nav-bar
                title="图片管理"
                left-text="返回"
                left-arrow
                @click-left="goback"
            />
        </div>
        
        <div style="text-align: left;margin-top: 10px;margin-bottom: 10px;margin-left: 10px">
            <van-uploader :after-read="upload" multiple>
                <van-button icon="plus" type="primary">上传文件</van-button>
            </van-uploader>
        </div>

        <div class="picture-box">
            <div  class="picture-item item-border item-flex" v-for="(item, index) in pictureList">
            
                <div @click="curSelect(index)" class="item" :class="enableIndex == index ? 'dark' : 'light'">
                    <div v-show="enableIndex === index" @click="edit" class="edit">
                      <img class="edit-icon" src="../assets/icon/edit-2.png"/>
                    </div>
                    <div v-show="enableIndex === index" @click="remove" class="remove">
                      <img class="remove-icon" src="../assets/icon/remove-2.png"/>
                    </div>
                </div>

                <img 
                :src=" remoteUrl + remoteDataDir + item.picturePath" 
                :alt="item.pictureDesc"
                class="item"
                />
            </div>

        </div>   

        <br>

        <div class="pop-up-windows">
          <van-dialog
            v-model="showRemoveWindow"
            title="删除图片"
            show-cancel-button
            :before-close="removePicture"
            confirm-button-text="确认"
          >
            <div style="color: red; padding-top: 25px; padding-bottom: 25px">
              {{ message }}
            </div>
          </van-dialog>
        </div>

        

        <van-dialog
        v-model="showEditWindow"
        title="图片信息"
        show-cancel-button
        :before-close="savePicture"
      >
        <div class="item-box">
          <div class="pro">图片名</div>
          <input v-model="curPicture.pictureDesc" class="pro-name" />
        </div>
        <div class="item-box" style="height:70px">
          <div class="pro">图片路径</div>
          <textarea style="padding-bottom: 10px;" disabled v-model="curPicture.picturePath" class="pro-path" ></textarea>
        </div>
        <div class="item-box">
          <div class="pro">上传时间</div>
          <input disabled v-model="curPicture.uploadTime" class="pro-time" />
        </div>
      </van-dialog>
        
    </div>

    

</template>

<script>
import "../assets/less/myPicture.less";
import { request } from "../util/js/request";
import { myFormatDate } from "../util/js/myFormatDate";
import $ from "jquery";
export default {
  data() {
    return {
      curPage: 1,
      pageSize: 999,
      curPicture: {},
      showEditWindow: false,
      showRemoveWindow: false,
      enableIndex: -1,
      pictureList: [],
      message: "注意：删除后不可恢复！",
    }
  },
  methods: {
    goback() {
      this.$router.push("my");
    },
    curSelect(index) {
      let userToken = localStorage.getItem("token");
      let userId = localStorage.getItem("userId");
      if (userToken == null || userId == null) {
        this.$toast.fail("请登录");
        this.$router.push({ name: "login", query: { name: "myPicture" } });
        return;
      }
      this.enableIndex = index;
      this.curPicture = this.pictureList[index];
    },
    edit() {
      this.showEditWindow = true;
      this.curPicture.uploadTime = myFormatDate(this.curPicture.uploadTime)
    },
    remove() {
      this.showRemoveWindow = true;
    },
    removePicture(action, done) {
      if (action == "confirm") {
        setTimeout(done, 100);
        request({
        method: "post",
        url:
          "user/picture/removePicture",
        params: {
          userId: localStorage.getItem("userId"),
          pictureId: this.curPicture.id
        }
      })
        .then((res) => {
          console.log(res)
          if (res.status == 200) {
            this.$toast.clear();
            this.$toast.success("刪除完成");
            this.getPictureList();
          } else if (res.status == 500) {
            this.$toast.clear();
            this.$toast.success(res.msg);
          }
        })

      }
      if (action == "cancel") {
        setTimeout(done, 100);
      }
      
    },
    upload(files) {
      const bodyFormdata = new FormData();
      var pictureBOs = [];
      console.log(files)

      if (files instanceof Array) {

        files.map((file, index) => {
          bodyFormdata.append("file", file.file);
          pictureBOs[index] = {
            "pictureDesc": file.file.name
          }
        })
      } else {
        bodyFormdata.append("file", files.file);
        pictureBOs[0] = {
          "pictureDesc": files.file.name
        }
      }

      bodyFormdata.append("userId", localStorage.getItem("userId"));

      // console.log(bodyFormdata)

      bodyFormdata.append("pictureBOs", JSON.stringify(pictureBOs));
      request({
        method: "post",
        url:
          "user/picture/upload",
        data: bodyFormdata,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
        .then((res) => {
          console.log(res);
		  console.log('111212112');
          if (res.status == 200) {
            this.$toast.clear();
            this.$toast.success("处理成功");
            this.getPictureList();
          } else if (res.status == 500) {
            this.$toast.clear();
            this.$toast.success(res.msg);
          } else {
		   this.$toast.clear();
            this.$toast(res.msg);
		}
        })
    },
    savePicture(action, done) {
      if (action == "confirm") {
        console.log(action)
        setTimeout(done, 100);
        request({
        method: "post",
        url:
          "user/picture/modifyePicture",
        data: {
          id: this.curPicture.id,
          userId: localStorage.getItem("userId"),
          pictureDesc: this.curPicture.pictureDesc
          // pictureHeight: '',
          // pictureWidth: ''
        }
      })
        .then((res) => {
          console.log(res)
          if (res.status == 200) {
            this.$toast.clear();
            this.$toast.success("处理成功");
            this.getPictureList();
          } else if (res.status == 500) {
            this.$toast.clear();
            this.$toast.success(res.msg);
          }
        })
      }
      if (action == "cancel") {
        setTimeout(done, 100);
      }
    },
    getPictureList() {
      request({
          method: "post",
          url: "user/picture/getAllPictures",
          params: {
            userId: localStorage.getItem("userId"),
            page: this.curPage,
            pageSize: this.pageSize
          },
        })
          .then((res) => {
            if (res.status == 200) {
              this.pictureList = res.data.rows;
            } else {
              this.$toast(res.msg);
            }
          })
    },
  },
  created() {
    let userToken = localStorage.getItem("token");
    let userId = localStorage.getItem("userId");
    if (userToken == null || userId == null) {
      this.$toast.fail("请登录");
      this.$router.push({ name: "login", query: { name: "myPicture" } });
      return;
    }
     this.getPictureList();
  }
};
</script>

<style lang="scss" scoped>
</style>
