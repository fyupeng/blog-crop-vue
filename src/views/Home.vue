<template>
  <div class="home">
    <div>
      <div class="carousel">
        <van-swipe :autoplay="3000">
          <van-swipe-item v-for="(image, index) in images" :key="index">
            <img v-lazy="image" />
          </van-swipe-item>
        </van-swipe>
      </div>

      <form
        action="/"
        style="margin-left: 10px; margin-right: 10px; margin-top: 10px"
      >
        <van-search
          v-model="key"
          show-action
          placeholder="请输入搜索关键词"
          @search="onSearch"
          @cancel="onCancel"
        />
      </form>

      <div class="hot-list-box">
        <div class="recommend" @click="changeIndex(0)">
          <img src="../assets/icon/recommend.png" />
          <div :class="index == 0 ? 'active-desc' : 'desc'">推荐</div>
        </div>
        <div class="latest" @click="changeIndex(1)">
          <img src="../assets/icon/latest.png" />
          <div :class="index == 1 ? 'active-desc' : 'desc'">最新</div>
        </div>
        <div class="hotpot" @click="changeIndex(2)">
          <img src="../assets/icon/hotpot.png" />
          <div :class="index == 2 ? 'active-desc' : 'desc'">热门</div>
        </div>
        <div class="classfication" @click="goClassfication">
          <img src="../assets/icon/classfication.png" />
          <div class="desc">分类</div>
        </div>
      </div>

      <div class="detail">
        <div id="recommend" class="recommend">
          <div class="item-intro">
            <img class="intro-img" src="../assets/icon/intro-recommend.png" />
            <div class="intro-desc">推荐文章</div>
            <div></div>
          </div>

          <div
            class="detail-item"
            v-for="item in recommendArticleList"
            :key="item.id"
            @click="goDetail(item.id)"
          >
            <img class="item-img" :src="item.articleCoverId ? remoteUrl + remoteDataDir + item.articleCoverUrl : require('../assets/icon/article.jpg')" alt="" />
            <div class="other-info">
              <div class="title">{{ item.title.substr(0,35)+(item.title.substr(35,36)==0 ? '' : '…') }}</div>
              <div class="else">
                <div class="time-box">
                  <div class="time-ago">{{ item.createTimeAgoStr }}</div>
                </div>
                <div class="readCounts">
                  <img class="icon" src="../assets/icon/readCount.png" />
                  <div class="num">{{ item.readCounts }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="article-load-more"
          @click="getMore()"
        >
          <img src="../assets/icon/load-more-1.png" />
          <div class="article-load-name">加载更多</div>
        </div>

        <div class="item-intro">
          <img class="intro-img" src="../assets/icon/intro-latest.png" />
          <div class="intro-desc">最新</div>
          <div></div>
        </div>

        <div id="latest" class="latest">
          <div
            class="detail-item"
            v-for="item in latestArticleList"
            :key="item.id"
            @click="goDetail(item.id)"
          >
            <img class="item-img" src="../assets/icon/article.jpg" :src="item.articleCoverId ? remoteUrl + remoteDataDir + item.articleCoverUrl : require('../assets/icon/article.jpg')" alt="" />
            <div class="other-info">
              <div class="title">{{ item.title }}</div>
              <div class="else">
                <div class="time-box">
                  <div class="time-ago">{{ item.createTimeAgoStr }}</div>
                </div>
                <div class="readCounts">
                  <img class="icon" src="../assets/icon/readCount.png" />
                  <div class="num">{{ item.readCounts }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="article-load-more">
          <img
            src="../assets/icon/load-more-1.png"
            @click="getRecentAllArticles(recentPage + 1)"
          />
          <div class="article-load-name">加载更多</div>
        </div>

        <div class="item-intro">
          <img class="intro-img" src="../assets/icon/intro-hotpot.png" />
          <div class="intro-desc">热门</div>
          <div></div>
        </div>
        <div id="hotpot" class="hotpot">
          <div
            class="detail-item"
            v-for="item in hotpotArticleList"
            :key="item.id"
            @click="goDetail(item.id)"
          >
            <img class="item-img" :src="item.articleCoverId ? remoteUrl + remoteDataDir + item.articleCoverUrl : require('../assets/icon/article.jpg')" alt="" />
            <div class="other-info">
              <div class="title">{{ item.title }}</div>
              <div class="else">
                <div class="time-box">
                  <div class="time-ago">{{ item.createTimeAgoStr }}</div>
                </div>
                <div class="readCounts">
                  <img class="icon" src="../assets/icon/readCount.png" />
                  <div class="num">{{ item.readCounts }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="article-load-more">
          <img
            src="../assets/icon/load-more-1.png"
            @click="getHotpotAllArticles(hotpotPage + 1)"
          />
          <div class="article-load-name">加载更多</div>
        </div>

        <div class="footer">
		
		<!-- 访问量 -->
		<div class="visit-line">
		年访问量：<span>{{ yearVisitCount }}</span> 次 <br>
		当月访问量：<span>{{ yearMonthVisitCount }}</span> 次
		</div>
		
          <a href="mailto:fyp010311@163.com"
            >产品反馈请联系开发者:@fyp</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import "../assets/less/home.less";
import { request } from "../util/js/request";
export default {
  data() {
    return {
      key: "",
      images: [
        require("../assets/icon/grass.jpg"),
        require("../assets/icon/investment.jpg"),
        require("../assets/icon/mushroom.jpg"),
      ],
      index: 0,
      recommendArticleList: [],
      latestArticleList: [],
      hotpotArticleList: [],
      recomendPage: 1,
      recentPage: 1,
      hotpotPage: 1,
      searchPage: 1,
      pageSize: 5,
	 yearVisitCount: 0,
	 yearMonthVisitCount: 0
    };
  },
  async onMounted() {

  },
  async created() {
  const [year, month] = new Date().toISOString().slice(0, 7).split('-')
  console.log(year)
  console.log(year + '-' + month)
  try {
      var data = await axios.get('/openresty/ipCount', {
        params: { date: year + '-' + month }
      });
      this.yearMonthVisitCount = data.data.ipCount ?? 0
	   data = await axios.get('/openresty/ipCount', {
        params: { date: year }
      })  
      this.yearVisitCount = data.data.ipCount ?? 0
    } catch (e) {
      this.yearMonthVisitCount = -1
	    this.yearVisitCount = -1
    }

    var that = this;
    window.addEventListener("offline", function () {
      that.$router.push({ name: "netInterupt" });
      // 网络由正常常到异常时触发
    });

    this.getRecommendAllArticles(this.recomendPage);
    this.getRecentAllArticles(this.recentPage);
    this.getHotpotAllArticles(this.hotpotPage);
  },
  methods: {
    onSearch() {
      this.searchPage = 1;
      this.recommendArticleList = [];
      this.getSearchArticles();
    },
    onCancel() {},
    goClassfication() {
      this.$router.push({ name: "classfication" });
    },
    getSearchArticles() {
      let userToken = localStorage.getItem("token");
      if (userToken == null) {
        this.$toast.fail("请登录");
        this.$router.push({ name: "login", query: { name: "home" } });
        return;
      }
      this.$toast.loading("正在加载....");
      request({
        method: "post",
        url: "user/article/getAllArticles",
        params: {
          searchKey: this.key,
          userId: localStorage.getItem("userId"),
          page: this.searchPage,
          pageSize: this.pageSize
        },
      })
        .then((res) => {
          if (res.status == 200) {
            this.$toast.clear();
            if(res.data == null || res.data.rows.length == 0) {
              this.$toast('已无更多了');
              return;
            }
            let rows = res.data.rows;
            rows.map(element => {
              this.recommendArticleList.push(element);
            });
            this.searchPage = this.searchPage + 1;
          } else {
            this.$toast(res.msg);
          }
        })
    },
    goDetail(articeId) {
      // console.log(articeId);
      this.$router.push({
        name: "detail",
        query: { name: "home", articleId: articeId },
      });
      // this.$router.push({name:"detail",query:{articleId:articeId}});
    },
    getMore() {
      if(this.key != '') {
        this.getSearchArticles();
      } else {
        this.getRecommendAllArticles();
      }
    },
    getRecommendAllArticles() {
      this.$toast.loading("正在加载....");
      request({
        method: "post",
        url: "user/article/getHotArticles",
        params: {
          page: this.recomendPage,
          pageSize: this.pageSize,
        },
      })
        .then((res) => {
          if (res.status == 200) {
            this.$toast.clear();
            if(res.data == null || res.data.rows.length == 0) {
              return;
            }
            let rows = res.data.rows;
            rows.map(element => {
              this.recommendArticleList.push(element);
            });
            this.recomendPage = this.recomendPage + 1;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getRecentAllArticles() {
      this.$toast.loading("正在加载....");
      request({
        method: "post",
        url: "user/article/getRecentArticles",
        params: {
          page: this.recentPage,
          pageSize: this.pageSize,
        },
      })
        .then((res) => {
          if (res.status == 200) {
            this.$toast.clear();
            if(res.data == null || res.data.rows.length == 0) {
              return;
            }
            let rows = res.data.rows;
            rows.map(element => {
              this.latestArticleList.push(element);
            });
            this.recentPage = this.recentPage + 1;
          }
        })
    },
    getHotpotAllArticles() {
      this.$toast.loading("正在加载....");
      request({
        method: "post",
        url: "user/article/getHotArticles",
        params: {
          page: this.hotpotPage,
          pageSize: this.pageSize,
        },
      })
        .then((res) => {
          if (res.status == 200) {
            this.$toast.clear();
            if(res.data == null || res.data.rows.length == 0) {
              return;
            }
            let rows = res.data.rows;
            rows.map(element => {
              this.hotpotArticleList.push(element);
            });
            this.hotpotPage = this.hotpotPage + 1;
            
          }
        })
    },
    changeIndex(index) {
      this.index = index;
      if (index == 0) {
        document
          .getElementById("recommend")
          .scrollIntoView({ block: "center", behavior: "smooth" });
      }
      if (index == 1) {
        document
          .getElementById("latest")
          .scrollIntoView({ block: "center", behavior: "smooth" });
      }
      if (index == 2) {
        document
          .getElementById("hotpot")
          .scrollIntoView({ block: "center", behavior: "smooth" });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>