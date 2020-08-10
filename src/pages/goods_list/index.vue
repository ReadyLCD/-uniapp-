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
    <view class="goods-list">
        <!-- 综合 -->
        <view v-if="current === 0" class="total">
          <!-- 综合列表 -->
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
        <!-- 销量 -->
        <view v-if="current === 1" class="sole">选项卡2的内容</view>
        <!-- 价格 -->
        <view v-if="current === 2" class="price">选项卡3的内容</view>
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
    };
  },
  onLoad(options) {
    console.log(options);
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
    getTotalList() {
      uni
        .request({
          url: "https://api-hmugo-web.itheima.net/api/public/v1/goods/search",
          data: this.params,
        })
        .then((res) => {
          console.log(res);
          this.totalList = res[1].data.message.goods;
        });
    },
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
    display: flex;
    flex-direction: column;
    overflow: auto;
    .total {
      flex: 1;
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
</style>