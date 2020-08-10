<template>
  <view class="jlg_index">
    <!-- 搜索组件 -->
    <search-bar></search-bar>
    <!-- 轮播图 -->
    <swiper class="swiper-box" autoplay indicator-dots circular>
      <swiper-item v-for="(item,index) in slideList" :key="index">
        <navigator>
          <image :src="item.image_src" mode="widthFix"></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 导航菜单 -->
    <view class="guide-box">
      <navigator class="item-list" v-for="(item,index) in guideList" :key="index">
        <image :src="item.image_src" mode="widthFix"></image>
      </navigator>
    </view>
    <!-- 分类栏目 -->
    <view class="category-box">
      <view class="item-list" v-for="(item,index) in categoryList" :key="index">
        <!-- 分类标题 -->
        <view class="list-title">
          <image :src="item.floor_title.image_src" mode="widthFix"></image>
        </view>
        <!-- 分类列表 -->
        <view class="list">
          <navigator v-for="(item2,index2) in item.product_list" :key="index2">
            <image :mode="index2===0?'widthFix':'scaleToFill'" :src="item2.image_src"></image>
          </navigator>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import searchBar from "components/searchInput.vue";
export default {
  components: { searchBar },
  data() {
    return {
      slideList: [],
      guideList:[],
      categoryList:[]
    };
  },
  async onLoad() {
    uni.showLoading({
      title:"加载中",
      mask:true
    })

    Promise.all([this.getSlideList(),this.getGuideList(),this.getCategoryList()]).then(()=>{
      uni.hideLoading();
    })
  },
  methods: {
    // 获取轮播图数据 返回值都是promise
    getSlideList() {
     return uni.request({url:"https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata"})
        .then((res) => {
          // console.log(res);
          this.slideList = res[1].data.message;
        });
    },
    // 获取导航菜单数据
    getGuideList() {
     return uni.request({url:"https://api-hmugo-web.itheima.net/api/public/v1/home/catitems"})
      .then(res=>{
        // console.log(res);
        this.guideList = res[1].data.message;
      })
    },
    // 获取分类栏目数据
    getCategoryList() {
      return uni.request({url:"https://api-hmugo-web.itheima.net/api/public/v1/home/floordata"})
       .then(res=>{
        //  console.log(res);
         this.categoryList = res[1].data.message;
       })
    }
  },
};
</script>

<style lang="scss">
.swiper-box {
  width: 750rpx;
  height: 340rpx;
  image {
    width: 100%;
  }
}
.guide-box {
  display: flex;
  navigator {
    flex: 1;
    padding: 20rpx;
    box-sizing: border-box;
    image {
      width: 100%;
    }
  }
}
.category-box {
   .item-list {
     .list-title {
       padding-top: 30rpx;
     }
     .list {
       overflow: hidden;
       navigator {
         float: left; 
         width: 33.33%;
         &:nth-last-child(-n+4) {
           padding: 0 0 10rpx 10rpx;
           box-sizing: border-box;
         }
         &:nth-last-child(-n+4) image{
           height: 208rpx;
         }
       }
     }
   }
}
</style>
