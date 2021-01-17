<template>
    <!--  -->
    <div class="virtual-tree-wrapper" @scroll="handleScroll">
        <div class="list-bar" :style="totalHeight" ref="listBar"></div>
        <ul class="list-ctx">
            <li 
                v-for="item of showData" 
                :key="item.id"
            > 
               <span 
                    v-for="subItem of item.level" 
                    :key="subItem" class="station-style" 

                    :class="[
                        subItem === item.level ? 'bottom-line' : 'line', 
                        {'last-level-line': !item.children || !item.children.length}
                    ]"
                ></span>
                 <!-- :class="[subItem === item.level ? 'bottom-line' : 'line']"
                    :class="{'last-level-line': item.level === 3}" -->
               <span>{{ item.name }} </span>
            </li>
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
            default: () => treeData
        },

        itemHeight: {
            type: [String, Number],
            default: 20
        },

        defaultProps: {
            type: Object,
            default: () => {
                return {
                    id: 'id',
                    children: 'children'
                }
            }
        }
    },

    data() {
        return {
            dataMap: new Map(),
            showData: [],
            startPosition: 0,
            endPosition: 0
        }
    },

    computed: {
        totalHeight(){
            return {
                height: this.itemHeight * this.dataMap.size + 'px'
            }
        }
    },

    watch: {
        treeData() {

        }
    },

    mounted() {
        this.flatData(this.treeData);
        this.init();
    },

    methods: {
        init() {
            // const virtualWrapHeight = this.$el.clientHeight;
            // const showCount = Math.ceil(virtualWrapHeight / this.itemHeight);
            this.showData = Array.from(this.dataMap.values());
            console.log(this.dataMap);
        },

        /**
         * 扁平化数组
         */
        flatData(list, level = 0, parentId = 0) {
            // TODO 可换种方式实现，此种方式可能导致内存溢出
            for(let item of  list) {
                item.level = level;
                item.pId = parentId;
                this.dataMap.set(item.id, item);

                item?.children?.length && this.flatData(item.children, level + 1, item.id);  
            }
        },

        handleScroll() {

        }
    }
}
</script>
<style scoped>
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
    top: 0;
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
</style>