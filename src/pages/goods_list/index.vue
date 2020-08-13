<template>
  <view class="goodsList">
    <!-- 搜索组件 -->
    <search-bar></search-bar>
    <!-- tab栏 -->
    <uni-segmented-control
      :current="current"
      :values="tabList"
      @clickItem="onClickItem"
      style-type="text"
      active-color="#eb4450"
      class="tab-list"
    ></uni-segmented-control>
    <!-- 这个模式是没有左右滑动效果 -->
    <!-- <view class="goods-list">
        <view v-if="current === 0" class="total">
            <navigator v-for="(item,index) in totalList" :key="index">
              <view class="goods_img">
                <image :src="item.goods_small_logo||'https://ww1.sinaimg.cn/large/007rAy9hgy1g24by9t530j30i20i2glm.jpg'" class="logo" mode="widthFix"></image>
              </view>
              <view class="list-cont">
                <view class="title">{{item.goods_name}}</view>
                <view class="pric">￥{{item.goods_price}}</view>
              </view>
            </navigator>
        </view>
        <view v-if="current === 1" class="sole">选项卡2的内容</view>
        <view v-if="current === 2" class="price">选项卡3的内容</view>
    </view> -->
    <!-- 使用swiper实现左右滑动效果 -->
    <view class="goods-list">
      <swiper class="total" :current="current" duration="300" @change="huadong">
        <!-- 综合 -->
        <swiper-item>
          <!-- @scrolltoupper="scrollTop" -->
          <!-- :url="'pages/goods_detail/index?id='+item.goods_id" -->
          <scroll-view scroll-y :refresher-triggered="isflag" refresher-enabled @refresherrefresh="scrollTop" @scrolltolower="scrollBottom" class="scroll-box"> 
            <!-- 列表 -->
            <navigator 
            v-for="(item,index) in totalList" 
            :key="item.goods_id" 
            :data-num="index"
            :url="`/pages/goods_detail/index?id=${item.goods_id}`"
            >
              <view class="goods_img">
                <image :src="item.goods_small_logo||'https://ww1.sinaimg.cn/large/007rAy9hgy1g24by9t530j30i20i2glm.jpg'" class="logo" mode="widthFix"></image>
              </view>
              <view class="list-cont">
                <view class="title">{{item.goods_name}}</view>
                <view class="pric">￥{{item.goods_price}}</view>
              </view>
            </navigator>
          </scroll-view>
        </swiper-item>
        <!-- 销量 -->
        <swiper-item>
          <scroll-view scroll-y>我是销量模块</scroll-view>
        </swiper-item>
        <!-- 价格 -->
        <swiper-item>
          <scroll-view scroll-y>我是价格模块</scroll-view>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script>
import searchBar from "components/searchInput";
// 引入uni-ui库
import { uniSegmentedControl } from "@dcloudio/uni-ui";
export default {
  components: { searchBar, uniSegmentedControl },
  data() {
    return {
      tabList: ["综合", "销量", "价格"],
      current: 0,
      params: {
        query: "",
        cid: "",
        pagenum: 1,
        pagesize: 10,
      },
      totalList: [],
      pageNum:1,
      isflag:false
    };
  },
  onLoad(options) {
    // console.log(options);
    let cid = options.id || 5;
    this.params.cid = cid;
    this.getTotalList();
  },
  methods: {
    onClickItem(e) {
      // console.log(e);
      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex;
      }
    },
    huadong(e) {
      // console.log(e);
      this.current = e.detail.current;
    },
    // 获取商品列表数据
    getTotalList(isflag=false) {
      return this.request({url:"/goods/search",data:this.params})
      .then(res=>{
        console.log(res);
        let newTotalList = res.goods
          // 判断如果是下拉的话
          if(!isflag) {
            this.totalList = [...this.totalList,...newTotalList];
            return Math.ceil(res.total/this.params.pagesize);
          } else {
            console.log("正在返回数据");
            return this.totalList = newTotalList;
          }
      })
    },
    // 下拉刷新
    async scrollTop() {
      console.log("下拉动作");
      this.isflag = true;
      this.params.pagenum = 1;
      const res = await this.getTotalList(true);
      if(res.length > 0) {
        console.log("数据已经回来了");
        uni.showToast({
          title:"刷新成功",
          icon:"none"
        })
        this.isflag = false;
      }
    },
    // 上拉加载
    async scrollBottom() {
      console.log("上拉动作");
      // 这里的业务要求是实现上拉加载数据
      this.params.pagenum++;
      this.pageNum = await this.getTotalList();
      // console.log(this.pageNum);
      if(this.params.pagenum > this.pageNum) {
         uni.showToast({
           title:"商品到底了啦...",
           icon:"none"
         })
      }
    }
  },
};
</script>

<style lang="scss">
.goodsList {
  display: flex;
  flex-direction: column;
  height: 100vh;
  .tab-list {
    text {
      font-size: 30rpx;
    }
  }
  .goods-list {
    flex: 1;
    .total {
      height: 100%;
      .scroll-box {
        height: 100%;
        overflow: auto;
        navigator {
          display: flex;
          padding: 10rpx 0;
          border-bottom: 1px solid #ccc;
          .goods_img {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            image {
              width: 80%;
            }
          }
          .list-cont {
            flex: 2;
            position: relative;
            font-size: 30rpx;
            padding: 20rpx 0;
            .title {
              @include ellipsis(2);
            }
            .pric {
              position: absolute;
              bottom: 20rpx;
              left: 0;
              color: $jlg-theme-color;
            }
          }
        }
      }
    }
  }
}
</style>