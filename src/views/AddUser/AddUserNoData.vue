<template>
  <div class="no-data">
    <span>此用户不存在</span>
    <span>无法找到此用户，请确认您填写的 ID 是否正确。</span>
  </div>
</template>

<script>

export default {
};
</script>

<style lang="scss" scoped>
.home-wrapper {
  .no-data {
    margin: 2em 0;
    span {
      display: block;
      text-align: center;
      height: 2em;
      &:nth-child(2) {
        color: #b3b3b3;
        font-size: 14px;
      }
    }
  }
}
.hichat-pc {
  .no-data {
    margin: 7em 0 0 0;
    span {
      height: 2.5em;
    }
  }
}
</style>
