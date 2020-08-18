<template>
  <view class="search-wrapper">
    <view class="inputBox">
      <input v-model="textVal" type="text" placeholder="请输入你要搜索的产品" @input="handleInput" />
      <view class="cancel" v-if="textVal" @click="cancelEvent">取消</view>
    </view>
    <view class="search-list">
      <navigator
        class="list"
        v-for="item in list"
        :key="item.goods_id"
        :url="`/pages/goods_detail/index?id=${item.goods_id}`"
      >{{item.goods_name}}</navigator>
    </view>
  </view>
</template>

<script>
let timerId = null;
export default {
  data() {
    return {
      textVal: "",
      list: [],
    };
  },
  methods: {
    handleInput(e) {
      //   console.log(e.target.value);
      const val = e.target.value;
      if (val.trim()) {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
          // console.log(e.target.value);
          this.getList(e.target.value);
        }, 1000);
      } else {
        this.list = [];
      }
    },
    async getList(text) {
      const res = await this.request({
        url: "/goods/qsearch",
        data: {
          query: text,
        },
      });
      console.log(res);
      this.list = res;
    },
    cancelEvent() {
      this.textVal = "";
    },
  },
};
</script>

<style lang="scss">
.search-wrapper {
  display: flex;
  flex-direction: column;
  background-color: #ccc;
  padding: 30rpx;
  box-sizing: border-box;
  height: 100vh;
  .inputBox {
    display: flex;
    input {
      flex: 1;
      height: 80rpx;
      padding-left: 20rpx;
      border: 0;
      border-radius: 10rpx;
      background-color: #fff;
    }
    .cancel {
      width: 120rpx;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      font-size: 28rpx;
      background-color: #fff;
      margin: 0 10rpx;
      border-radius: 10rpx;
    }
  }
  .search-list {
    flex: 1;
    margin-top: 30rpx;
    background-color: #fff;
    overflow: auto;
    border-radius: 10rpx;
    .list {
      padding: 15rpx 10rpx;
      border-bottom: 1px solid #333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 30rpx;
      &:last-child {
        border-bottom: 0;
      }
    }
  }
}
</style>