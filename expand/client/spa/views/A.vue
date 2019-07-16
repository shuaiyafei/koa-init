<template>
  <div>
    <h2>A</h2>
    <p>
      <router-link to="b">jump B component</router-link>
    </p>
    <p>
      <router-link to="c">jump C component</router-link>
    </p>
  </div>
</template>

<style lang="scss" scoped>
div {
  display: flex;
  flex-wrap: wrap;
}
h2 {
  width: 100%;
  text-align: center;
}
p {
  width: 100%;
  text-align: center;
}

</style>


