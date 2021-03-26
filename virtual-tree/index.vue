<template>
    <!--  -->
    <div class="virtual-tree-wrapper" @scroll="handleScroll">
        <div class="list-bar" :style="totalHeight" ref="listBar"></div>
        <ul class="list-ctx" ref="listCtx">
            <!-- <transition-group name="list"> -->
                <li 
                    v-for="(item, index) of showData" 
                    :key="item.id"
                > 
                    <!-- class="list-item" -->
                    <!-- v-show="item.visible" -->
                    <span>
                        <span 
                            v-for="subItem of item.level" 
                            :key="subItem" class="station-style" 
                            :class="[
                                subItem === item.level ? 'bottom-line' : 'line', 
                                {'last-level-line': !item.children || !item.children.length},
                                {'none-pseudo': subItem === 0 && index === showData.length - 1}
                            ]"
                        />
                    </span>
                    <i 
                        v-show="item.children && item.children.length" 
                        :class="['icon', item.isExpand ? 'icon-close' : 'icon-expand']"
                        @click="handleExpandClick(item, index)" 
                    />
                    <span>{{ item.name }} </span>
                </li>
            <!-- </transition-group> -->
        </ul>
    </div>
</template>
<script>
import treeData from './tree-data';
export default {
    name: 'VirtualTree',

    props: {
        treeData: {
            type: Array,
            default: () => Object.freeze(treeData)
        },

        itemHeight: {
            type: [ String, Number ],
            default: 24
        },

        defaultProps: {
            type: Object,
            default: () => {
                return {
                    id: 'id',
                    children: 'children'
                }
            }
        },
        
        isDefaultExpand: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            dataMap: new Map(),
            showData: [],
            allData: [],
            visibleTrueData: [], // visible 为true的数据
            showCount: 0,
            virtualWrapHeight: 0,
            startPosition: 0,
            endPosition: 0
        }
    },

    computed: {
        totalHeight(){
            return {
                height: this.itemHeight * this.visibleTrueData.length + 'px'
            }
        }
    },

    mounted() {
        this.flatData(this.treeData);
        this.init();
    },

    methods: {
        init() {
            this.virtualWrapHeight = this.$el.clientHeight;
            this.showCount = Math.ceil(this.virtualWrapHeight / this.itemHeight) + 5;
            this.endPosition = this.showCount;
            this.allData = Object.freeze(Array.from(this.dataMap.values()));
            this.updateVisibleTrueData();
        },

        /**
         * 扁平化数组
         */
        flatData(list, level = 0, parentId = 0) {
            // TODO 可换种方式实现，此种方式可能导致内存溢出
            for(let item of list) {
                item.level = level;
                item.pId = parentId;
                if( level === 0 ) {
                    item.visible = true;
                    item.isExpand = false;
                }
                else {
                    item.visible = this.isDefaultExpand;
                    item.isExpand = this.isDefaultExpand;
                }
                
                this.dataMap.set(item.id, item);
                item?.children?.length && this.flatData(item.children, level + 1, item.id);  
            }
        },

        handleScroll() {
            // TODO 还需添加滚动条是否到底部了
            requestAnimationFrame(() => {
                const scrollTop = this.$el.scrollTop;
                const listCtxDoc = this.$refs.listCtx;
                listCtxDoc.style.webkitTransform = `translate3d(0, ${ scrollTop }px, 0)`;
                
                this.startPosition = Math.floor(scrollTop / this.itemHeight);
                this.endPosition = this.startPosition + this.showCount;

                // const scrollHeight = listCtxDoc.scrollHeight;
                // if(this.endPosition >= this.visibleTrueData.length) return;

                this.showData = this.visibleTrueData.slice(this.startPosition, this.endPosition);
            })
        },

        handleExpandClick(item) {
            if(!item?.children?.length) return;

            item.isExpand = !item.isExpand;
            if(item.isExpand) {  // 展开
                this.showChildren(item.children, item.isExpand);
            }
            else{  // 收起来
                this.visibleChildren(item.children);
            }

            this.updateVisibleTrueData();
        },

        visibleChildren(list) {
            for(let item of list) {
                item.visible = false;
                item?.children?.length && this.visibleChildren(item.children);
            }
        },

        showChildren(list, isExpand) {
            for(let item of list) {
                item.visible = isExpand;
                item?.children?.length && this.showChildren(item.children, item.isExpand);
            }
        },

        updateVisibleTrueData() {
            this.visibleTrueData = this.allData.filter(item => item.visible);
            this.showData = this.visibleTrueData.slice(this.startPosition, this.endPosition);
        },
    }
}
</script>
<style scoped>
.list-enter, .list-leave-to {
  opacity: 0;
  transform: translateY( -100% );
}
.list-leave-active {
    /* transform: translateY(0); */
  position: absolute;
}
.list-item{
    transition: position 1s;
}


.virtual-tree-wrapper{
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
    height: 24px;
    text-align: left;
    cursor: pointer;
}
li:last-child{
    margin-bottom: 20px;
}
.station-style{
    display: inline-block;
    height: 20px;
    width: 20px;
}
.bottom-line{
    position: relative;
    z-index: 1;
    display: inline-block;
}
.bottom-line:before{
    position: absolute;
    top: -3px;
    bottom: -6px;
    margin-left: 3px;
    border-left: 1px solid #ccc;
    content: ' ';
}
.bottom-line:after{
    position: absolute;
    width: 15px;
    height: 13px;
    margin-left: 3px;
    border-bottom: 1px solid #ccc;
    content: ' ';
}
.last-level-line:before{
    bottom: 6px;
}

.line{
     position: relative;
    z-index: 1;
    display: inline-block;
}
.line:after{
    position: absolute;
    top: 0;
    bottom: -6px;
    margin-left: 3px;
    border-left: 1px solid #ccc;
    content: ' ';
}
.icon{
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-right: 2px;
    transition: background-image .5s;
}
.icon-expand{
    background-image: url('./icons/expand.png');
}
.icon-close{
    background-image: url('./icons/close.png');
}
.none-pseudo:after{
    content: none;
}

.fade-enter-active{
    transform: translate3d(0, 20px, 0);
}
.fade-leave-active{
    transform: translate3d(0, 0, 0);
}
</style>