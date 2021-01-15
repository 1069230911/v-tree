const surnames = ['赵', '周', '李', '江', '刘', '胡', '孙', '蒋', '葛', '杜'];
const names = ['芳', '冬', '妹', '梅', '华', '虎', '季', '冬梅', '大锤', '几浩']

let data = []

for (let index = 0; index < 1000; index++) {
    const name = surnames[Math.floor(Math.random() * 10)] + names[Math.floor(Math.random() * 10)]
   let obj = {
       id: index + '',
       name
   }
   data.push(obj);
}

export default data;