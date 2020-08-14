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
      <!-- 按钮 -->
      <button v-else @click="chooseAddress">获取收货地址</button>
    </view>
    <!-- 购物车 -->
    <view class="cart">
      <!-- 标题 -->
      <view class="title">购物车</view>
      <!-- 购物车列表 -->
      <view class="listBox" v-if="carts.length>0">
        <view class="list-item" v-for="(item,index) in carts" :key="item.goods_id">
          <checkbox-group class="check" @change="changeSelect(index)">
            <checkbox :checked="item.check"></checkbox>
          </checkbox-group>
          <view class="imgBox">
            <image :src="item.goods_small_logo" mode="widthFix"></image>
          </view>
          <view class="meta">
            <view class="metas">{{item.goods_name}}</view>
            <view class="priceNum">
              <view class="price">￥{{item.goods_price}}</view>
              <view class="number">
                <view class="update" @click="delNum(-1,index)">-</view>
                <view class="val">{{item.nums}}</view>
                <view class="update" @click="addNum(1,index)">+</view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <!-- 没有购物订单 -->
    <view class="tips" v-else>亲，你的购物车还没有订单哦</view>
    </view>
    <!-- 底部结算栏 -->
    <view class="payBox">
      <checkbox-group @change="checkAll">
        <checkbox :checked="allCheck">全选</checkbox>
      </checkbox-group>
      <view class="totalMoney">
        <view class="money">合计:<text>￥{{totalMoney}}</text></view>
        <view class="about">包含运费</view>
      </view>
      <view class="payMoney">结算({{allCates}})</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      address: {},
      carts:[],
      allCheckState: false,
      /* totalMoney: 0,
      allCheck: false,
      allCates: 0 */
    };
  },
  onShow() {
    this.carts = uni.getStorageSync("carts") || [];
    this.address = uni.getStorageSync("address",{});
  },
  watch:{
    /* carts: {
      handler() {
        this.allCheck = this.carts.every(item=>item.check);
        console.log(this.allCheck);
        this.totalMoney = this.getTotalMoney();
        this.allCates = this.carts.length;
      },
      deep:true,
      immediate:true
    } */
    carts: {
      handler(newCarts,oldCarts) {
        uni.setStorageSync("carts",newCarts);
      },
      deep:true
    }
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
    // 是否全选
    allCheck() {
      if(this.carts.length === 0) {
        this.allCheckState = false;
        return false;
      } else {
        // every 当空数组调用的时候，返回值一直都是true
        let isFlag = this.carts.every(item=>{
           return item.check;
        });
        this.allCheckState = isFlag;
        return isFlag
        /* return this.carts.every(item=>{
           return item.check;
        }); */
      }
    },
    // 获取结算种类
    allCates() {
      let newCarts = this.carts.filter(item=>item.check)
      return newCarts.length;
    }
  },
  methods: {
    /* getTotalMoney() {
       let sum = 0;
       this.carts.forEach(item=>{
        if(item.check) {
          sum+=item.goods_price*item.nums;
        }
      })
      return sum;
    }, */
    // 获取地址
    chooseAddress() {
      uni.chooseAddress({
        success: (res) => {
          console.log(res);
          this.address = res;
          uni.setStorageSync("address",res);
        },
      });
    },
    //购物列表选中
    changeSelect(index) {
      this.carts[index].check = !this.carts[index].check;
    },
    // 全选全不选
    checkAll() {
      this.carts = this.carts.map(item=>{
        return {
          ...item,
          check: !this.allCheckState
        }
      })
    },
    // 增减数量
    delNum(unit,index) {
      if(this.carts[index].nums <= 1) {
        uni.showModal({
           title: '提示',
           content: '亲，是否要删除该商品？',
           success: (result) => {
             console.log(result);
             if(result.confirm) {
               this.carts.splice(index,1);
             }
           },
         })
      } else {
        this.carts[index].nums +=unit;
      }
    },
    addNum(unit,index) {
      this.carts[index].nums +=unit;
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
    button {
      background-color: #fff;
      color: $jlg-theme-color;
      border: 1px solid currentColor;
      font-size: 35rpx;
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
        .check {
          flex: 1;
        }
        .imgBox {
          flex: 2;
          image {
            width: 142rpx;
            height: 142rpx;
          }
        }
        .meta {
          flex: 4;
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
              display: flex;
              .update {
                width: 46rpx;
                height: 46rpx;
                text-align: center;
                line-height: 46rpx;
                border: 1px solid #333;
              }
              .val {
                line-height: 46rpx;
                margin: 0 20rpx;
              }
            }
          }
        }
      }
    }
  }
  .tips {
    text-align: center;
    padding: 20rpx;
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
      checkbox-group {
         flex: 2;
         margin-left: 10rpx;
      }
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
        flex: 2;
        height: 90rpx;
        text-align: center;
        line-height: 90rpx;
        background-color: $jlg-theme-color;
        color: #fff;
      }
    }
}
</style>
