<template>
  <view class="category">
    <!-- 引入搜索组件 -->
    <search-bar></search-bar>
    <!-- 分类列表 -->
    <view class="main">
      <!-- 左侧大标题 -->
      <view class="main-slider">
        <view
          :class="['item',currentIndex===index?'active':'']"
          v-for="(item,index) in sliderList"
          :key="index"
          @click="handleClick(index)"
        >{{item}}</view>
      </view>
      <!-- 右侧对应产品 -->
      <scroll-view class="main-product" scroll-y :scroll-top="scrollTop">
        <!-- 产品项 -->
        <view class="product-item" v-for="item in productList" :key="item.cat_id">
          <!-- 产品标题 -->
          <view class="product-title">/ {{item.cat_name}} /</view>
          <!-- 产品列 -->
          <view class="product-list">
            <navigator v-for="item2 in item.children" :key="item2.cat_id">
              <!-- <image :src="item2.cat_icon" mode="widthFix"></image> -->
              <image :src="item2.cat_icon"></image>
              <text>{{item2.cat_name}}</text>
            </navigator>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import searchBar from "components/searchInput.vue";
// 使用全局变量，处理性能消耗的问题
 /* 原因：关于data中的数据有两个作用
      1 页面渲染要使用
      2 全局变量   
 */
let categoryList = [];
export default {
  components: { searchBar },
  data() {
    return {
      // categoryList: [],
      sliderList: [],
      productList: [],
      currentIndex: 0,
      scrollTop:0,
      count:0
    };
  },
  onLoad() {
    // this.getCategoryList();
    // 页面一加载就判断本地存储中是否已经有数据了，没有的话需要重新发送请求获取数据
    let data = uni.getStorageSync("categoryList");
    if(Date.now()-data.time>60*1000) {
      this.getCategoryList();
    } else {
      categoryList = data.categoryList;
      this.sliderList = categoryList.map((item) => item.cat_name);
      this.productList = categoryList[0].children;
    }
  },
  methods: {
    // 获取分类数据
    getCategoryList() {
      uni
        .request({
          url: "https://api-hmugo-web.itheima.net/api/public/v1/categories",
        })
        .then((res) => {
          console.log(res);
          categoryList = res[1].data.message;
          // 因为获取回来的数据很大，那么需要存储在本地存储中，较少请求的次数
          uni.setStorageSync("categoryList",{time:Date.now() ,categoryList:categoryList});
          this.sliderList = categoryList.map((item) => item.cat_name);
          this.productList = categoryList[0].children;
        });
    },
    // 切换产品数据
    handleClick(index) {
      // console.log(index);
      this.currentIndex = index;
      this.productList = categoryList[index].children; 
      this.count = this.count + 1;
      if(this.count<= 1) {
        this.scrollTop = 0.01;
      } else {
        this.count = 0;
        this.scrollTop = 0;
      }

    }
  },
};
</script>

<style lang="scss">
.category {
  display: flex;
  flex-direction: column;
  height: 100vh;
  .main {
    flex: 1;
    // background-color: aqua;
    display: flex;
    overflow: hidden;
    .main-slider {
      width: 180rpx;
      // background-color: yellow;
      overflow: auto;
      .item {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 80rpx;
        font-size: 30rpx;
      }
      .active {
        color: $jlg-theme-color;
        border-left: 4rpx solid $jlg-theme-color;
      }
    }
    .main-product {
      flex: 1;
      // background-color: yellowgreen;
      // overflow: auto;
      .product-item {
        .product-title {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 80rpx;
          font-size: 28rpx;
          color: #000;
        }
        .product-list {
          display: flex;
          flex-wrap: wrap;
          navigator {
            width: 33.33%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            image {
              // width: 50%;
              // 解决在网络有延迟的情况下问题,设置图片默认的宽高
              width:110rpx;
              height: 110rpx;
              background-color:rgba($color: #000, $alpha: .03);
            }
            text {
              padding: 15rpx 0;
              font-size: 28rpx;
            }
          }
        }
      }
    }
  }
}
</style>
