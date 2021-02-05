<template>
    <div>
      <navbar/>
      <alert/>
      <div class="container-fluid">
      <div class="row">
      <sidebar></sidebar>
      <main class="col-md-9 ml-sm-auto col-lg-10 px-md-4">
        <router-view></router-view>
        <!-- <pagination :pages="pagination" @emit-page="getproducts" /> -->
      </main>
      </div>
      </div>
    </div>
</template>


<script>
import navbar from './navbar'
import sidebar from './sidebar'
import alert from './alertMessage'
// import pagination  from './pagination'

export default {
  // data() {
  //    return {
  //      pagination: {},
  //    };
  //  },
  components:{
    navbar,sidebar,alert,
  },
  // methods:{
  //   getproducts(page = 1){
  //       const api = `${process.env.APIPATH}/api/${process.env.APIID}/products?page=${page}`
  //       const vm = this
  //       this.$http.get(api).then((response) => {
  //           console.log(response.data)
  //           vm.pagination = response.data.pagination
  //       })
  //   },
  // },
  created() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    this.$http.defaults.headers.common.Authorization = `${token}`;
    // this.getproducts();
  },
}
</script>