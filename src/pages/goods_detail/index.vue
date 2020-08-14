<template>
  <view class="goodsDetail" v-if="detailList">
    <!-- 轮播图 -->
    <view class="detail-swiper">
        <swiper autoplay indicator-dots circular>
            <swiper-item v-for="item in detailList.pics" :key="item.pics_id" @click="previewImage(item.pics_mid)">
                <image :src="item.pics_mid" mode="widthFix"></image>
            </swiper-item>
        </swiper>
    </view>
    <!-- 价格 -->
    <view class="detail-price">￥{{detailList.goods_price}}</view>
    <!-- 描述 -->
    <view class="detail-meta">
      <view class="meta-title">{{detailList.goods_name}}</view>
      <view class="meta-send" @click="isflag = !isflag">
        <view class="iconfont icon-shoucang" :class="{active:isflag}"></view>
        <view class="send">收藏</view>
      </view>
    </view>
    <!-- 内容 -->
    <view class="detail-content">
        <view class="cont-title">图文详情</view>
        <rich-text :nodes="detailList.goods_introduce"></rich-text>
    </view>
    <!-- 底部 -->
    <view class="detail-footBox">
        <!-- 客服 -->
        <view class="footBox footBox-kefu">
            <view class="iconfont icon-kefu"></view>
            <view>客服</view>
            <button open-type="contact">contact</button>
        </view>
        <!-- 分享 -->
        <view class="footBox footBox-share">
            <view class="iconfont icon-yixianshi-"></view>
            <view>分享</view>
            <button open-type="share">share</button>
        </view>
        <!-- 购物车 -->
        <navigator open-type="switchTab" url="/pages/cart/index" class="footBox footBox-cart">
            <view class="iconfont icon-gouwuche"></view>
            <view>购物车</view>
        </navigator>
        <!-- 加入购物车 -->
        <view class="footBox-addCart footRight" @click="addCart(detailList.goods_id)">加入购物车</view>
        <!-- 立即购买 -->
        <view class="footBox-shop footRight">立即购买</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
      return {
        detailList:null,
        isflag:false
      }
  },
  onLoad(options) {
    console.log(options);
    const id = options.id || '47869';
    this.request({url:"/goods/detail",data:{goods_id: id}})
    .then(res=>{
        console.log(res.pics);
        this.detailList = res;
    })
  },
  methods: {
    // 预览图片
    previewImage(current){
        const urls=this.detailList.pics.map(v=>v.pics_mid);
        uni.previewImage({
            current,
            urls
        });
    },
    // 加入购物车
    addCart(cartId) {
    //    console.log("点击了购物车");
    console.log(this.detailList);
       const data= uni.getStorageSync("carts");
       console.log(data);
       if(!data.length) {
          this.detailList.nums = 1;
          this.detailList.check = true;
          uni.setStorageSync("carts",[this.detailList]);
          uni.showToast({
              title:"加入购物车成功",
              icon:"none",
              mask:true
          })
       } else {
          data.forEach(item=>{
              if(item.goods_id == this.detailList.goods_id) {
                  console.log(123);
                  item.nums++;
              } else {
                  this.detailList.nums = 1;
                  this.detailList.check = true;
                  data.push(this.detailList);
              }
          })
          uni.setStorageSync("carts",data);
          uni.showToast({
              title:"加入购物车成功",
              icon:"none",
              mask:true
          })
       }
    }
  }
};
</script>

<style lang="scss">
.goodsDetail {
    .detail-swiper {
        swiper {
            height: 400rpx;
            padding: 20rpx 0;
            swiper-item {
                display: flex;
                align-items: center;
                justify-content: center;
                image {
                    width: 400rpx;
                }
            }
        }
    }
    .detail-price {
        padding: 10rpx;
        color: $jlg-theme-color;
        font-size: 36rpx;
    }
    .detail-meta {
        display: flex;
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        padding: 20rpx 0;
        .meta-title {
            flex: 1;
            font-size: 30rpx;
            color: #000;
            padding: 0 20rpx;
        }
        .meta-send {
            padding: 0 30rpx;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border-left: 1px solid ;
            .active {
                color: $jlg-theme-color;
            }
            .send {
                font-size: 30rpx;
            }
        }
    }
    .detail-content {
        padding-bottom: 90rpx;
        .cont-title {
            padding: 20rpx 10rpx 20rpx;
            font-size: 30rpx;
            color: $jlg-theme-color;
        }
    }
    .detail-footBox {
        position: fixed;
        bottom: 0;
        left: 0;
        background-color: #fff;
        border-top: 1px solid #ccc;
        width: 100%;
        height: 90rpx;
        display: flex;
        .footBox {
            position: relative;
            flex: 1;
            font-size: 30rpx;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 10rpx 0;
            button {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
                z-index: 100;
            }
        }
        .footRight {
            flex: 2;
            font-size: 36rpx;
            line-height: 90rpx;
            text-align: center;
            color: #fff;
        }
        .footBox-addCart {
            background-color: orange;
        }
        .footBox-shop {
            background-color: $jlg-theme-color;
        }
    }
}
</style>