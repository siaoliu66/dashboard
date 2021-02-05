<template>
    <div>
        <loading :active.sync="isLoading"></loading>
        <div class="text-right mt-4">
            <button class="btn btn-primary" @click="openModal(true)">建立新的優惠券</button>
        </div>
        <table class="table mt-4">
            <thead>
                <tr>
                    <th>優惠券名稱</th>
                    <th>優惠券代碼</th>
                    <th>折扣</th>
                    <th>到期日</th>
                    <th>是否啟用</th>
                    <th>編輯</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in lists" :key="item.id">
                    <td>{{ item.title }}</td>
                    <td>{{ item.code }}</td>
                    <td>{{ item.percent }}</td>
                    <td>{{ item.due_date }}</td>
                    <td>
                        <span v-if="item.is_enabled" class="text-success">啟用</span>
                        <span v-else>未啟用</span>
                    </td>
                    <td>
                        <button class="btn btn-outline-primary btn-sm" @click="openModal(false,item)">編輯</button>
                        <button class="btn btn-outline-danger btn-sm" @click="opendelModal(item)">刪除</button>
                    </td>
                </tr>
            </tbody>
        </table>
        
        <!-- Modal -->
        <div class="modal fade" id="ordersModal" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content border-0">
            <div class="modal-header bg-primary text-white">
                <h5 class="modal-title" id="exampleModalLabel">
                <span>新增優惠劵</span>
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="row">
                <div class="col-sm">
                    <div class="form-group">
                    <label for="title">優惠劵名稱</label>
                    <input type="text" class="form-control" id="title"
                        placeholder="請輸入標題" v-model="tempProduct.title">
                    </div>
                    <div class="form-group">
                    <label for="code">優惠劵代碼</label>
                    <input type="text" class="form-control" id="code"
                        placeholder="請輸入代碼" v-model="tempProduct.code">
                    </div>
                   <div class="form-group">
                    <label for="percent">折扣</label>
                    <input type="number" class="form-control" id="percent"
                        placeholder="請輸入折扣" v-model="tempProduct.percent">
                    </div>
                    <div class="form-group">
                    <label for="due_date">到期日</label>
                     <input type="text" class="form-control" id="due_date" placeholder="請輸入到期日，格式為 西元-月-日" v-model="tempProduct.due_date">
                    </div>
                    <div class="form-group">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox"
                        id="is_enabled"  v-model="tempProduct.is_enabled" :true-value="1" :false-value="0">
                        <label class="form-check-label" for="is_enabled">
                        是否啟用
                        </label>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                <button type="button" class="btn btn-primary" @click="updateConpon()">確認</button>
            </div>
            </div>
        </div>
        </div>
        <!-- delete modal -->
        <div class="modal fade" id="delconponModal" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content border-0">
            <div class="modal-header bg-danger text-white">
                <h5 class="modal-title" id="exampleModalLabel">
                <span>刪除優惠劵</span>
                </h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                是否刪除 <strong class="text-danger">{{ tempProduct.title }}</strong> 優惠劵(刪除後將無法恢復)。
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                <button type="button" class="btn btn-danger" @click="delConpon()"
                >確認刪除</button>
            </div>
            </div>
        </div>
        </div>
        
    </div>
</template>

<script>
import $ from 'jquery'
export default {
    data (){
        return {
            lists:[],
            isNew:false,
            tempProduct:{},
            isLoading: false,
        }
    },
    methods: {
        getConpon(page = 1) {
            const api = `${process.env.APIPATH}/api/${process.env.APIID}/admin/coupons?page=${page}`
            const vm = this
            this.$http.get(api).then((response) => {
                console.log(response)
                this.lists = response.data.coupons

                vm.lists.forEach((item) => {
                const dates = new Date(item.due_date * 1000);
                const year = dates.getFullYear();
                const month = dates.getMonth() + 1;
                const date = dates.getDate();
                item.due_date = `${year}/${month}/${date}`
                }) //讓Unix Timestamp轉回一般日期格式顯示
            })
        },
        updateConpon() {
            // this.times = Math.floor(Date.now())
            let api = `${process.env.APIPATH}/api/${process.env.APIID}/admin/coupon`
            let httpmethod = 'post'
            const vm = this
            vm.tempProduct.due_date = Math.floor(new Date(vm.tempProduct.due_date) / 1000)

            if(!vm.isNew){
                api = `${process.env.APIPATH}/api/${process.env.APIID}/admin/coupon/${vm.tempProduct.id}`
                httpmethod = 'put'
            }
            this.$http[httpmethod](api,{data:vm.tempProduct}).then((response) => {
                console.log(response.data)
                $('#ordersModal').modal('hide')
                this.getConpon()
            })
        },
        openModal(isNew,item){
            if(isNew){
                this.tempProduct = {}
                this.isNew = true
            }else{
                this.tempProduct = Object.assign({},item)
                this.isNew = false
            }
            $('#ordersModal').modal('show')
        },
        opendelModal(item){
            this.tempProduct = Object.assign({},item)
            $('#delconponModal').modal('show')
        },
        delConpon() {
            console.log()
            const api = `${process.env.APIPATH}/api/${process.env.APIID}/admin/coupon/${this.tempProduct.id}`
            this.$http.delete(api).then((response) => {
                console.log(response)
                $('#delconponModal').modal('hide')
                this.getConpon()
            })
        },
    },
    created() {
        this.getConpon()
    },
}
</script>