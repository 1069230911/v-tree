<template>
    <!-- 虚拟列表 -->
    <div class="virtual-list-wrapper" @scroll="handleScroll">
        <div class="list-bar" :style="totalHeight" ref="listBar"></div>
        <ul class="list-ctx" ref="listCtx">
            <li v-for="item of showData" :key="item.id">
                <slot v-bind="item">{{ item.id }} 、{{ item.name }}</slot>
            </li>
        </ul>
    </div>
</template>
<script>
import listData from './list-data';
export default {
    name: 'VirtualList',

    props: {
        listData: {
            type: Array,
            default: () => Object.freeze(listData)
        },

        itemHeight: {
            type: [Number, String],
            default: 20
        }
    },

    data() {
        return {
            showCount: 0, //可视区域显示条数
            showData: [],
            startPosition: 0, // 截取开始位置
            endPosition: 0, //截取结束位置
            listCtxNode: null
        }
    },

    computed: {
       totalHeight() {
           return {
               height: this.listData.length * this.itemHeight + 'px',
           };
       }
    },

    watch: {
        
    },

    mounted() {
        this.init();
    },

    methods: {
         init() {
            const listWrapHeight = this.$el.clientHeight;
            this.showCount = Math.ceil(listWrapHeight / this.itemHeight); // 多加几条原因是 防止滚动的时候切换数据导致底部闪烁问题
            this.showData = this.listData.slice(0, this.showCount);
            this.$nextTick(() => {
                this.listCtxNode = this.$refs.listCtx;
            })
        },

        handleScroll() {
            // TODO 考虑防抖、节流函数
            // 滚动条往下滚动，那么为了让可视区域永远显示在页面就需要让可视区域位置反向移动
            const scrollTop = this.$el.scrollTop;
            this.startPosition = Math.floor(scrollTop / this.itemHeight);
            this.endPosition = this.startPosition + this.showCount;
            this.showData = this.listData.slice(this.startPosition, this.endPosition);
            this.listCtxNode.style.webkitTransform = `translate3d(0, ${scrollTop}px, 0)`;
        }
    }

}
</script>
<style scoped >
.virtual-list-wrapper{
    position: relative;
    height: 100%;
    overflow: auto;
}
.list-bar{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: -1;
}
.list-ctx{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
}
ul{
    padding: 0;
    margin: 0;
}
li{
    height: 20px;
}
</style>