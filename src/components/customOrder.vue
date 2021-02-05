<template>
    <div>
        <loading :active.sync="isLoading"></loading>
        <div class="row mt-4">
            <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
                <div class="card border-0 shadow-sm">
                    <div style="height: 150px; background-size: cover; background-position: center;"
                    :style="{backgroundImage: `url(${item.imageUrl})`}">
                    </div>
                    <div class="card-body">
                    <span class="badge badge-secondary float-right ml-2">{{ item.category }}</span>
                    <h5 class="card-title">
                        <a href="#" class="text-dark">{{ item.title }}</a>
                    </h5>
                    <p class="card-text">{{ item.content }}</p>
                    <div class="d-flex justify-content-between align-items-baseline">
                        <div class="h5" v-if="!item.price" >{{ item.origin_price | currency }} 元</div>
                        <del class="h6" v-if="item.price" >原價 {{ item.origin_price | currency }} 元</del>
                        <div class="h5" v-if="item.price" >現在只要 {{ item.price | currency }} 元</div>
                    </div>
                    </div>
                    <div class="card-footer d-flex">
                    <button type="button" class="btn btn-outline-secondary btn-sm" @click.prevent.prevent="getproduct(item.id)" 
                    >
                        <i class="fas fa-spinner fa-spin" v-if="status.isLoadingitem === item.id"></i>
                        查看更多
                    </button>

                    <!-- productModal start -->
                    <div class="modal fade" id="productModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">{{ product.title }}</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        <div class="modal-body">
                            <img :src="product.imageUrl" class="img-fluid" alt="">
                            <blockquote class="blockquote mt-3">
                                <p class="mb-0">{{ product.content }}</p>
                                <footer class="blockquote-footer text-right">{{ product.description }}</footer>
                            </blockquote>
                            <div class="d-flex justify-content-between align-items-baseline">
                                <div class="h4" v-if="!product.price">{{ product.origin_price | currency }} 元</div>
                                <del class="h6" v-if="product.price">原價 {{ product.origin_price | currency }} 元</del>
                                <div class="h4" v-if="product.price">現在只要 {{ product.price | currency }} 元</div>
                            </div>
                            <select name="" class="form-control mt-3" v-model="product.num">
                                <option :value="num" v-for="num in 10" :key="num">
                                    選購 {{num}} {{product.unit}}
                                </option>
                            </select>
                        </div>
                        <div class="modal-footer">
                            <div class="text-muted text-nowrap mr-3">
                                小計 <strong>{{ product.num * product.price }}</strong> 元
                            </div>
                            <button type="button" class="btn btn-primary" @click.prevent.prevent="addTocart(product.id, product.num)">
                                <i class="fas fa-spinner fa-spin" v-if="product.id === status.loadingItem"></i>
                                加到購物車
                            </button>
                        </div>
                        </div>
                    </div>
                    </div>
                    <!-- productModal final -->
                    <button type="button" class="btn btn-outline-danger btn-sm ml-auto" @click.prevent.prevent="addTocart(item.id)">
                        <i class="fas fa-spinner fa-spin" v-if="status.isLoadingitem === item.id"></i>
                        加到購物車
                    </button>
                    </div>
                </div>
            </div>
        </div>
        <pagination :pages="pagination" @emit-page="getproducts" />

        <div class="my-5 row justify-content-center" >
            <div class="col-md-6">
            <table class="table">
                <thead>
                    <th width="100"></th>
                    <th>品名</th>
                    <th width="100">數量</th>
                    <th width="100">單價</th>
                </thead>
                <tbody>
                    <tr v-for="item in cart.carts" :key="item.id">
                    <td class="align-middle">
                        <button type="button" class="btn btn-outline-danger btn-sm" @click.prevent.prevent="delcart(item.id)">
                        <i class="far fa-trash-alt"></i>
                        </button>
                    </td>
                    <td class="align-middle">
                        {{ item.product.title }}
                        <div class="text-success" v-if="item.coupon">
                        已套用優惠券
                        </div>
                    </td>
                    <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
                    <td class="align-middle text-right">{{ item.final_total | currency }}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                    <td colspan="3" class="text-right">總計</td>
                    <td class="text-right">{{ cart.total | currency }}</td>
                    </tr>
                    <tr v-if="cart.final_total !== cart.total">
                    <td colspan="3" class="text-right text-success">折扣價</td>
                    <td class="text-right text-success">{{ cart.final_total | currency }}</td>
                    </tr>
                </tfoot>
            </table>
                <div class="input-group mb-3 input-group-sm">
                    <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="conpon_code">
                    <div class="input-group-append">
                        <button class="btn btn-outline-secondary" type="button" @click.prevent.prevent="addConponCode()">
                        套用優惠碼
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="my-5 row justify-content-center">  
            <validation-observer v-slot="{ invalid }" class="col-md-6">           
                <form @submit.prevent="createOrder">
                    <validation-provider rules="required|email" v-slot="{ errors,classes }" class="form-group">
                        <div class="form-group">
                            <!-- 輸入框 -->
                            <label for="email">Email</label>
                            <input id="email" type="email" name="email" v-model="form.user.email"
                                class="form-control" :class="classes">
                            <!-- 錯誤訊息 -->
                            <span class="invalid-feedback">{{ errors[0] }}</span>
                        </div>
                    </validation-provider>
                    <validation-provider rules="required" v-slot="{ errors,classes }" class="form-group">
                        <div class="form-group">
                            <!-- 輸入框 -->
                            <label for="username">收件人姓名</label>
                            <input id="username" type="name" name="name" v-model="form.user.name"
                                class="form-control" :class="classes">
                            <!-- 錯誤訊息 -->
                            <span class="invalid-feedback">{{ errors[0] }}</span>
                        </div>
                    </validation-provider>
                    <validation-provider :rules="{ regex: /^09\d{8}$/ }" v-slot="{ errors,classes }" class="form-group">
                        <div class="form-group">
                            <!-- 輸入框 -->
                            <label for="usertel">收件人電話</label>
                            <input id="usertel" type="tel" name="tel" v-model="form.user.tel"
                                class="form-control" :class="classes">
                            <!-- 錯誤訊息 -->
                            <span class="invalid-feedback">{{ errors[0] }}</span>
                        </div>
                    </validation-provider>
                    <validation-provider rules="required" v-slot="{ errors,classes }" class="form-group">
                        <div class="form-group">
                            <!-- 輸入框 -->
                            <label for="useraddress">收件人地址</label>
                            <input id="useraddress" type="address" name="address" v-model="form.user.address"
                                class="form-control" :class="classes">
                            <!-- 錯誤訊息 -->
                            <span class="invalid-feedback">{{ errors[0] }}</span>
                        </div>
                    </validation-provider>
                    <validation-provider  v-slot="{ errors,classes }" class="form-group">
                        <div class="form-group">
                            <!-- 輸入框 -->
                            <label for="comment">留言</label>
                            <textarea name="" id="comment" class="form-control" 
                            cols="30" rows="10" v-model="form.message" :class="classes"></textarea>
                            <!-- 錯誤訊息 -->
                            <span class="invalid-feedback">{{ errors[0] }}</span>
                        </div>
                    </validation-provider>

                    <div class="text-right">
                    <button class="btn btn-danger" :disabled="invalid">送出訂單</button>
                    </div>
                </form>
            </validation-observer>
        </div>
        
        
          
    </div>
</template>

<script>
import pagination from './pagination'
import $ from 'jquery'

export default {
    components: {
        pagination
    },
    data (){
        return {
            products:[],
            product:{},
            isLoading: false,
            pagination:{},
            status:{
                isLoadingitem: ''
            },
            cart:{},
            conpon_code:'',
            form:{
                user:{
                    name:'',
                    email:'',
                    tel:'',
                    address:''
                },
                message:''
            }
        }
    },
    methods: {
        getproducts(page = 1){
            const api = `${process.env.APIPATH}/api/${process.env.APIID}/products?page=${page}`
            const vm = this
            vm.isLoading = true
            this.$http.get(api).then((response) => {
                console.log(response.data)
                this.products = response.data.products
                vm.isLoading = false
                vm.pagination = response.data.pagination
            })
        },
        getproduct(id){
            const vm = this;
            const url = `${process.env.APIPATH}/api/${process.env.APIID}/product/${id}`;
            vm.status.loadingItem = id;
            this.$http.get(url).then((response) => {
                vm.product = response.data.product;
                $('#productModal').modal('show');
                console.log(response);
                vm.status.loadingItem = '';
                vm.product.num = 1 //預設數量
            });
        },
        addTocart(id,qty = 1) {
            const vm = this;
            const url = `${process.env.APIPATH}/api/${process.env.APIID}/cart`
            vm.status.loadingItem = id;
            const cart = {
                "product_id":id,
                qty
            }
            this.$http.post(url,{data:cart}).then((response) => {
                // vm.cart = response.data.data;
                console.log(response);
                vm.status.loadingItem = '';
                vm.getcartproduct()
                $('#productModal').modal('hide');
            });
        },
        delcart(id){
            const vm = this;
            const url = `${process.env.APIPATH}/api/${process.env.APIID}/cart/${id}`
            this.$http.delete(url).then((response) => {
                // console.log(response.data);
                vm.getcartproduct()
            });
        },
        getcartproduct(){
            const vm = this;
            const url = `${process.env.APIPATH}/api/${process.env.APIID}/cart`
            vm.isLoading = true
            this.$http.get(url).then((response) => {
                vm.cart = response.data.data;
                // console.log(response.data.data.carts);
                vm.isLoading = false
            });
        },
        addConponCode(){
            const vm = this;
            const url = `${process.env.APIPATH}/api/${process.env.APIID}/coupon`
            const code = {
                code: vm.conpon_code
            }
            vm.isLoading = true
            this.$http.post(url,{data:code}).then((response) => {
                console.log(response.data);
                if(response.data.success){
                    vm.isLoading = false
                    vm.conpon_code=''
                    vm.getcartproduct()
                }else{
                    vm.isLoading = false
                    vm.conpon_code=''
                    this.$bus.$emit('message:push',response.data.message,'warning');
                }
            });
        },
        createOrder(){
            const vm = this;
            const url = `${process.env.APIPATH}/api/${process.env.APIID}/order`;
            const order = vm.form;
            vm.isLoading = true;
            this.$http.post(url, { data: order }).then((response) => {
                console.log('訂單已建立',response);
                if(response.data.success){
                    vm.isLoading = false;
                    vm.$router.push(`/custom_order_check/${response.data.orderId}`)
                }else{
                    console.log(response.data.message);
                    vm.isLoading = false;
                }
                this.$emit('message:push',response.data.message,'warning')
            });
        },
    },
    created() {
        this.getproducts()
        this.getcartproduct()
    }
}
</script>