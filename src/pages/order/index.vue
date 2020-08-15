<template>
  <view class="cartList">
    <!-- 获取收货地址 -->
    <view class="cartAddress">
      <!-- 地址 -->
      <view class="address" v-if="address.userName">
        <view class="top">
          <text class="left">{{address.userName}}</text>
          <text class="right">{{address.telNumber}}</text>
        </view>
        <view class="bottom">{{newAddress}}</view>
      </view>
    </view>
    <!-- 购物车 -->
    <view class="cart">
      <!-- 标题 -->
      <view class="title">购物车</view>
      <!-- 购物车列表 -->
      <view class="listBox">
        <view class="list-item" v-for="item in carts" :key="item.goods_id">
          <view class="imgBox">
            <image :src="item.goods_small_logo" mode="widthFix"></image>
          </view>
          <view class="meta">
            <view class="metas">{{item.goods_name}}</view>
            <view class="priceNum">
              <view class="price">￥{{item.goods_price}}</view>
              <view class="number">
                <view class="val"> x {{item.nums}}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 底部结算栏 -->
    <view class="payBox">
      <view class="totalMoney">
        <view class="money">合计:<text>￥{{totalMoney}}</text></view>
        <view class="about">包含运费</view>
      </view>
      <view class="payMoney">
        支付({{allCates}})
        <button open-type="getUserInfo" @getuserinfo="setUser">获取用户信息</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      address: {},
      carts:[]
    };
  },
  onShow() {
    let carts = uni.getStorageSync("carts") || [];
    this.carts = carts.filter(item=>{
      return item.check;
    })
    this.address = uni.getStorageSync("address",{});
   
  },
  computed: {
    // 获取收货地址
    newAddress() {
      return (
        this.address.provinceName +
        this.address.cityName +
        this.address.countyName +
        this.address.detailInfo
      );
    },
    // 获取总价钱
    totalMoney() {
      let sum = 0;
      this.carts.forEach(item=>{
        if(item.check) {
          sum+=item.goods_price*item.nums;
        }
      })
      return sum;
    },
    // 获取支付数量
    allCates() {
      let newCarts = this.carts.filter(item=>item.check)
      return newCarts.length;
    }
  },
  methods: { 
    // 获取用户信息
    async setUser(userInfo) {
      //  console.log(userInfo);
       const { encryptedData,rawData,iv,signature } = userInfo.detail;
      //  获取用户的code
       const {code} = (await uni.login())[1];
      //  获取用户登录凭证
       const {token} = await this.request({
            url:"/users/wxlogin",
            method:"post",
            data: {
                encryptedData,
                rawData,
                iv,
                signature,
                code
            }
        })
        // console.log(token);
        const orderData = {
            order_price: this.totalMoney,
            consignee_addr: this.newAddress,
            goods: this.carts.map(item=>{
              return {
                goods_id:item.goods_id,
                goods_number:item.nums,
                goods_price:item.goods_price
              }
            })
        }
        const header = {
            Authorization: token
        }
        // 获取订单编号
        const {order_number} = await this.request({
          url:"/my/orders/create",
          method: "post",
          header,
          data: orderData
        })
        console.log(order_number);
        // 获取支付参数
        const {pay} = await this.request({
          url:"/my/orders/req_unifiedorder",
          method:"post",
          header,
          data: {
            order_number
          }
        })
        // console.log(pay);
        await uni.requestPayment(pay);
        const res = await this.request({
          url:"/my/orders/chkOrder",
          method:'post',
          header,
          data: {
            order_number
          }
        })
        console.log(res);
        if(res=="支付成功") {
          uni.showToast({ title: "支付成功" });
          const newCarts = uni.getStorageSync("carts").filter(item=>{
            return !item.check
          })
          uni.setStorageSync('carts',newCarts); 
          uni.switchTab({url:"/pages/user/index"})
        }
    }
  },
};
</script>

<style lang="scss">
.cartList {
  .cartAddress {
    padding: 20rpx;
    .address {
      display: flex;
      flex-direction: column;
      font-size: 30rpx;
      .top {
        display: flex;
        .left {
          flex: 1;
        }
        .right {
          flex: 1;
          text-align: right;
        }
      }
    }
  }
  .cart {
    .title {
      padding: 30rpx;
      color: $jlg-theme-color;
      border-top: 1px solid currentColor;
      border-bottom: 1px solid currentColor;
    }
    .listBox {
      .list-item {
        display: flex;
        padding: 10rpx;
        align-items: center;
        border-bottom: 1px solid $jlg-theme-color;
        .imgBox {
            padding: 0 20rpx;
          image {
            width: 142rpx;
            height: 142rpx;
          }
        }
        .meta {
           padding: 0 10rpx;
          flex: 1;
          .metas {
            font-size: 30rpx;
            color: #333;
            @include ellipsis(2);
            margin-bottom: 20rpx;
          }
          .priceNum {
            display: flex;
            .price {
              flex: 1;
              font-size: 36rpx;
              color: $jlg-theme-color;
            }
            .number {
              flex: 1;
              .val {
                text-align: right;
                line-height: 46rpx;
                margin: 0 20rpx;
              }
            }
          }
        }
      }
    }
  }
  .payBox {
      position: fixed;
      left: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      width: 100%;
      height: 90rpx;
      border-top: 1px solid #666;
      .totalMoney {
        flex: 4;
        height: 100%;
        font-size: 30rpx;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        flex-direction: column;
        padding-right: 15rpx;
        text {
          color: $jlg-theme-color;
        }
      }
      .payMoney {
        position: relative;
        flex: 2;
        height: 90rpx;
        text-align: center;
        line-height: 90rpx;
        background-color: $jlg-theme-color;
        color: #fff;
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
    }
}
</style>
