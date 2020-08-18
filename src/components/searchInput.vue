<template>
  <view class="search-swapper">
    <navigator url="/pages/search/index">搜索</navigator>
  </view>
</template>

<script>
export default {
  methods: {
    handleClick(path) {
      this.$emit("clicked", path);
    },
  },
};
</script>

<style lang="scss">
.search-swapper {
  height: 90rpx;
  padding: 10rpx;
  background-color: $jlg-theme-color;
  navigator {
    text-align: center;
    line-height: 90rpx;
    background-color: #fff;
    border-radius: 10rpx;
    font-size: 30rpx;
  }
}
</style>