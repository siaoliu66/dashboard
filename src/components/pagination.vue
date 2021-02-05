<template>
    <div>
    <nav aria-label="Page navigation example">
        <ul class="pagination">
            <li class="page-item" :class="{'disabled' : !pages.has_pre}"  @click.prevent="getproducts(pages.current_page-1)">
                <a class="page-link" href="#" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li class="page-item" v-for="page in pages.total_pages" :key="page" 
            :class="{'active': pages.current_page == page}" @click.prevent="getproducts(page)">
                <a class="page-link" href="#">{{ page }}</a>
            </li>
            <li class="page-item" :class="{'disabled' : !pages.has_next}" @click.prevent="getproducts(pages.current_page+1)">
                <a class="page-link" href="#" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        </ul>
    </nav>
    </div>
</template>

<script>
export default {
    props: [ 'pages'] ,
    methods: {
        getproducts(page) {
            this.$emit('emit-page', page);
        },
    },
}
</script>