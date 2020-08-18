<template>
  <view class="person">
    <!-- 头像-获取用户登录 -->
    <!-- :style="bgPicUrl?bgPicUrl:''" -->
    <view class="imgBox">
      <image class="bgImg" v-if="userInfo.picUrl" :src="userInfo.picUrl"></image>
      <view class="logo" v-if="userInfo.picUrl">
         <image class="logoImg"  :src="userInfo.picUrl"></image>
         <view class="nickname">用户: {{userInfo.nickname}}</view>
      </view>
      <button v-else open-type="getUserInfo" @getuserinfo="getUserEvent">登录</button>
    </view>
    <!-- 店铺-商品 -->
    <view class="product-list">
      <view class="productBox">
        <view class="product">
          <navigator class="list">
            <view class="num">0</view>
            <view class="meta">收藏的商铺</view>
          </navigator>
          <navigator class="list">
            <view class="num">0</view>
            <view class="meta">收藏的商品</view>
          </navigator>
          <navigator class="list">
            <view class="num">0</view>
            <view class="meta">关注的商品</view>
          </navigator>
          <navigator class="list">
            <view class="num">0</view>
            <view class="meta">我的足迹</view>
          </navigator>
        </view>
      </view>
      <view class="orderBox">
        <view class="order-title">我的订单</view>
        <view class="orderlist">
          <navigator class="list">
            <view class="iconfont icon-ding_dan"></view>
            <view class="meta">全部订单</view>
          </navigator>
          <navigator class="list">
            <view class="iconfont icon-fukuantongzhi"></view>
            <view class="meta">待付款</view>
          </navigator>
          <navigator class="list">
            <view class="iconfont icon-receipt-address"></view>
            <view class="meta">待收货</view>
          </navigator>
          <navigator class="list">
            <view class="iconfont icon-tuihuotuikuan_dianpu"></view>
            <view class="meta">退款/退货</view>
          </navigator>
        </view>
      </view>
      <navigator class="address">收货地址管理</navigator>
      <view class="contact">
        <view class="list">
          <view class="meta">联系我们</view>
          <view class="telPhone">400-618-4000</view>
        </view>
        <navigator class="list">意见反馈</navigator>
        <navigator class="list">关于我们</navigator>
        <view class="list" @click="cancelLogin">退出登录</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        // picUrl: "",
        // nickname:"",
        // token:""
      },
    };
  },
  onLoad() {
   this.userInfo = uni.getStorageSync("userInfo") || {};
  },
  methods: {
    // 微信登录
    async getUserEvent(users) {
      console.log(users);
      const {avatarUrl,nickName} = users.detail.userInfo;
      const { encryptedData, rawData, iv, signature } = users.detail;
      //  获取用户的code
      const { code } = (await uni.login())[1];
      //  获取用户登录凭证
      const { token } = await this.request({
        url: "/users/wxlogin",
        method: "post",
        data: {
          encryptedData,
          rawData,
          iv,
          signature,
          code,
        },
      });
      if (token) {
        this.userInfo = {
          picUrl:avatarUrl,
          nickname:nickName,
          token
        }
        uni.setStorageSync("userInfo",this.userInfo);
        uni.showToast({ title: "登录成功" });
      }
    },
    // 退出登录
    cancelLogin() {
      if(!this.userInfo.token) {
        uni.showToast({title:"亲，你还没登录哦"});
      } else {
        this.userInfo = {};
        uni.removeStorageSync("userInfo");
        uni.showToast({title:"注销成功"});
      }
    }
  },
};
</script>

<style lang="scss">
.person {
  height: 100vh;
  .imgBox {
    position: relative;
    display: flex;
    justify-content: center;
    height: 45vh;
    border-bottom: 1px solid #ccc;
    button {
      width: 200rpx;
      height: 100rpx;
      margin-top: 200rpx;
    }
    .bgImg {
      width: 100%;
      object-fit: cover;
      filter: blur(2px);
    }
    .logo {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      text-align: center;
      .logoImg {
        width: 200rpx;
        height: 200rpx;
        border-radius: 50%;
      }
      .nickname {
        font-size: 32rpx;
        color: #333;
        padding: 20rpx 0;
      }
    }
  }
  .product-list {
    position: relative;
    padding: 80rpx 40rpx 0;
    background-color: #edece8;
    .productBox {
      position: absolute;
      top: -40rpx;
      left: 0;
      width: 100%;
      padding: 0 40rpx;
      box-sizing: border-box;
      .product {
        display: flex;
        background-color: #fff;
        .list {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 28rpx;
          padding: 10rpx 0;
          .num {
            color: $jlg-theme-color;
          }
        }
      }
    }
    .orderBox {
      background-color: #fff;
      font-size: 28rpx;
      .order-title {
        padding: 15rpx;
        border-bottom: 1px solid #ccc;
      }
      .orderlist {
        display: flex;
        .list {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 10rpx 0;
          .iconfont {
            color: $jlg-theme-color;
          }
        }
      }
    }
    .address {
      padding: 15rpx;
      font-size: 28rpx;
      margin: 30rpx 0;
      background-color: #fff;
    }
    .contact {
      .list {
        display: flex;
        padding: 15rpx;
        border-bottom: 1px solid #ccc;
        font-size: 28rpx;
        background-color: #fff;
        &:last-child {
          border-bottom: 0;
        }
        .meta {
          flex: 1;
        }
        .telPhone {
          flex: 1;
          text-align: right;
        }
      }
    }
  }
}
</style>
